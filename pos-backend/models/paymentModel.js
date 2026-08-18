const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "PKR" },
    status: { type: String, default: "Pending" },
    method: { type: String, enum: ["Safepay", "EasyPaisa"], required: true },
    email: { type: String },
    contact: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);