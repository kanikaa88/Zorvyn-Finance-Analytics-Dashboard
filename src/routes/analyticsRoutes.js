const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { PERMISSIONS } = require('../config/roles');
const { summaryByDateRangeValidator } = require('../validators/analyticsValidators');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get(
  '/dashboard',
  authorize(PERMISSIONS.VIEW_ANALYTICS),
  analyticsController.getDashboardSummary
);

router.get(
  '/category-breakdown',
  authorize(PERMISSIONS.VIEW_ANALYTICS),
  analyticsController.getCategoryBreakdown
);

router.get(
  '/monthly-trends',
  authorize(PERMISSIONS.VIEW_ANALYTICS),
  analyticsController.getMonthlyTrends
);

router.get(
  '/recent-transactions',
  authorize(PERMISSIONS.VIEW_ANALYTICS),
  analyticsController.getRecentTransactions
);

router.get(
  '/insights/top-spending',
  authorize(PERMISSIONS.VIEW_INSIGHTS),
  analyticsController.getTopSpendingInsight
);

router.get(
  '/summary-by-date-range',
  authorize(PERMISSIONS.VIEW_ANALYTICS),
  summaryByDateRangeValidator,
  validate,
  analyticsController.getSummaryByDateRange
);

router.get(
  '/insights/summary',
  authorize(PERMISSIONS.VIEW_INSIGHTS),
  analyticsController.getAIInsights
);

module.exports = router;
