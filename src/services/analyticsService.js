const FinancialRecord = require('../models/FinancialRecord');
const mongoose = require('mongoose');

/**
 * AnalyticsService - Handles financial analytics and aggregations
 * 
 * SECURITY: User-Level Data Isolation
 * All methods REQUIRE userId as the first parameter.
 * All aggregation pipelines filter by userId in the FIRST $match stage.
 * Users can ONLY see analytics for their own records.
 * See SECURITY.md for detailed documentation.
 */
class AnalyticsService {
  /**
   * Get dashboard summary (total income, expenses, net balance)
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {String} startDate - Optional start date filter
   * @param {String} endDate - Optional end date filter
   * @returns {Object} Summary with totalIncome, totalExpenses, netBalance
   * 
   * SECURITY: Aggregation filters by userId in first $match stage
   */
  async getDashboardSummary(userId, startDate, endDate) {
    const dateFilter = this._buildDateFilter(startDate, endDate);

    // Convert userId to ObjectId for aggregation (handle both string and ObjectId)
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) && typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    // Aggregate income and expenses
    const summary = await FinancialRecord.aggregate([
      {
        $match: {
          userId: userObjectId, // SECURITY: First filter - isolates user data
          isDeleted: false,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Transform results
    const income = summary.find(s => s._id === 'income')?.total || 0;
    const expenses = summary.find(s => s._id === 'expense')?.total || 0;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
      period: {
        startDate: startDate || 'all time',
        endDate: endDate || 'present'
      }
    };
  }

  /**
   * Get spending/income breakdown by category
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {String} type - Optional filter: 'income' or 'expense'
   * @param {String} startDate - Optional start date filter
   * @param {String} endDate - Optional end date filter
   * @returns {Array} Category breakdown with totals and counts
   * 
   * SECURITY: Aggregation filters by userId in first $match stage
   */
  async getCategoryBreakdown(userId, type, startDate, endDate) {
    const dateFilter = this._buildDateFilter(startDate, endDate);
    
    // Convert userId to ObjectId for aggregation (handle both string and ObjectId)
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) && typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;
    
    const matchFilter = {
      userId: userObjectId, // SECURITY: Required - isolates user data
      isDeleted: false,
      ...dateFilter
    };

    if (type) {
      matchFilter.type = type;
    }

    const breakdown = await FinancialRecord.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            category: '$category',
            type: '$type'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          type: '$_id.type',
          total: 1,
          count: 1
        }
      },
      { $sort: { total: -1 } }
    ]);

    return breakdown;
  }

  /**
   * Get monthly income/expense trends
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {Number} months - Number of months to include (default: 6)
   * @returns {Array} Monthly trends with income, expenses, netBalance
   * 
   * SECURITY: Aggregation filters by userId in first $match stage
   */
  async getMonthlyTrends(userId, months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Convert userId to ObjectId for aggregation (handle both string and ObjectId)
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) && typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const trends = await FinancialRecord.aggregate([
      {
        $match: {
          userId: userObjectId, // SECURITY: First filter - isolates user data
          isDeleted: false,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          type: '$_id.type',
          total: 1
        }
      }
    ]);

    // Group by month
    const monthlyData = this._groupTrendsByMonth(trends);

    return monthlyData;
  }

  /**
   * Get recent transactions
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {Number} limit - Number of transactions to return (default: 10)
   * @returns {Array} Recent transactions sorted by date
   * 
   * SECURITY: Query filters by userId - only returns user's transactions
   */
  async getRecentTransactions(userId, limit = 10) {
    const transactions = await FinancialRecord.find({ 
      userId, // SECURITY: Required - isolates user data
      isDeleted: false 
    })
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    return transactions;
  }

  /**
   * Get top spending categories with insights
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {String} startDate - Optional start date filter
   * @param {String} endDate - Optional end date filter
   * @returns {Object} Top 5 spending categories with percentages
   * 
   * SECURITY: Aggregation filters by userId in first $match stage
   */
  async getTopSpendingInsight(userId, startDate, endDate) {
    const dateFilter = this._buildDateFilter(startDate, endDate);

    // Convert userId to ObjectId for aggregation (handle both string and ObjectId)
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) && typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const topSpending = await FinancialRecord.aggregate([
      {
        $match: {
          userId: userObjectId, // SECURITY: First filter - isolates user data
          type: 'expense',
          isDeleted: false,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalSpent: '$total',
          transactionCount: '$count',
          averageAmount: { $round: ['$avgAmount', 2] }
        }
      }
    ]);

    // Calculate total expenses for percentage
    const totalExpenses = topSpending.reduce((sum, cat) => sum + cat.totalSpent, 0);

    const insights = topSpending.map(cat => ({
      ...cat,
      percentageOfTotal: totalExpenses > 0 
        ? Math.round((cat.totalSpent / totalExpenses) * 100) 
        : 0
    }));

    return {
      topCategories: insights,
      totalExpenses,
      period: {
        startDate: startDate || 'all time',
        endDate: endDate || 'present'
      }
    };
  }

  /**
   * Get summary for a specific date range
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {String} startDate - REQUIRED: Start date (ISO format)
   * @param {String} endDate - REQUIRED: End date (ISO format)
   * @returns {Object} Summary with totalIncome, totalExpenses, netBalance for date range
   * 
   * SECURITY: Aggregation filters by userId in first $match stage
   * NOTE: This reuses the same aggregation logic as getDashboardSummary
   */
  async getSummaryByDateRange(userId, startDate, endDate) {
    // Validate that both dates are provided
    if (!startDate || !endDate) {
      throw new Error('Both startDate and endDate are required');
    }

    // Reuse existing aggregation logic
    return this.getDashboardSummary(userId, startDate, endDate);
  }

  /**
   * Get financial insights
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @returns {Array} Array of insight objects with type and message
   * 
   * SECURITY: All aggregations filter by userId
   * Analyzes spending patterns, trends, and provides actionable insights
   */
  async getAIInsights(userId) {
    const insights = [];
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Get all-time category breakdown (same as the chart) and current month data
    const [currentMonth, previousMonth, categoryBreakdown] = await Promise.all([
      this.getDashboardSummary(userId, currentMonthStart.toISOString(), currentMonthEnd.toISOString()),
      this.getDashboardSummary(userId, previousMonthStart.toISOString(), previousMonthEnd.toISOString()),
      this.getCategoryBreakdown(userId, 'expense') // NO DATE FILTER - all time data like the chart
    ]);

    const totalExpenses = categoryBreakdown.reduce((sum, cat) => sum + cat.total, 0);
    const categoriesWithPercentage = categoryBreakdown.map(cat => ({
      ...cat,
      percentage: totalExpenses > 0 ? Math.round((cat.total / totalExpenses) * 100) : 0
    })).sort((a, b) => b.total - a.total);

    if (categoriesWithPercentage.length > 0) {
      const topCategory = categoriesWithPercentage[0];
      insights.push({
        type: 'info',
        message: `${topCategory.category}: ${topCategory.percentage}% of expenses (₹${topCategory.total.toLocaleString('en-IN')})`
      });
    }

    if (categoriesWithPercentage.length > 1) {
      const secondCategory = categoriesWithPercentage[1];
      insights.push({
        type: 'info',
        message: `${secondCategory.category}: ${secondCategory.percentage}% of expenses (₹${secondCategory.total.toLocaleString('en-IN')})`
      });
    }

    if (currentMonth.totalIncome > 0) {
      const savingsRate = ((currentMonth.netBalance / currentMonth.totalIncome) * 100);
      if (savingsRate > 0) {
        insights.push({
          type: savingsRate > 20 ? 'success' : 'info',
          message: `Saving ${savingsRate.toFixed(0)}% of income this month`
        });
      } else {
        insights.push({
          type: 'warning',
          message: `Spending ${Math.abs(savingsRate).toFixed(0)}% more than income`
        });
      }
    }

    if (previousMonth.totalExpenses > 0 && currentMonth.totalExpenses > 0) {
      const expenseChange = ((currentMonth.totalExpenses - previousMonth.totalExpenses) / previousMonth.totalExpenses) * 100;
      if (Math.abs(expenseChange) > 10) {
        insights.push({
          type: expenseChange > 0 ? 'warning' : 'success',
          message: `Expenses ${expenseChange > 0 ? '↑' : '↓'} ${Math.abs(expenseChange).toFixed(0)}% vs last month`
        });
      }
    }

    if (currentMonth.totalExpenses === 0 && currentMonth.totalIncome === 0) {
      insights.push({
        type: 'info',
        message: 'No transactions this month. Start tracking!'
      });
    }

    return insights.slice(0, 4);
  }

  // Helper methods
  _buildDateFilter(startDate, endDate) {
    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    return filter;
  }

  _groupTrendsByMonth(trends) {
    const monthMap = new Map();

    trends.forEach(trend => {
      const key = `${trend.year}-${String(trend.month).padStart(2, '0')}`;
      
      if (!monthMap.has(key)) {
        monthMap.set(key, {
          year: trend.year,
          month: trend.month,
          income: 0,
          expenses: 0
        });
      }

      const monthData = monthMap.get(key);
      if (trend.type === 'income') {
        monthData.income = trend.total;
      } else {
        monthData.expenses = trend.total;
      }
    });

    return Array.from(monthMap.values()).map(data => ({
      ...data,
      netBalance: data.income - data.expenses
    }));
  }
}

module.exports = new AnalyticsService();
