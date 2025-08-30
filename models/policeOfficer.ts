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
    role: {
      type: String,
      default: "police",
      enum: ["rmvAdmin", "admin", "licence", "police"],
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
    policePoints: {
      type: Number,
      default: 0,
      min: 0,
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
    // Authentication related fields
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    temporaryPassword: {
      type: String,
    },
    temporaryPasswordExpiry: {
      type: Date,
    },
    isFirstTimeLogin: {
      type: Boolean,
      default: true,
    },
    hasLoggedIn: {
      type: Boolean,
      default: false,
    },
    lastLoginDate: {
      type: Date,
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

// Indexes for better query performance
policeOfficerSchema.index({ policeNumber: 1 });
policeOfficerSchema.index({ idNumber: 1 });
policeOfficerSchema.index({ fullName: 1 });
policeOfficerSchema.index({ status: 1 });
policeOfficerSchema.index({ email: 1 });
policeOfficerSchema.index({ policeStation: 1 });
policeOfficerSchema.index({ district: 1 });
policeOfficerSchema.index({ rank: 1 });

// Virtual for checking if officer is retired based on age or status
policeOfficerSchema.virtual("isRetired").get(function () {
  return this.status === "retired" || this.age >= 60; // Assuming retirement age is 60
});

// Method to check if temporary password is expired
policeOfficerSchema.methods.isTemporaryPasswordExpired = function () {
  if (!this.temporaryPasswordExpiry) return true;
  return new Date() > this.temporaryPasswordExpiry;
};

// Method to check if officer is active and can perform duties
policeOfficerSchema.methods.canPerformDuties = function () {
  return this.status === "active" && !this.isRetired;
};

// Method to get officer's full identification
policeOfficerSchema.methods.getFullIdentification = function () {
  return {
    name: this.fullName,
    policeNumber: this.policeNumber,
    rank: this.rank,
    station: this.policeStation,
    badgeNo: this.badgeNo,
  };
};

const PoliceOfficer =
  mongoose.models?.PoliceOfficer ||
  mongoose.model("PoliceOfficer", policeOfficerSchema);

export default PoliceOfficer;
