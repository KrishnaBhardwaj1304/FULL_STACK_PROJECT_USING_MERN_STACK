const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Generate unique order number (e.g. SCB-84920)
const generateOrderNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `SCB-${randomNum}`;
};

// @route   POST /api/orders
// @desc    Create a new bakery order
// @access  Public or Protected
router.post('/', async (req, res) => {
  try {
    const {
      items,
      customerInfo,
      fulfillmentType,
      specialInstructions,
      paymentMethod,
      stripePaymentIntentId,
      userId,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({ message: 'Customer name, email, and phone are required' });
    }

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    const deliveryFee = fulfillmentType === 'delivery' ? 4.99 : 0;
    const totalAmount = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

    const order = new Order({
      orderNumber: generateOrderNumber(),
      user: userId || (req.user ? req.user._id : null),
      items: items.map(item => ({
        product: item._id || item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
      customerInfo,
      fulfillmentType: fulfillmentType || 'delivery',
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      paymentMethod: paymentMethod || 'stripe',
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : (stripePaymentIntentId ? 'paid' : 'pending'),
      stripePaymentIntentId: stripePaymentIntentId || '',
      orderStatus: 'Received',
      specialInstructions: specialInstructions || '',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user's orders
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ user: req.user._id }, { 'customerInfo.email': req.user.email }],
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user orders', error: error.message });
  }
});

// @route   GET /api/orders/all
// @desc    Get all orders (Admin only)
// @access  Private / Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.orderStatus = status;
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order details
// @access  Public / Protected
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Baking, Out for Delivery, etc.)
// @access  Private / Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Received', 'Baking', 'Ready for Pickup', 'Out for Delivery', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

module.exports = router;
