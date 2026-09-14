import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export const StripeCheckoutForm = ({ amount, onPaymentSuccess, isProcessing }) => {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardName, setCardName] = useState('Bakery Enthusiast');
  const [error, setError] = useState('');

  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('123');
    setCardName('Jane Dough');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      setError('Please fill in all card details.');
      return;
    }

    // Process payment success callback
    onPaymentSuccess({
      paymentIntentId: `pi_stripe_${Date.now()}`,
      last4: cardNumber.replace(/\s/g, '').slice(-4),
    });
  };

  return (
    <div className="bg-bakery-50 border border-amber-300/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-cinnamon" />
          <h3 className="font-serif font-bold text-bakery-900 text-lg">
            Stripe Secure Payment
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-100/80 px-2.5 py-1 rounded-full">
          <Lock className="w-3 h-3" />
          <span>256-Bit Encrypted</span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-amber-100/60 p-2.5 rounded-xl text-xs text-amber-900 mb-4">
        <span>💳 Test Mode Enabled</span>
        <button
          type="button"
          onClick={fillTestCard}
          className="text-xs bg-white border border-amber-300 font-bold px-2 py-1 rounded hover:bg-amber-50 text-cinnamon transition-colors"
        >
          Auto-fill Test Card
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl mb-4 border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            required
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Jane Dough"
            className="w-full px-3.5 py-2.5 bg-white border border-bakery-200 rounded-xl text-sm focus:outline-none focus:border-cinnamon"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              required
              maxLength={19}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              className="w-full px-3.5 py-2.5 bg-white border border-bakery-200 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:border-cinnamon"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-80">
              <span className="text-[10px] bg-stone-100 font-bold px-1.5 py-0.5 rounded text-stone-600">
                VISA / MC
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Expires (MM/YY)
            </label>
            <input
              type="text"
              required
              maxLength={5}
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
              placeholder="MM/YY"
              className="w-full px-3.5 py-2.5 bg-white border border-bakery-200 rounded-xl text-sm font-mono focus:outline-none focus:border-cinnamon"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              CVC / CVV
            </label>
            <input
              type="password"
              required
              maxLength={4}
              value={cardCvc}
              onChange={(e) => setCardCvc(e.target.value)}
              placeholder="123"
              className="w-full px-3.5 py-2.5 bg-white border border-bakery-200 rounded-xl text-sm font-mono focus:outline-none focus:border-cinnamon"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full mt-2 py-3.5 bg-cinnamon hover:bg-bakery-800 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Pay ${amount.toFixed(2)} with Stripe</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
