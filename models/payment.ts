import mongoose from "mongoose";

const paymentRecordSchema = new mongoose.Schema(
  {
    violationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ViolationRecord",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "lkr",
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash", "bank_transfer"],
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
      sparse: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

paymentRecordSchema.index({ violationId: 1 });
paymentRecordSchema.index({ status: 1 });
paymentRecordSchema.index({ paymentDate: -1 });
paymentRecordSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });

paymentRecordSchema.methods.getPaymentSummary = function () {
  return {
    id: this._id,
    violationId: this.violationId,
    amount: this.amount,
    currency: this.currency,
    status: this.status,
    paymentMethod: this.paymentMethod,
    paymentDate: this.paymentDate,
  };
};

const PaymentRecord =
  mongoose.models?.PaymentRecord ||
  mongoose.model("PaymentRecord", paymentRecordSchema);

export default PaymentRecord;
