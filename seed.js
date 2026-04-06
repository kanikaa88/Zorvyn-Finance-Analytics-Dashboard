require('dotenv').config();
const mongoose = require('mongoose');
const { seedDatabase } = require('./src/utils/seedDatabase');

const runSeed = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Run seed
    await seedDatabase();

    // Disconnect
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

runSeed();
