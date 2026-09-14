const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bakery_db';
    console.log(`Connecting to MongoDB at: ${connUri.startsWith('mongodb+srv') ? 'MongoDB Atlas Cluster' : connUri}`);
    
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('Tip: Ensure your MongoDB Atlas URI is set in server/.env or local MongoDB is running.');
    // Don't kill process immediately so server can still serve mock data or report health if DB is reconnecting
  }
};

module.exports = connectDB;
