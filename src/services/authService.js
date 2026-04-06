const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { AppError } = require('../utils/errorHandler');

class AuthService {
  async register(userData) {
    const { email, password, name, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      role
    });

    // Generate token
    const token = generateToken(user._id);

    return {
      user,
      token
    };
  }

  async login(email, password) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    return {
      user,
      token
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

module.exports = new AuthService();
