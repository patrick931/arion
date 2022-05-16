import mongoose from 'mongoose';
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      uppercase: true,
      required: [true, 'Please enter first name'],
      minlength: [2, 'Minimum length must be 2 characters'],
    },
    lastName: {
      type: String,
      uppercase: true,
      required: [true, 'Please enter last name'],
      minlength: [2, 'Minimum length must be 2 characters'],
    },
    mobile: {
      type: String,
      required: true,
      unique: [true, 'Use a different number, this one is in use'],
      minlength: [10, 'Minimum length must be 10 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Minimum password length must be 6 characters'],
    },
    avatar: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    email_confirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
