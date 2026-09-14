const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  imageUrl: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // allows guest checkout if desired, but associates if logged in
    },
    items: [orderItemSchema],
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        zipCode: { type: String, default: '' },
      },
    },
    fulfillmentType: {
      type: String,
      enum: ['delivery', 'pickup'],
      default: 'delivery',
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cash_on_delivery'],
      default: 'stripe',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    stripePaymentIntentId: {
      type: String,
      default: '',
    },
    orderStatus: {
      type: String,
      enum: ['Received', 'Baking', 'Ready for Pickup', 'Out for Delivery', 'Completed', 'Cancelled'],
      default: 'Received',
    },
    specialInstructions: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
