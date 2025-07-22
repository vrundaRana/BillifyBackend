const Receipt = require('../models/Receipt.models');

const analytics = async (req, res) => {
    try {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startOfThisWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        const userId = req.user.id;
        const allReceipts = await Receipt.find({ userId }).sort({ createdAt: -1 });
        // Total receipts
        const totalReceipts = allReceipts.length;

        // Revenue
        const totalRevenue = allReceipts.reduce((sum, r) => sum + r.totalAmount, 0);

        // Unique customers
        const uniqueCustomers = new Set(allReceipts.map(r => r.customerPhone)).size;

        // Receipts this month
        const thisMonthReceipts = allReceipts.filter(r => new Date(r.createdAt) >= startOfThisMonth);
        const lastMonthReceipts = allReceipts.filter(r =>
            new Date(r.createdAt) >= startOfLastMonth && new Date(r.createdAt) < startOfThisMonth
        );

        const thisMonthRevenue = thisMonthReceipts.reduce((sum, r) => sum + r.totalAmount, 0);
        const lastMonthRevenue = lastMonthReceipts.reduce((sum, r) => sum + r.totalAmount, 0);

        // New customers this week
        const thisWeekReceipts = allReceipts.filter(r => new Date(r.createdAt) >= startOfThisWeek);
        const oneWeekReceipts = allReceipts.filter(r => new Date(r.createdAt) >= oneWeekAgo);
        const newCustomersThisWeek = new Set(thisWeekReceipts.map(r => r.customerPhone)).size;

        // % change calculations
        const percentChange = (current, prev) =>
            prev === 0 ? 100 : ((current - prev) / prev) * 100;

        const receiptGrowth = percentChange(thisMonthReceipts.length, lastMonthReceipts.length);
        const revenueGrowth = percentChange(thisMonthRevenue, lastMonthRevenue);

        res.json({
            totalReceipts,
            totalRevenue,
            totalCustomers: uniqueCustomers,
            receiptGrowth: receiptGrowth.toFixed(2), // %
            revenueGrowth: revenueGrowth.toFixed(2), // %
            newCustomersThisWeek
        });
    } catch (error) {
        console.error(`Error in analytics: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error ❌' });
    }
};

module.exports = analytics;