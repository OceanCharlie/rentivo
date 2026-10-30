const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "propertyschema", required: true },
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: [true, "Please provide a user name"] },
    phone: { type: String, required: [true, "Please provide a phone number"] },
    bookingStatus: {
      type: String,
      enum: ["pending", "booked", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bookingschema", bookingSchema);
