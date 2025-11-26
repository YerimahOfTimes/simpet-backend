const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
    logo: { type: String }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
