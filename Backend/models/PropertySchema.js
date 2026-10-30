const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerName: { type: String },
    propertyType: { type: String, required: true, enum: ["residential", "commercial", "land/plot"] },
    propertyAdType: { type: String, required: true, enum: ["rent", "sale"] },
    propertyAddress: { type: String, required: [true, "Please provide an address"] },
    ownerContact: { type: String, required: [true, "Please provide owner contact"] },
    propertyAmt: { type: Number, default: 0, min: 0 },
    propertyImage: { type: [{ filename: String, path: String }], default: [] },
    additionalInfo: { type: String },
    isAvailable: { type: String, enum: ["Available", "Booked"], default: "Available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("propertyschema", propertySchema);
