const mongoose = require("mongoose");
const validator = require("validator");

let userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    minlength: [8, "Password must be at least 8 characters long"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm Password is required"],
    trim: true,
  },
});

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
