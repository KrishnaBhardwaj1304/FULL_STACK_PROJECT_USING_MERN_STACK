require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for API calls in dev
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// Base Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    bakery: 'Sweet Crust Artisan Bakery API',
    time: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('🥖 Sweet Crust Bakery API is running. Check /api/products or /api/health');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Endpoint ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Bakery Server running at http://localhost:${PORT}`);
});
