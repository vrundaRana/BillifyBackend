const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/, // Basic email format
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, // At least one lowercase, uppercase, and digit
  },
  businessName: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  businessType: {
    type: String,
    required: true,
    enum: ["retail", "restaurant", "service", "freelance", "other"],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);

