const mongoose = require("mongoose")
const ReceiptSchema = new mongoose.Schema({
    receiptNumber: {
        type: String,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerName: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
    },
    customerPhone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    items: [
        {
            name: {
                type: String,
                required: true,
                minlength: 2,
                trim: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0
            },
            total: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    issuedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
})

// Auto-generate receipt number before saving
ReceiptSchema.pre('save', async function(next) {
    if (!this.receiptNumber) {
        const count = await mongoose.model('Receipt').countDocuments();
        this.receiptNumber = `RCP${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

module.exports = mongoose.model("Receipt", ReceiptSchema)