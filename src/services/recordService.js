const FinancialRecord = require('../models/FinancialRecord');
const { AppError } = require('../utils/errorHandler');

/**
 * RecordService - Handles financial record business logic
 * 
 * SECURITY: User-Level Data Isolation
 * All methods REQUIRE userId as the first parameter and enforce strict filtering.
 * Users can ONLY access their own records - no exceptions.
 * See SECURITY.md for detailed documentation.
 */
class RecordService {
  /**
   * Create a new financial record
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {Object} recordData - Record data (amount, type, category, date, notes)
   * @returns {Object} Created record
   * 
   * SECURITY: userId is explicitly set to prevent record creation for other users
   */
  async createRecord(userId, recordData) {
    const record = await FinancialRecord.create({
      ...recordData,
      userId // SECURITY: Explicitly set to authenticated user
    });

    return record;
  }

  /**
   * Get all records for a specific user with filtering and pagination
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {Object} filters - Optional filters (type, category, date range, amount range)
   * @param {Object} pagination - Page and limit
   * @param {Boolean} includeDeleted - Include soft-deleted records (admin only)
   * @returns {Object} Records array and pagination metadata
   * 
   * SECURITY: Query ALWAYS filters by userId - users cannot access other users' records
   */
  async getRecords(userId, filters = {}, pagination = {}, includeDeleted = false) {
    const { type, category, startDate, endDate, minAmount, maxAmount } = filters;
    const { page = 1, limit = 10 } = pagination;

    // Build query - SECURITY: userId filter is MANDATORY
    const query = { userId }; // SECURITY: First and required filter

    // Exclude deleted records by default
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      query.amount = {};
      if (minAmount !== undefined) query.amount.$gte = Number(minAmount);
      if (maxAmount !== undefined) query.amount.$lte = Number(maxAmount);
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      FinancialRecord.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      FinancialRecord.countDocuments(query)
    ]);

    return {
      records,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get a single record by ID
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {ObjectId} recordId - Record ID to fetch
   * @param {Boolean} includeDeleted - Include soft-deleted records (admin only)
   * @returns {Object} Record object
   * @throws {AppError} 404 if record not found or doesn't belong to user
   * 
   * SECURITY: Returns 404 even if record exists but belongs to another user
   * This prevents enumeration attacks and information disclosure
   */
  async getRecordById(userId, recordId, includeDeleted = false) {
    const query = {
      _id: recordId,
      userId // SECURITY: Prevents accessing other users' records
    };

    // Exclude deleted records by default
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const record = await FinancialRecord.findOne(query);

    if (!record) {
      throw new AppError('Record not found', 404);
    }

    return record;
  }

  /**
   * Update a financial record
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {ObjectId} recordId - Record ID to update
   * @param {Object} updateData - Fields to update
   * @returns {Object} Updated record
   * @throws {AppError} 404 if record not found or doesn't belong to user
   * 
   * SECURITY: Both _id AND userId must match - prevents updating other users' records
   */
  async updateRecord(userId, recordId, updateData) {
    const record = await FinancialRecord.findOneAndUpdate(
      { 
        _id: recordId, 
        userId, // SECURITY: Required - user must own the record
        isDeleted: false 
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!record) {
      throw new AppError('Record not found', 404);
    }

    return record;
  }

  /**
   * Soft delete a financial record
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {ObjectId} recordId - Record ID to delete
   * @returns {Object} Deleted record
   * @throws {AppError} 404 if record not found or doesn't belong to user
   * 
   * SECURITY: Both _id AND userId must match - prevents deleting other users' records
   * Note: This is a soft delete (sets isDeleted=true), not a permanent deletion
   */
  async deleteRecord(userId, recordId) {
    // Soft delete: mark as deleted instead of removing
    const record = await FinancialRecord.findOneAndUpdate(
      { 
        _id: recordId, 
        userId, // SECURITY: Required - user must own the record
        isDeleted: false 
      },
      { isDeleted: true },
      { new: true }
    );

    if (!record) {
      throw new AppError('Record not found', 404);
    }

    return record;
  }

  /**
   * Export records to CSV format
   * @param {ObjectId} userId - REQUIRED: Authenticated user's ID (from req.user._id)
   * @param {Object} filters - Optional filters (type, category, date range)
   * @returns {String} CSV formatted string
   * 
   * SECURITY: Only exports user's own records
   */
  async exportRecordsToCSV(userId, filters = {}) {
    const { type, category, startDate, endDate } = filters;

    // Build query - SECURITY: userId filter is MANDATORY
    const query = { userId, isDeleted: false };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Fetch all matching records
    const records = await FinancialRecord.find(query)
      .sort({ date: -1 })
      .lean();

    // Convert to CSV
    const csvHeader = 'Date,Type,Category,Amount,Notes\n';
    const csvRows = records.map(record => {
      const date = new Date(record.date).toISOString().split('T')[0];
      const notes = (record.notes || '').replace(/"/g, '""'); // Escape quotes
      return `${date},${record.type},${record.category},${record.amount},"${notes}"`;
    }).join('\n');

    return csvHeader + csvRows;
  }
}

module.exports = new RecordService();
