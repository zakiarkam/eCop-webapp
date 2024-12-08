import mongoose, { Document, Model, Schema } from "mongoose";

// const validator = require("validator");

interface IUser extends Document {
  rmbname: string;
  rmbdistrict: string;
  rmbprovince: string;
  email: string;
  mobilenumber: string;
  idnumber: string;
  password?: string;
  cpassword?: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  rmbname: {
    type: String,
    required: true,
  },
  rmbdistrict: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    // validate: [validator.isEmail, "Please provide valid email"],
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
    // minlength: 8,
  },
  cpassword: {
    type: String,
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
