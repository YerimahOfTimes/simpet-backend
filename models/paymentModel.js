const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    method: { type: String, required: true },
    amount: Number,
    status: { type: String, default: "pending" },
    details: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
