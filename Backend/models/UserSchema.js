const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "Password is required"] },
    type: { type: String, required: true, enum: ["Admin", "Owner", "Renter"] },
    granted: { type: String, enum: ["granted", "ungranted"], default: "granted" },
    resetCode: { type: String },
    resetCodeExpires: { type: Date },
    resetAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
