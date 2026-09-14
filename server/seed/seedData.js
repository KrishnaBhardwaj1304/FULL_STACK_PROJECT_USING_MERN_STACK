require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const sampleProducts = [
  {
    name: 'Artisan Sourdough Boule',
    description: 'Slow-fermented for 36 hours with wild sourdough starter. Crisp golden crust with an airy, tangy interior crumb.',
    price: 7.50,
    category: 'Breads',
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegan', 'Organic'],
    featured: true,
    rating: 4.9,
    reviewsCount: 48,
    weightOrUnit: '750g loaf',
    ingredients: ['Organic Wheat Flour', 'Wild Sourdough Starter', 'Sea Salt', 'Filtered Water'],
  },
  {
    name: 'French Butter Croissant',
    description: 'Baked fresh every morning with pure cultured Normandy butter. Flaky, shatteringly crisp layers with a golden sheen.',
    price: 3.75,
    category: 'Pastries',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian'],
    featured: true,
    rating: 4.9,
    reviewsCount: 65,
    weightOrUnit: 'per piece',
    ingredients: ['Flour', 'Normandy Butter', 'Whole Milk', 'Yeast', 'Cane Sugar', 'Sea Salt'],
  },
  {
    name: 'Almond Pain au Chocolat',
    description: 'Double-baked croissant filled with rich Belgian dark chocolate batons and frangipane almond cream, topped with toasted sliced almonds.',
    price: 4.95,
    category: 'Pastries',
    imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian'],
    featured: true,
    rating: 4.8,
    reviewsCount: 39,
    weightOrUnit: 'per piece',
    ingredients: ['Flour', 'Butter', 'Belgian Dark Chocolate', 'Almonds', 'Sugar', 'Eggs'],
  },
  {
    name: 'Spiced Cinnamon Brioche Roll',
    description: 'Pillowy brioche swirl loaded with Korintje cinnamon and dark brown sugar, drizzled with warm vanilla cream cheese glaze.',
    price: 4.50,
    category: 'Pastries',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian'],
    featured: true,
    rating: 4.9,
    reviewsCount: 52,
    weightOrUnit: 'per piece',
    ingredients: ['Enriched Flour', 'Butter', 'Korintje Cinnamon', 'Brown Sugar', 'Cream Cheese', 'Vanilla Bean'],
  },
  {
    name: 'Classic Red Velvet Cake Slice',
    description: 'Velvety cocoa sponge layered with silky Madagascar vanilla cream cheese frosting and subtle raspberry coulis.',
    price: 6.25,
    category: 'Cakes',
    imageUrl: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Eggless Available'],
    featured: true,
    rating: 4.7,
    reviewsCount: 31,
    weightOrUnit: '1 generous slice',
    ingredients: ['Dutch Cocoa', 'Buttermilk', 'Madagascar Vanilla', 'Cream Cheese', 'Flour', 'Sugar'],
  },
  {
    name: 'Triple Chocolate Ganache Cake',
    description: 'Decadent Belgian 70% dark chocolate sponge enveloped in silky glossy chocolate ganache and chocolate curls.',
    price: 38.00,
    category: 'Cakes',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian'],
    featured: true,
    rating: 5.0,
    reviewsCount: 29,
    weightOrUnit: '6-inch round (serves 8)',
    ingredients: ['70% Belgian Dark Chocolate', 'Espresso', 'Heavy Cream', 'Organic Eggs', 'Cocoa Powder'],
  },
  {
    name: 'Parisian Macaron Gift Box',
    description: 'Assortment of 6 handcrafted French macarons: Pistachio, Raspberry Rose, Salted Butter Caramel, Dark Chocolate, Vanilla Bean, and Lavender Honey.',
    price: 16.50,
    category: 'Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Gluten-Free', 'Vegetarian'],
    featured: true,
    rating: 4.9,
    reviewsCount: 44,
    weightOrUnit: 'Box of 6',
    ingredients: ['Almond Flour', 'Egg Whites', 'Sugar', 'White Chocolate Ganache', 'Fruit Purees'],
  },
  {
    name: 'Rustic Rosemary Olive Focaccia',
    description: 'Liguriun-style olive oil focaccia studded with Kalamata olives, fresh rosemary needles, and flaky Maldon sea salt crystals.',
    price: 6.50,
    category: 'Breads',
    imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegan'],
    featured: false,
    rating: 4.8,
    reviewsCount: 19,
    weightOrUnit: 'Large quarter sheet',
    ingredients: ['Extra Virgin Olive Oil', 'Flour', 'Kalamata Olives', 'Fresh Rosemary', 'Maldon Salt'],
  },
  {
    name: 'Sea Salt Dark Chocolate Chunk Cookie',
    description: 'Thick, chewy center with crispy edges, stuffed with molten Valrhona dark chocolate chunks and finished with French fleur de sel.',
    price: 3.25,
    category: 'Cookies',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian'],
    featured: true,
    rating: 4.9,
    reviewsCount: 88,
    weightOrUnit: 'per piece (110g)',
    ingredients: ['Valrhona Chocolate', 'Brown Butter', 'Brown Sugar', 'Flour', 'Fleur de Sel'],
  },
  {
    name: 'Spinach & Feta Danish',
    description: 'Flaky laminated pastry filled with baby spinach, tangy Greek barrel-aged feta, roasted garlic, and toasted pine nuts.',
    price: 5.25,
    category: 'Savory',
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian'],
    featured: false,
    rating: 4.7,
    reviewsCount: 22,
    weightOrUnit: 'per piece',
    ingredients: ['Puff Pastry', 'Baby Spinach', 'Greek Feta', 'Garlic', 'Pine Nuts', 'Dill'],
  },
  {
    name: 'Wild Blueberry Buttermilk Scone',
    description: 'Tender, crumbly scone brimming with plump Maine wild blueberries, finished with raw turbinado sugar and lemon glaze.',
    price: 3.95,
    category: 'Pastries',
    imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian'],
    featured: false,
    rating: 4.6,
    reviewsCount: 18,
    weightOrUnit: 'per piece',
    ingredients: ['Maine Blueberries', 'Buttermilk', 'Flour', 'Butter', 'Lemon Zest', 'Turbinado Sugar'],
  },
  {
    name: 'Caramel Pecan Tartlet',
    description: 'Buttery shortcrust pastry filled with gooey bourbon caramel and toasted Georgia pecans.',
    price: 5.50,
    category: 'Pastries',
    imageUrl: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80',
    dietaryTags: ['Vegetarian'],
    featured: false,
    rating: 4.8,
    reviewsCount: 15,
    weightOrUnit: 'per piece',
    ingredients: ['Pecans', 'Bourbon Caramel', 'Shortcrust Butter Pastry', 'Brown Sugar', 'Sea Salt'],
  }
];

const seedDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bakery_db';
    console.log(`Connecting to MongoDB for seeding: ${connUri.startsWith('mongodb+srv') ? 'MongoDB Atlas' : connUri}`);
    await mongoose.connect(connUri);
    console.log('✅ Connected to MongoDB');

    // Clean existing products and test users
    await Product.deleteMany({});
    await User.deleteMany({ email: { $in: ['admin@bakery.com', 'customer@bakery.com'] } });

    console.log('Seeding products...');
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${createdProducts.length} bakery products`);

    console.log('Creating default accounts...');
    const adminUser = new User({
      name: 'Head Baker (Admin)',
      email: 'admin@bakery.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 019-2834',
      address: { street: '124 Flour Street', city: 'Bakersfield', zipCode: '93301' },
    });
    await adminUser.save();

    const customerUser = new User({
      name: 'Jane Dough',
      email: 'customer@bakery.com',
      password: 'customer123',
      role: 'customer',
      phone: '+1 (555) 749-1102',
      address: { street: '42 Sweet Briar Lane', city: 'Bakersfield', zipCode: '93301' },
    });
    await customerUser.save();

    console.log('✅ Seeded default accounts:');
    console.log('   👑 Admin:    admin@bakery.com / admin123');
    console.log('   🥐 Customer: customer@bakery.com / customer123');

    console.log('\n🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
