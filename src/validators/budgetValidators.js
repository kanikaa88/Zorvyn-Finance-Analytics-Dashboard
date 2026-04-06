const { body, query } = require('express-validator');

const createBudgetValidator = [
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('limitAmount')
    .isFloat({ min: 0 })
    .withMessage('Limit amount must be a positive number'),
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  body('year')
    .isInt({ min: 2000 })
    .withMessage('Year must be 2000 or later')
];

const updateBudgetValidator = [
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('limitAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Limit amount must be a positive number'),
  body('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  body('year')
    .optional()
    .isInt({ min: 2000 })
    .withMessage('Year must be 2000 or later')
];

const getBudgetStatusValidator = [
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  query('year')
    .optional()
    .isInt({ min: 2000 })
    .withMessage('Year must be 2000 or later')
];

module.exports = {
  createBudgetValidator,
  updateBudgetValidator,
  getBudgetStatusValidator
};
