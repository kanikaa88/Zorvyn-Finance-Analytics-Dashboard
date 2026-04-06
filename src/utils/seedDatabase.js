const mongoose = require('mongoose');
const User = require('../models/User');
const FinancialRecord = require('../models/FinancialRecord');
const Budget = require('../models/Budget');

/**
 * Seed database with demo users and sample data
 * Run this script to populate the database for demo purposes
 */

const demoUsers = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    email: 'analyst@demo.com',
    password: 'analyst123',
    name: 'Analyst User',
    role: 'analyst'
  },
  {
    email: 'viewer@demo.com',
    password: 'viewer123',
    name: 'Viewer User',
    role: 'viewer'
  }
];

// Sample financial records for the past 6 months
const generateSampleRecords = (userId) => {
  const records = [];
  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Bonus'],
    expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare']
  };

  const now = new Date();
  
  // Generate records for the past 6 months
  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    
    // Add 2-3 income records per month
    const incomeCount = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < incomeCount; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const recordDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      
      records.push({
        userId,
        type: 'income',
        category: categories.income[Math.floor(Math.random() * categories.income.length)],
        amount: Math.floor(Math.random() * 200000) + 150000, // ₹1,50,000-₹3,50,000
        date: recordDate,
        notes: 'Sample income record',
        isDeleted: false
      });
    }
    
    // Add 8-12 expense records per month
    const expenseCount = Math.floor(Math.random() * 5) + 8;
    for (let i = 0; i < expenseCount; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const recordDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      
      records.push({
        userId,
        type: 'expense',
        category: categories.expense[Math.floor(Math.random() * categories.expense.length)],
        amount: Math.floor(Math.random() * 30000) + 3000, // ₹3,000-₹33,000
        date: recordDate,
        notes: 'Sample expense record',
        isDeleted: false
      });
    }
  }
  
  return records;
};

// Sample budgets for current month
const generateSampleBudgets = (userId) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  return [
    {
      userId,
      category: 'Food',
      limitAmount: 50000,
      month: currentMonth,
      year: currentYear
    },
    {
      userId,
      category: 'Transport',
      limitAmount: 20000,
      month: currentMonth,
      year: currentYear
    },
    {
      userId,
      category: 'Entertainment',
      limitAmount: 25000,
      month: currentMonth,
      year: currentYear
    },
    {
      userId,
      category: 'Shopping',
      limitAmount: 30000,
      month: currentMonth,
      year: currentYear
    },
    {
      userId,
      category: 'Bills',
      limitAmount: 40000,
      month: currentMonth,
      year: currentYear
    }
  ];
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing demo data...');
    await User.deleteMany({ email: { $in: demoUsers.map(u => u.email) } });
    
    // Create demo users
    console.log('👥 Creating demo users...');
    const createdUsers = [];
    
    for (const userData of demoUsers) {
      // Don't hash here - let the User model's pre-save hook handle it
      const user = await User.create({
        email: userData.email,
        password: userData.password, // Plain text - will be hashed by pre-save hook
        name: userData.name,
        role: userData.role,
        isActive: true
      });
      createdUsers.push(user);
      console.log(`   ✓ Created ${userData.role}: ${userData.email}`);
    }

    // Create sample data for each user
    for (const user of createdUsers) {
      console.log(`\n📊 Creating sample data for ${user.email}...`);
      
      // Delete existing records for this user
      await FinancialRecord.deleteMany({ userId: user._id });
      await Budget.deleteMany({ userId: user._id });
      
      // Create financial records
      const records = generateSampleRecords(user._id);
      await FinancialRecord.insertMany(records);
      console.log(`   ✓ Created ${records.length} financial records`);
      
      // Create budgets
      const budgets = generateSampleBudgets(user._id);
      await Budget.insertMany(budgets);
      console.log(`   ✓ Created ${budgets.length} budget entries`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    demoUsers.forEach(user => {
      console.log(`${user.role.toUpperCase().padEnd(10)} | ${user.email.padEnd(20)} | ${user.password}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = { seedDatabase };
