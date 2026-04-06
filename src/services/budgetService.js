const Budget = require('../models/Budget');
const FinancialRecord = require('../models/FinancialRecord');
const { AppError } = require('../utils/errorHandler');

/**
 * BudgetService - Handles budget management and tracking
 * 
 * SECURITY: User-Level Data Isolation
 * All methods REQUIRE userId and enforce strict filtering
 */
class BudgetService {
  /**
   * Create a new budget
   * @param {ObjectId} userId - Authenticated user's ID
   * @param {Object} budgetData - Budget data (category, limitAmount, month, year)
   * @returns {Object} Created budget
   */
  async createBudget(userId, budgetData) {
    const budget = await Budget.create({
      ...budgetData,
      userId
    });

    return budget;
  }

  /**
   * Get budget status with actual spending
   * @param {ObjectId} userId - Authenticated user's ID
   * @param {Number} month - Optional month filter
   * @param {Number} year - Optional year filter
   * @returns {Array} Budget status for each category
   */
  async getBudgetStatus(userId, month = null, year = null) {
    // Build budget query
    const budgetQuery = { userId, isDeleted: false };
    
    if (month) budgetQuery.month = Number(month);
    if (year) budgetQuery.year = Number(year);

    // Get all budgets for the user
    const budgets = await Budget.find(budgetQuery).lean();

    if (budgets.length === 0) {
      return [];
    }

    // Calculate actual spending for each budget
    const statusResults = await Promise.all(
      budgets.map(async (budget) => {
        // Get start and end dates for the budget month
        const startDate = new Date(budget.year, budget.month - 1, 1);
        const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59);

        // Aggregate actual spending for this category in this month
        const aggregation = await FinancialRecord.aggregate([
          {
            $match: {
              userId: userId,
              category: budget.category,
              type: 'expense',
              isDeleted: false,
              date: {
                $gte: startDate,
                $lte: endDate
              }
            }
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: '$amount' }
            }
          }
        ]);

        const actualSpent = aggregation.length > 0 ? aggregation[0].totalSpent : 0;
        const percentageUsed = budget.limitAmount > 0 
          ? (actualSpent / budget.limitAmount) * 100 
          : 0;

        // Determine status
        let status;
        if (percentageUsed < 70) {
          status = 'OK';
        } else if (percentageUsed >= 70 && percentageUsed <= 90) {
          status = 'WARNING';
        } else {
          status = 'EXCEEDED';
        }

        return {
          budgetId: budget._id,
          category: budget.category,
          month: budget.month,
          year: budget.year,
          budgetAmount: budget.limitAmount,
          actualSpent: Math.round(actualSpent * 100) / 100,
          percentageUsed: Math.round(percentageUsed * 100) / 100,
          status
        };
      })
    );

    return statusResults;
  }

  /**
   * Get all budgets for a user
   * @param {ObjectId} userId - Authenticated user's ID
   * @returns {Array} User's budgets
   */
  async getBudgets(userId) {
    const budgets = await Budget.find({ userId, isDeleted: false })
      .sort({ year: -1, month: -1 })
      .lean();

    return budgets;
  }

  /**
   * Update a budget
   * @param {ObjectId} userId - Authenticated user's ID
   * @param {ObjectId} budgetId - Budget ID to update
   * @param {Object} updateData - Fields to update
   * @returns {Object} Updated budget
   */
  async updateBudget(userId, budgetId, updateData) {
    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, userId, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    );

    if (!budget) {
      throw new AppError('Budget not found', 404);
    }

    return budget;
  }

  /**
   * Delete a budget
   * @param {ObjectId} userId - Authenticated user's ID
   * @param {ObjectId} budgetId - Budget ID to delete
   * @returns {Object} Deleted budget
   */
  async deleteBudget(userId, budgetId) {
    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, userId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!budget) {
      throw new AppError('Budget not found', 404);
    }

    return budget;
  }
}

module.exports = new BudgetService();
