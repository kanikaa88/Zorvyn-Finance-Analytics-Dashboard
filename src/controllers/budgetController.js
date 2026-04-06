const budgetService = require('../services/budgetService');

class BudgetController {
  async createBudget(req, res, next) {
    try {
      const budget = await budgetService.createBudget(req.user._id, req.body);
      
      res.status(201).json({
        success: true,
        data: { budget }
      });
    } catch (error) {
      next(error);
    }
  }

  async getBudgetStatus(req, res, next) {
    try {
      const { month, year } = req.query;
      
      const status = await budgetService.getBudgetStatus(
        req.user._id,
        month,
        year
      );
      
      res.status(200).json({
        success: true,
        data: { budgets: status }
      });
    } catch (error) {
      next(error);
    }
  }

  async getBudgets(req, res, next) {
    try {
      const budgets = await budgetService.getBudgets(req.user._id);
      
      res.status(200).json({
        success: true,
        data: { budgets }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBudget(req, res, next) {
    try {
      const budget = await budgetService.updateBudget(
        req.user._id,
        req.params.id,
        req.body
      );
      
      res.status(200).json({
        success: true,
        data: { budget }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBudget(req, res, next) {
    try {
      await budgetService.deleteBudget(req.user._id, req.params.id);
      
      res.status(204).json({
        success: true,
        data: null
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BudgetController();
