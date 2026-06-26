import mongoose from "mongoose";

const statuses = [
  "requires_payment_method",
  "requires_confirmation",
  "processing",
  "succeeded",
  "failed",
  "partially_refunded",
  "refunded",
] ;

const validTransitions = {
  requires_payment_method: ["requires_confirmation", "failed"],
  requires_confirmation: ["processing", "failed"],
  processing: ["succeeded", "failed"],
  succeeded: ["partially_refunded", "refunded"],
  failed: [],
  partially_refunded: ["refunded"],
  refunded: [],
};

const PaymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, lowercase: true, match: /^[a-z]{3}$/ },
    status: { type: String, enum: statuses, default: "requires_payment_method" },
    description: { type: String, trim: true, default: "" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    idempotencyKey: { type: String, unique: true, sparse: true },
    provider: { type: String, default: "mock" },
    providerPaymentId: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    errorMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
PaymentSchema.index({ status: 1 });

PaymentSchema.statics.isValidTransition = function (fromStatus, toStatus) {
  return validTransitions[fromStatus]?.includes(toStatus) ?? false;
};

PaymentSchema.methods.canTransitionTo = function (toStatus) {
  return PaymentSchema.statics.isValidTransition(this.status, toStatus);
};

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
export { statuses, validTransitions };
