const express = require('express');
const router = express.Router();
let stripe = null;

if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key')) {
  try {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } catch (err) {
    console.warn('⚠️ Stripe initialization failed:', err.message);
  }
}

// @route   POST /api/payment/create-payment-intent
// @desc    Create Stripe PaymentIntent
// @access  Public
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid payment amount is required' });
    }

    const amountInCents = Math.round(amount * 100);

    // If Stripe secret key is configured and valid
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return res.json({
        clientSecret: paymentIntent.client_secret,
        mode: 'live_stripe',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      });
    }

    // Fallback Mock Mode (when user hasn't added their Stripe test key yet)
    // Allows immediate testing of the checkout flow without crashing
    const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(2, 9)}`;
    res.json({
      clientSecret: mockClientSecret,
      mode: 'mock_stripe',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock',
      message: 'Running in Stripe test simulation mode. Add STRIPE_SECRET_KEY to server/.env to use your live Stripe account.',
    });
  } catch (error) {
    console.error('Stripe PaymentIntent error:', error);
    res.status(500).json({ message: 'Error processing payment intent', error: error.message });
  }
});

// @route   GET /api/payment/config
// @desc    Provide Stripe publishable key to frontend
// @access  Public
router.get('/config', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    isConfigured: Boolean(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('your_stripe')),
  });
});

module.exports = router;
