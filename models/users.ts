import mongoose, { Document, Model, Schema } from "mongoose";

// const validator = require("validator");

interface IUser extends Document {
  fname: string;
  lname: string;
  email: string;
  Mnumber: number;
  password?: string;
  cpassword?: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    // validate: [validator.isEmail, "Please provide valid email"],
  },
  Mnumber: {
    type: Number,
    required: true,
    unique: true,
    // validate: {
    //   validator: function (val) {
    //     return /^[789]\d{9}$/.test(val.toString());
    //   },
    //   message: "Please provide a valid mobile number",
    // },
  },
  password: {
    type: String,
    required: true,
    // minlength: 8,
  },
  cpassword: {
    type: String,
    required: true,
    // validate: {
    //   validator: function (val) {
    //     return val === this.password;
    //   },
    //   message: "Passwords are not same",
    // },
  },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
