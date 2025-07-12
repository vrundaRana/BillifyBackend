const express = require('express');
const { createReceipt, getUserReceipts, getReceiptById } = require('../controllers/receipt-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/', authMiddleware, createReceipt);
router.get('/', authMiddleware, getUserReceipts);
router.get('/:id', authMiddleware, getReceiptById);

module.exports = router;