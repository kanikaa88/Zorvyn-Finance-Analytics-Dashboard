const analyticsService = require('../services/analyticsService');

class AnalyticsController {
  async getDashboardSummary(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      const summary = await analyticsService.getDashboardSummary(
        req.user._id,
        startDate,
        endDate
      );
      
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryBreakdown(req, res, next) {
    try {
      const { type, startDate, endDate } = req.query;

      const breakdown = await analyticsService.getCategoryBreakdown(
        req.user._id,
        type,
        startDate,
        endDate
      );
      
      res.status(200).json({
        success: true,
        data: { breakdown }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMonthlyTrends(req, res, next) {
    try {
      const months = parseInt(req.query.months) || 6;

      const trends = await analyticsService.getMonthlyTrends(req.user._id, months);
      
      res.status(200).json({
        success: true,
        data: { trends }
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentTransactions(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;

      const transactions = await analyticsService.getRecentTransactions(req.user._id, limit);
      
      res.status(200).json({
        success: true,
        data: { transactions }
      });
    } catch (error) {
      next(error);
    }
  }

  async getTopSpendingInsight(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      const insight = await analyticsService.getTopSpendingInsight(
        req.user._id,
        startDate,
        endDate
      );
      
      res.status(200).json({
        success: true,
        data: insight
      });
    } catch (error) {
      next(error);
    }
  }

  async getSummaryByDateRange(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      // Validate required parameters
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Both startDate and endDate are required'
        });
      }

      const summary = await analyticsService.getSummaryByDateRange(
        req.user._id,
        startDate,
        endDate
      );
      
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  async getAIInsights(req, res, next) {
    try {
      const insights = await analyticsService.getAIInsights(req.user._id);
      
      res.status(200).json({
        success: true,
        data: { insights }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
