import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { StripeCheckoutForm } from '../components/StripeCheckoutForm';
import { CheckCircle, ArrowLeft, ShieldCheck, MapPin, Truck, Store, AlertCircle } from 'lucide-react';

export const Checkout = () => {
  const { cart, subtotal, tax, deliveryFee, total, fulfillmentType, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' | 'cash_on_delivery'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderComplete, setOrderComplete] = useState(null);

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-bakery-900 mb-4">No items in your basket</h2>
        <Link to="/" className="px-6 py-2.5 bg-cinnamon text-white font-bold rounded-xl text-sm">
          Return to Menu
        </Link>
      </div>
    );
  }

  // Handle order submission
  const handleProcessOrder = async (stripeData = null) => {
    setErrorMessage('');
    if (!name || !email || !phone) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }

    if (fulfillmentType === 'delivery' && (!street || !city || !zipCode)) {
      setErrorMessage('Please provide your complete delivery address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const orderPayload = {
        items: cart,
        customerInfo: {
          name,
          email,
          phone,
          address: { street, city, zipCode },
        },
        fulfillmentType,
        specialInstructions,
        paymentMethod,
        stripePaymentIntentId: stripeData?.paymentIntentId || '',
        userId: user?._id || null,
      };

      const createdOrder = await api.createOrder(orderPayload);
      clearCart();
      setOrderComplete(createdOrder);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to complete order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success view
  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-bakery-200 shadow-xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-cinnamon block mb-1">
              Order Confirmed & Sent to Baker
            </span>
            <h1 className="font-serif text-3xl font-bold text-bakery-900">
              Thank You, {orderComplete.customerInfo.name}!
            </h1>
            <p className="text-stone-600 text-sm mt-2">
              Your order number is{' '}
              <span className="font-mono font-bold text-cinnamon text-base bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {orderComplete.orderNumber}
              </span>
            </p>
          </div>

          <div className="bg-bakery-50 p-4 rounded-2xl border border-bakery-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-500">Fulfillment:</span>
              <span className="font-bold capitalize text-stone-800">{orderComplete.fulfillmentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Payment:</span>
              <span className="font-bold uppercase text-stone-800">{orderComplete.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Total Paid:</span>
              <span className="font-bold text-cinnamon text-sm">${orderComplete.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Status:</span>
              <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                {orderComplete.orderStatus}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-6 py-3 bg-cinnamon hover:bg-bakery-800 text-white font-bold text-sm rounded-xl shadow-md transition-all"
            >
              Track Order Status
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-bakery-100 hover:bg-bakery-200 text-bakery-900 font-bold text-sm rounded-xl transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-cinnamon transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Basket
      </Link>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-900 mb-8">
        Checkout & Payment
      </h1>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-bakery-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-bakery-900 border-b border-bakery-100 pb-3">
              1. Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Dough"
                  className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Card (If Delivery) */}
          {fulfillmentType === 'delivery' ? (
            <div className="bg-white rounded-3xl p-6 border border-bakery-200 shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-bold text-bakery-900 border-b border-bakery-100 pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cinnamon" />
                2. Delivery Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="42 Sweet Briar Lane, Apt 3B"
                    className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bakersfield"
                      className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">ZIP / Postal Code</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="93301"
                      className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Store className="w-4 h-4 text-cinnamon" />
                <span>Pickup Selected</span>
              </div>
              <p>
                Your fresh order will be prepared and packaged for pickup at our hearth:{' '}
                <strong>124 Flour Street, Bakersfield</strong>.
              </p>
            </div>
          )}

          {/* Special Instructions */}
          <div className="bg-white rounded-3xl p-6 border border-bakery-200 shadow-sm space-y-3">
            <h2 className="font-serif text-base font-bold text-bakery-900">
              Special Baker's Notes (Optional)
            </h2>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Please slice the sourdough boule / Leave at porch."
              className="w-full px-3.5 py-2.5 bg-bakery-50/50 border border-bakery-200 rounded-xl text-xs focus:outline-none focus:border-cinnamon"
            />
          </div>
        </div>

        {/* Right Column: Order Review & Stripe Payment */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Summary Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-bakery-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-bakery-900 border-b border-bakery-100 pb-3">
              Order Items ({cart.length})
            </h3>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-xs py-1 border-b border-stone-50">
                  <span className="font-medium text-stone-800">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-mono font-bold text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-bakery-100 text-xs space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-bakery-900 pt-2 border-t border-bakery-200">
                <span>Total Due</span>
                <span className="font-serif text-xl text-cinnamon">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 border border-bakery-200 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-bakery-900">
              Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'stripe'
                    ? 'border-cinnamon bg-amber-50 text-cinnamon shadow-sm'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>💳 Stripe / Card</span>
                <span className="text-[10px] text-stone-400 font-normal">Instant & Secure</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-cinnamon bg-amber-50 text-cinnamon shadow-sm'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>💵 Pay on Delivery</span>
                <span className="text-[10px] text-stone-400 font-normal">Cash / Counter</span>
              </button>
            </div>

            {paymentMethod === 'stripe' ? (
              <StripeCheckoutForm
                amount={total}
                isProcessing={isSubmitting}
                onPaymentSuccess={handleProcessOrder}
              />
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleProcessOrder(null)}
                className="w-full py-4 bg-bakery-800 hover:bg-cinnamon text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Place Order (Pay on Delivery) - ${total.toFixed(2)}</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
