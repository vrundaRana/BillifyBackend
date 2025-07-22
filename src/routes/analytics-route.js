const authMiddleware = require('../middlewares/auth-middleware');
const analytics = require('../controllers/analytics-controller');
const express = require('express');
const router = express.Router();

router.get('/basicAnalytics', authMiddleware, analytics);

module.exports = router;