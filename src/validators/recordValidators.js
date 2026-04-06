const { body, query } = require('express-validator');

const createRecordValidator = [
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const updateRecordValidator = [
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .optional()
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const getRecordsValidator = [
  query('type')
    .optional({ checkFalsy: true })
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  query('category')
    .optional({ checkFalsy: true })
    .trim(),
  query('startDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Valid start date is required'),
  query('endDate')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Valid end date is required'),
  query('minAmount')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('minAmount must be a positive number'),
  query('maxAmount')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('maxAmount must be a positive number'),
  query('page')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('includeDeleted')
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage('includeDeleted must be a boolean')
];

module.exports = {
  createRecordValidator,
  updateRecordValidator,
  getRecordsValidator
};
