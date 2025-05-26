import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide valid email"],
  },
  mobilenumber: {
    type: String,
    required: true,
    // validate: {
    //   validator: function (val) {
    //     return /^[789]\d{9}$/.test(val.toString());
    //   },
    //   message: "Please provide a valid mobile number",
    // },
  },
  idnumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpassword: {
    type: String,
    // validate: {
    //   validator: function (val) {
    //     return val === this.password;
    //   },
    //   message: "passwords are not the same",
    // },
  },
  role: {
    type: String,
    default: "user",
    enum: ["rmvAdmin", "admin", "driver", "officer"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,
  },
  approvedAt: {
    type: Date,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  gender: {
    type: String,
    enum: ["male", "female"],
  },
  rmbname: {
    type: String,
  },
  rmbdistrict: {
    type: String,
  },
  image: {
    type: String,
  },
  licenseNumber: {
    type: String,
  },
  policeNumber: {
    type: String,
  },
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordTokenExpires: {
    type: Date,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
