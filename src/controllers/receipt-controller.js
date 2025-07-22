const Receipt = require('../models/Receipt.models');

const createReceipt = async (req, res) => {
    try {
        const { customerName, customerPhone, items } = req.body;
        const userId = req.user.id;

        if (!customerName || !customerPhone || !items || items.length === 0) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Calculate totals
        const processedItems = items.map(item => ({
            ...item,
            total: item.quantity * item.price
        }));

        const totalAmount = processedItems.reduce((sum, item) => sum + item.total, 0);

        const newReceipt = new Receipt({
            userId,
            customerName,
            customerPhone,
            items: processedItems,
            totalAmount
        });

        await newReceipt.save();

        res.status(201).json({
            message: 'Receipt created successfully ✅',
            receipt: newReceipt
        });
    } catch (error) {
        console.error(`Error in createReceipt: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error ❌' });
    }
};

const getUserReceipts = async (req, res) => {
    try {
        const userId = req.user.id;
        const receipts = await Receipt.find({ userId }).sort({ createdAt: -1 });

        res.json({
            message: 'Receipts fetched successfully ✅',
            receipts
        });
    } catch (error) {
        console.error(`Error in getUserReceipts: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error ❌' });
    }
};

const getReceiptById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const receipt = await Receipt.findOne({ _id: id, userId });
        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        res.json({
            message: 'Receipt fetched successfully ✅',
            receipt
        });
    } catch (error) {
        console.error(`Error in getReceiptById: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error ❌' });
    }
};


module.exports = { createReceipt, getUserReceipts, getReceiptById };