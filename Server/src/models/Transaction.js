import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
    fromStatus: { type: String, required: true },
    toStatus: { type: String, required: true },
    changedBy: {
      type: String,
      enum: ["system", "user", "provider_webhook", "admin"],
      default: "system",
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

TransactionSchema.index({ payment: 1, createdAt: 1 });

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
