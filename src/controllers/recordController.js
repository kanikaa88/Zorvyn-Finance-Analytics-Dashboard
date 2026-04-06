const recordService = require('../services/recordService');

class RecordController {
  async createRecord(req, res, next) {
    try {
      // Normalize category: capitalize first letter
      if (req.body.category) {
        req.body.category = req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1).toLowerCase();
      }
      
      const record = await recordService.createRecord(req.user._id, req.body);
      
      res.status(201).json({
        success: true,
        data: { record }
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      // Normalize category filter: capitalize first letter
      let category = req.query.category;
      if (category) {
        category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      }
      
      const filters = {
        type: req.query.type,
        category: category,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        minAmount: req.query.minAmount,
        maxAmount: req.query.maxAmount
      };

      const pagination = {
        page: req.query.page || 1,
        limit: req.query.limit || 10
      };

      // Allow admins to include deleted records
      const includeDeleted = req.query.includeDeleted === 'true' && req.user.role === 'admin';

      const result = await recordService.getRecords(req.user._id, filters, pagination, includeDeleted);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const record = await recordService.getRecordById(req.user._id, req.params.id);
      
      res.status(200).json({
        success: true,
        data: { record }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRecord(req, res, next) {
    try {
      // Normalize category: capitalize first letter
      if (req.body.category) {
        req.body.category = req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1).toLowerCase();
      }
      
      const record = await recordService.updateRecord(
        req.user._id,
        req.params.id,
        req.body
      );
      
      res.status(200).json({
        success: true,
        data: { record }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRecord(req, res, next) {
    try {
      await recordService.deleteRecord(req.user._id, req.params.id);
      
      res.status(204).json({
        success: true,
        data: null
      });
    } catch (error) {
      next(error);
    }
  }

  async exportRecords(req, res, next) {
    try {
      const filters = {
        type: req.query.type,
        category: req.query.category,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const csv = await recordService.exportRecordsToCSV(req.user._id, filters);
      
      // Set headers for CSV download
      const filename = `financial-records-${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecordController();
