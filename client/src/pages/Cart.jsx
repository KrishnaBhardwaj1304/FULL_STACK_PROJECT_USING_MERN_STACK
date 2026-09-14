import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Store, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    deliveryFee,
    total,
    fulfillmentType,
    setFulfillmentType,
  } = useCart();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-bakery-100 flex items-center justify-center text-4xl shadow-inner border border-bakery-200">
          🧺
        </div>
        <h2 className="font-serif text-3xl font-bold text-bakery-900 mb-2">
          Your Bakery Basket is Empty
        </h2>
        <p className="text-stone-600 text-sm max-w-md mx-auto mb-8">
          The ovens are firing! Fill your basket with hot artisan sourdough, flaky croissants, and delicious pastries.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-cinnamon hover:bg-bakery-800 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Fresh Bakes</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-bakery-200 mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-900">
            Your Bakery Basket
          </h1>
          <p className="text-xs text-stone-500 mt-1">Review your freshly baked items before ordering</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-stone-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-bakery-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-bakery-300"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover border border-bakery-100 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cinnamon bg-amber-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="font-serif font-bold text-base text-bakery-900 mt-1">
                    {item.name}
                  </h3>
                  <span className="text-xs text-stone-500 italic block">
                    ${item.price.toFixed(2)} {item.weightOrUnit ? `(${item.weightOrUnit})` : ''}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-bakery-100">
                {/* Stepper */}
                <div className="flex items-center border border-bakery-300 rounded-xl overflow-hidden bg-bakery-50">
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    className="p-2 hover:bg-bakery-200 text-stone-700 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-bold text-xs text-stone-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, 1)}
                    className="p-2 hover:bg-bakery-200 text-stone-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line Total */}
                <span className="font-serif font-bold text-lg text-cinnamon min-w-[70px] text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-bakery-800 hover:text-cinnamon transition-colors pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-bakery-200 shadow-md space-y-6">
          <h2 className="font-serif text-xl font-bold text-bakery-900 border-b border-bakery-100 pb-3">
            Order Summary
          </h2>

          {/* Fulfillment Toggle */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              Fulfillment Method:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                  fulfillmentType === 'delivery'
                    ? 'border-cinnamon bg-amber-50/70 text-cinnamon shadow-sm'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Truck className="w-4 h-4 mb-1" />
                <span>Door Delivery</span>
                <span className="text-[10px] font-normal text-stone-500">$4.99</span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                  fulfillmentType === 'pickup'
                    ? 'border-cinnamon bg-amber-50/70 text-cinnamon shadow-sm'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <Store className="w-4 h-4 mb-1" />
                <span>Store Pickup</span>
                <span className="text-[10px] font-normal text-emerald-600">Free</span>
              </button>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="space-y-3 text-sm border-t border-bakery-100 pt-4">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-medium text-stone-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Estimated Tax (8%)</span>
              <span className="font-medium text-stone-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee</span>
              <span className="font-medium text-stone-900">
                {deliveryFee === 0 ? <span className="text-emerald-600">Free</span> : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-bakery-900 border-t border-bakery-200 pt-3">
              <span>Total</span>
              <span className="font-serif text-2xl text-cinnamon">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Proceed to checkout button */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-cinnamon hover:bg-bakery-800 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-[11px] text-center text-stone-400">
            🔒 Checkout is secured with 256-bit encryption & Stripe.
          </p>
        </div>
      </div>
    </div>
  );
};
