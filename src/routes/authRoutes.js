const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { registerValidator, loginValidator } = require('../validators/authValidators');
const { authRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authRateLimiter, registerValidator, validate, authController.register);
router.post('/login', authRateLimiter, loginValidator, validate, authController.login);
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
