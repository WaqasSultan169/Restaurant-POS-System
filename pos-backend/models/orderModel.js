const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      guests: { type: Number, required: true },
      email: { type: String, default: "" },
      orderType: { type: String, default: "Dine in" },
      tableNo: { type: String, default: "N/A" }
    },
    orderStatus: {
      type: String,
      required: true,
      default: "In Progress"
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "Safepay", "EasyPaisa"]
    },
    paymentId: {
      type: String,
      default: null
    },
    orderDate: {
      type: Date,
      default: Date.now // Pass reference, not executed Date.now()
    },
    bills: {
      total: { type: Number, required: true },
      tax: { type: Number, required: true },
      totalWithTax: { type: Number, required: true }
    },
    items: {
      type: Array,
      required: true
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);