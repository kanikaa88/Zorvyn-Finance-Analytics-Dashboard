const { query } = require('express-validator');

const summaryByDateRangeValidator = [
  query('startDate')
    .notEmpty()
    .withMessage('startDate is required')
    .isISO8601()
    .withMessage('startDate must be a valid ISO 8601 date'),
  query('endDate')
    .notEmpty()
    .withMessage('endDate is required')
    .isISO8601()
    .withMessage('endDate must be a valid ISO 8601 date')
    .custom((endDate, { req }) => {
      if (req.query.startDate && new Date(endDate) < new Date(req.query.startDate)) {
        throw new Error('endDate must be after startDate');
      }
      return true;
    })
];

module.exports = {
  summaryByDateRangeValidator
};
