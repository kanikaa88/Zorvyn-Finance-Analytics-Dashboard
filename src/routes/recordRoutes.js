const express = require('express');
const recordController = require('../controllers/recordController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { PERMISSIONS } = require('../config/roles');
const {
  createRecordValidator,
  updateRecordValidator,
  getRecordsValidator
} = require('../validators/recordValidators');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get(
  '/export',
  authorize(PERMISSIONS.READ_RECORDS),
  recordController.exportRecords
);

router
  .route('/')
  .get(
    authorize(PERMISSIONS.READ_RECORDS),
    getRecordsValidator,
    validate,
    recordController.getRecords
  )
  .post(
    authorize(PERMISSIONS.CREATE_RECORDS),
    createRecordValidator,
    validate,
    recordController.createRecord
  );

router
  .route('/:id')
  .get(
    authorize(PERMISSIONS.READ_RECORDS),
    recordController.getRecordById
  )
  .patch(
    authorize(PERMISSIONS.UPDATE_RECORDS),
    updateRecordValidator,
    validate,
    recordController.updateRecord
  )
  .delete(
    authorize(PERMISSIONS.DELETE_RECORDS),
    recordController.deleteRecord
  );

module.exports = router;
