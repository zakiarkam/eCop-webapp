import mongoose from "mongoose";

const policeOfficerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    nameWithInitials: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    policeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    policeStation: {
      type: String,
      required: true,
      trim: true,
    },
    badgeNo: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^(?:\+94|0)?[0-9]{9}$/.test(v.replace(/\s/g, ""));
        },
        message: "Please enter a valid phone number",
      },
    },

    rank: {
      type: String,
      required: true,
      enum: [
        "Inspector General of Police (IGP)",
        "Deputy Inspector General (DIG)",
        "Senior Superintendent of Police (SSP)",
        "Superintendent of Police (SP)",
        "Assistant Superintendent of Police (ASP)",
        "Chief Inspector (CI)",
        "Inspector (IP)",
        "Sub Inspector (SI)",
        "Police Sergeant (PS)",
        "Police Constable (PC)",
      ],
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "retired"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const PoliceOfficer =
  mongoose.models?.PoliceOfficer ||
  mongoose.model("PoliceOfficer", policeOfficerSchema);

export default PoliceOfficer;
