const fs = require("fs");
const path = require("path");
const Property = require("../models/PropertySchema");
const Booking = require("../models/BookingSchema");

const PROPERTY_FIELDS = ["propertyType", "propertyAdType", "propertyAddress", "ownerContact", "propertyAmt", "additionalInfo"];

const pickFields = (body) =>
  PROPERTY_FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

const toImage = (file) => ({ filename: file.filename, path: `/uploads/${file.filename}` });

const removeImages = (images = []) => {
  images.forEach((img) => {
    fs.unlink(path.join(__dirname, "..", "uploads", img.filename), () => {});
  });
};

// --- ADD PROPERTY ---
const addPropertyController = async (req, res) => {
  try {
    const property = await Property.create({
      ...pickFields(req.body),
      propertyImage: (req.files || []).map(toImage),
      ownerId: req.user._id,
      ownerName: req.user.name,
      isAvailable: "Available",
    });
    return res.status(201).send({ success: true, message: "Properti berhasil ditambahkan", data: property });
  } catch (error) {
    console.error("Add Property Error:", error);
    removeImages((req.files || []).map(toImage));
    const status = error.name === "ValidationError" ? 400 : 500;
    return res.status(status).send({ success: false, message: error.message });
  }
};

// --- GET ALL PROPERTIES BY OWNER ---
const getAllOwnerPropertiesController = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).send({ success: true, data: properties });
  } catch (error) {
    console.error("Get Owner Properties Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- UPDATE PROPERTY ---
const updatePropertyController = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.propertyid, ownerId: req.user._id });
    if (!property) {
      return res.status(404).send({ success: false, message: "Properti tidak ditemukan" });
    }

    Object.assign(property, pickFields(req.body));
    if (req.file) {
      removeImages(property.propertyImage);
      property.propertyImage = [toImage(req.file)];
    }
    await property.save();

    return res.status(200).send({ success: true, message: "Properti berhasil diperbarui", data: property });
  } catch (error) {
    console.error("Update Property Error:", error);
    const status = error.name === "ValidationError" ? 400 : 500;
    return res.status(status).send({ success: false, message: error.message });
  }
};

// --- DELETE PROPERTY ---
const deletePropertyController = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.propertyid, ownerId: req.user._id });
    if (!property) {
      return res.status(404).send({ success: false, message: "Properti tidak ditemukan" });
    }
    removeImages(property.propertyImage);
    await Booking.updateMany(
      { propertyId: property._id, bookingStatus: "pending" },
      { bookingStatus: "rejected" }
    );
    return res.status(200).send({ success: true, message: "Properti berhasil dihapus" });
  } catch (error) {
    console.error("Delete Property Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- GET ALL BOOKINGS FOR OWNER ---
const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerID: req.user._id })
      .populate("propertyId", "propertyAddress propertyType propertyAdType propertyAmt isAvailable")
      .sort({ createdAt: -1 });
    return res.status(200).send({ success: true, data: bookings });
  } catch (error) {
    console.error("Get Owner Bookings Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- HANDLE BOOKING STATUS (booked / pending / rejected) ---
const handleAllBookingstatusController = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    if (!["booked", "pending", "rejected"].includes(status)) {
      return res.status(400).send({ success: false, message: "Status tidak valid" });
    }

    const booking = await Booking.findOne({ _id: bookingId, ownerID: req.user._id });
    if (!booking) {
      return res.status(404).send({ success: false, message: "Booking tidak ditemukan" });
    }
    if (booking.bookingStatus === "cancelled") {
      return res.status(200).send({ success: false, message: "Booking sudah dibatalkan oleh penyewa" });
    }

    const property = await Property.findById(booking.propertyId);
    if (!property) {
      return res.status(404).send({ success: false, message: "Properti tidak ditemukan" });
    }

    if (status === "booked") {
      const otherBooked = await Booking.findOne({
        propertyId: property._id,
        bookingStatus: "booked",
        _id: { $ne: booking._id },
      });
      if (otherBooked) {
        return res.status(200).send({ success: false, message: "Properti sudah dibooking penyewa lain" });
      }
      property.isAvailable = "Booked";
      // Automatically reject the other pending requests for this property
      await Booking.updateMany(
        { propertyId: property._id, bookingStatus: "pending", _id: { $ne: booking._id } },
        { bookingStatus: "rejected" }
      );
    } else if (booking.bookingStatus === "booked") {
      property.isAvailable = "Available";
    }

    booking.bookingStatus = status;
    await booking.save();
    await property.save();

    return res.status(200).send({ success: true, message: `Status booking diubah menjadi ${status}` });
  } catch (error) {
    console.error("Handle Booking Status Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addPropertyController,
  getAllOwnerPropertiesController,
  updatePropertyController,
  deletePropertyController,
  getAllBookingsController,
  handleAllBookingstatusController,
};
