const User = require("../models/UserSchema");
const Property = require("../models/PropertySchema");
const Booking = require("../models/BookingSchema");

// --- GET ALL USERS ---
const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -resetCode -resetCodeExpires -resetAttempts").sort({ createdAt: -1 });
    return res.status(200).send({ success: true, data: users });
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- GRANT / REVOKE OWNER ---
const handleStatusController = async (req, res) => {
  try {
    const { userid, status } = req.body;
    if (!["granted", "ungranted"].includes(status)) {
      return res.status(400).send({ success: false, message: "Status tidak valid" });
    }
    const user = await User.findOneAndUpdate(
      { _id: userid, type: "Owner" },
      { granted: status },
      { returnDocument: "after" }
    );
    if (!user) {
      return res.status(404).send({ success: false, message: "Owner tidak ditemukan" });
    }
    return res.status(200).send({ success: true, message: `Owner ${user.name} sekarang ${status}` });
  } catch (error) {
    console.error("Handle Status Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- GET ALL PROPERTIES ---
const getAllPropertiesController = async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });
    return res.status(200).send({ success: true, data: properties });
  } catch (error) {
    console.error("Get Properties Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- GET ALL BOOKINGS ---
const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("propertyId", "propertyAddress propertyAmt")
      .sort({ createdAt: -1 });
    return res.status(200).send({ success: true, data: bookings });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAllUsersController,
  handleStatusController,
  getAllPropertiesController,
  getAllBookingsController,
};
