const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/products
// @desc    Get all products with filtering & search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, dietary, featured } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (dietary && dietary !== 'All') {
      query.dietaryTags = { $in: [dietary] };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a new bakery product
// @access  Private / Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      imageUrl,
      dietaryTags,
      featured,
      inStock,
      weightOrUnit,
      ingredients,
    } = req.body;

    if (!name || !description || !price || !imageUrl) {
      return res.status(400).json({ message: 'Please provide name, description, price, and imageUrl' });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category: category || 'Pastries',
      imageUrl,
      dietaryTags: Array.isArray(dietaryTags) ? dietaryTags : (dietaryTags ? dietaryTags.split(',').map(s => s.trim()) : []),
      featured: Boolean(featured),
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      weightOrUnit: weightOrUnit || 'per piece',
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map(s => s.trim()) : []),
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update an existing bakery product
// @access  Private / Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updates = req.body;
    if (updates.dietaryTags && typeof updates.dietaryTags === 'string') {
      updates.dietaryTags = updates.dietaryTags.split(',').map(s => s.trim());
    }
    if (updates.ingredients && typeof updates.ingredients === 'string') {
      updates.ingredients = updates.ingredients.split(',').map(s => s.trim());
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a bakery product
// @access  Private / Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;
