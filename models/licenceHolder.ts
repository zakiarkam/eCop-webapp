import mongoose from "mongoose";

const licenceSchema = new mongoose.Schema(
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
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      trim: true,
    },
    licenceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    currentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    vehicleCategories: [
      {
        category: {
          type: String,
          required: true,
          enum: [
            "A1",
            "A",
            "B1",
            "B",
            "C1",
            "C",
            "CE",
            "D1",
            "D",
            "DE",
            "G1",
            "G",
            "J",
          ],
        },
        issueDate: {
          type: Date,
          required: true,
        },
        expiryDate: {
          type: Date,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "expired", "suspended", "revoked"],
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

licenceSchema.index({ idNumber: 1 });
licenceSchema.index({ licenceNumber: 1 });
licenceSchema.index({ fullName: 1 });
licenceSchema.index({ status: 1 });

// Virtual for checking if licence is expired
licenceSchema.virtual("isExpired").get(function () {
  return new Date() > this.expiryDate;
});

// Method to check if specific vehicle category is expired
licenceSchema.methods.isCategoryExpired = function (category: any) {
  const vehicleCategory = this.vehicleCategories.find(
    (vc: { category: any }) => vc.category === category
  );
  if (!vehicleCategory) return true;
  return new Date() > vehicleCategory.expiryDate;
};

const licence =
  mongoose.models.licence || mongoose.model("licence", licenceSchema);

export default licence;
