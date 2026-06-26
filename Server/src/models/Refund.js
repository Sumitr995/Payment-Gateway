import mongoose from "mongoose";

const RefundSchema = new mongoose.Schema(
  {
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, lowercase: true, match: /^[a-z]{3}$/ },
    reason: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
    providerRefundId: { type: String, default: "" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

RefundSchema.index({ payment: 1, createdAt: -1 });

const Refund = mongoose.model("Refund", RefundSchema);

export default Refund;
