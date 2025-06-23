import mongoose from "mongoose";

const violationRecordSchema = new mongoose.Schema(
  {
    licenceNumber: {
      type: String,
      required: true,
      trim: true,
    },
    licenceHolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "licence",
      required: true,
    },
    policeNumber: {
      type: String,
      required: true,
      trim: true,
    },
    policeOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoliceOfficer",
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    placeOfViolation: {
      type: String,
      required: true,
      trim: true,
    },
    ruleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rule",
      required: true,
    },
    ruleSection: {
      type: String,
      required: true,
    },
    ruleProvision: {
      type: String,
      required: true,
    },
    fine: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    violationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

violationRecordSchema.index({ licenceNumber: 1 });
violationRecordSchema.index({ licenceHolderId: 1 });
violationRecordSchema.index({ policeNumber: 1 });
violationRecordSchema.index({ policeOfficerId: 1 });
violationRecordSchema.index({ violationDate: -1 });
violationRecordSchema.index({ status: 1 });
violationRecordSchema.index({ ruleId: 1 });

violationRecordSchema.methods.getViolationSummary = function () {
  return {
    id: this._id,
    licenceNumber: this.licenceNumber,
    policeNumber: this.policeNumber,
    vehicleNumber: this.vehicleNumber,
    ruleSection: this.ruleSection,
    fine: this.fine,
    points: this.points,
    violationDate: this.violationDate,
  };
};

const ViolationRecord =
  mongoose.models?.ViolationRecord ||
  mongoose.model("ViolationRecord", violationRecordSchema);

export default ViolationRecord;
