const mongoose = require('mongoose')


// Define the User Schema
const userSchema = new mongoose.Schema (
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true, // Automatically converts email to lowercase
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    otp: {
      type: String
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    otpExpire:{
      type: Date
    },
  },

  {
    // Automatically creates 'createdAt' and 'updatedAt' fields
    timestamps: true,
    versionKey: false
  }
);

// Compile the schema into a model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel
