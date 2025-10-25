const Payment = require("../models/paymentModel");

exports.createPayment = async (req, res) => {
  try {
    const { method, amount, details } = req.body;
    const payment = await Payment.create({
      userId: req.user.id,
      method,
      amount,
      details,
      status: "successful",
    });
    res.json({ message: "Payment recorded successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Payment failed", error });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments", error });
  }
};
