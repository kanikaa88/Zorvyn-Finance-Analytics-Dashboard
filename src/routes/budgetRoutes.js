const express = require('express');
const budgetController = require('../controllers/budgetController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { PERMISSIONS } = require('../config/roles');
const {
  createBudgetValidator,
  updateBudgetValidator,
  getBudgetStatusValidator
} = require('../validators/budgetValidators');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', authorize(PERMISSIONS.CREATE_BUDGETS), createBudgetValidator, validate, budgetController.createBudget);
router.get('/status', authorize(PERMISSIONS.READ_BUDGETS), getBudgetStatusValidator, validate, budgetController.getBudgetStatus);
router.get('/', authorize(PERMISSIONS.READ_BUDGETS), budgetController.getBudgets);
router.put('/:id', authorize(PERMISSIONS.UPDATE_BUDGETS), updateBudgetValidator, validate, budgetController.updateBudget);
router.delete('/:id', authorize(PERMISSIONS.DELETE_BUDGETS), budgetController.deleteBudget);

module.exports = router;
