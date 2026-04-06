const { body } = require('express-validator');
const { ROLES } = require('../config/roles');

const registerValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role')
];

const loginValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = {
  registerValidator,
  loginValidator
};
