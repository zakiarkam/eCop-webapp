import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    provision: {
      type: String,
      required: true,
      trim: true,
    },
    fine: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
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

ruleSchema.index({ section: 1 });
ruleSchema.index({ status: 1 });
ruleSchema.index({ points: 1 });

const Rule = mongoose.models.Rule || mongoose.model("Rule", ruleSchema);

export default Rule;
