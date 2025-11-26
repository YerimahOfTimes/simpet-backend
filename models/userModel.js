const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Sub-schemas
const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home", trim: true },
  address: { type: String, trim: true },
});

const notificationSchema = new mongoose.Schema({
  email: { type: Boolean, default: true },
  sms: { type: Boolean, default: false },
  newProductAlerts: { type: Boolean, default: true },
});

const shopSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  description: { type: String, trim: true },
  logo: { type: String, trim: true },
});

const bankSchema = new mongoose.Schema({
  accountName: { type: String, trim: true },
  accountNumber: { type: String, trim: true },
  bankName: { type: String, trim: true },
});

// Main User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },

    phoneCountryCode: {
      type: String,
      default: "+234",
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    age: {
      type: Number,
      min: 0,
      max: 120,
    },

    address: {
      type: String,
      trim: true,
    },

    addresses: [addressSchema], // multiple saved addresses

    profileImage: {
      type: String,
      default: "",
    },

    notification: {
      type: notificationSchema,
      default: () => ({}),
    },

    paymentPreference: {
      type: String,
      enum: ["Bank Transfer", "Card", "Pay on Meeting"],
      default: "Bank Transfer",
    },

    // Seller Section
    isSeller: {
      type: Boolean,
      default: false,
    },

    shop: {
      type: shopSchema,
      default: () => ({}),
    },

    bank: {
      type: bankSchema,
      default: () => ({}),
    },

    sellerAgreementAccepted: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // ---------------------------
    // ⭐ Updated Role System
    // ---------------------------
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    // ---------------------------

    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Export model
module.exports = mongoose.model("User", userSchema);

