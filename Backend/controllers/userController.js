const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const Property = require("../models/PropertySchema");
const Booking = require("../models/BookingSchema");
const { sendResetCode } = require("../config/mailer");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
};

// --- REGISTER ---
const registerController = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    if (!name || !email || !password || !type) {
      return res.status(400).send({ success: false, message: "Semua field wajib diisi" });
    }
    // Admin accounts are only created from the server (npm run create-admin)
    if (!["Renter", "Owner"].includes(type)) {
      return res.status(400).send({ success: false, message: "Tipe akun tidak valid" });
    }
    if (password.length < 6) {
      return res.status(400).send({ success: false, message: "Password minimal 6 karakter" });
    }

    const existsUser = await User.findOne({ email: email.toLowerCase() });
    if (existsUser) {
      return res.status(200).send({ success: false, message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      type,
      granted: type === "Owner" ? "ungranted" : "granted",
    });

    return res.status(201).send({ success: true, message: "Registrasi berhasil" });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- LOGIN ---
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(200).send({ success: false, message: "Email atau password salah" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
    res.cookie("token", token, cookieOptions);

    return res.status(200).send({
      success: true,
      message: "Login berhasil",
      user: { _id: user._id, name: user.name, email: user.email, type: user.type, granted: user.granted },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- LOGOUT ---
const logoutController = (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
  return res.status(200).send({ success: true, message: "Logout berhasil" });
};

// --- FORGOT PASSWORD: REQUEST CODE ---
const forgotPasswordRequestController = async (req, res) => {
  const genericResponse = {
    success: true,
    message: "Jika email terdaftar, kode reset telah dikirim",
  };
  try {
    const user = await User.findOne({ email: (req.body.email || "").toLowerCase() });
    if (!user) return res.status(200).send(genericResponse);

    const code = crypto.randomInt(100000, 1000000).toString();
    user.resetCode = await bcrypt.hash(code, 10);
    user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.resetAttempts = 0;
    await user.save();

    await sendResetCode(user.email, code);
    return res.status(200).send(genericResponse);
  } catch (error) {
    console.error("Forgot Password Request Error:", error);
    return res.status(500).send({ success: false, message: "Gagal mengirim kode reset" });
  }
};

// --- FORGOT PASSWORD: RESET WITH CODE ---
const forgotPasswordResetController = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const invalid = { success: false, message: "Kode tidak valid atau sudah kedaluwarsa" };

    if (!password || password.length < 6) {
      return res.status(400).send({ success: false, message: "Password minimal 6 karakter" });
    }

    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !user.resetCode || user.resetCodeExpires < new Date()) {
      return res.status(200).send(invalid);
    }

    const isMatch = await bcrypt.compare(String(otp || ""), user.resetCode);
    if (!isMatch) {
      user.resetAttempts += 1;
      // Cancel the code after 5 wrong attempts
      if (user.resetAttempts >= 5) {
        user.resetCode = undefined;
        user.resetCodeExpires = undefined;
      }
      await user.save();
      return res.status(200).send(invalid);
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    user.resetAttempts = 0;
    await user.save();

    return res.status(200).send({ success: true, message: "Password berhasil diubah" });
  } catch (error) {
    console.error("Forgot Password Reset Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- GET AUTH USER DATA ---
const authController = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -resetCode -resetCodeExpires -resetAttempts");
    if (!user) {
      return res.status(404).send({ success: false, message: "User tidak ditemukan" });
    }
    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- GET ALL PROPERTIES (PUBLIC) ---
const getAllPropertiesController = async (req, res) => {
  try {
    const allProperties = await Property.find({}).sort({ createdAt: -1 });
    return res.status(200).send({ success: true, data: allProperties });
  } catch (error) {
    console.error("Get Properties Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- HANDLE BOOKING (RENTER) ---
const bookingHandleController = async (req, res) => {
  try {
    const { userDetails } = req.body;
    if (!userDetails?.fullName || !userDetails?.phone) {
      return res.status(400).send({ success: false, message: "Nama dan nomor telepon wajib diisi" });
    }

    const property = await Property.findById(req.params.propertyid);
    if (!property) {
      return res.status(404).send({ success: false, message: "Properti tidak ditemukan" });
    }
    if (property.isAvailable !== "Available") {
      return res.status(200).send({ success: false, message: "Properti tidak tersedia" });
    }

    const existing = await Booking.findOne({
      propertyId: property._id,
      userID: req.userId,
      bookingStatus: "pending",
    });
    if (existing) {
      return res.status(200).send({ success: false, message: "Anda sudah mengajukan booking untuk properti ini" });
    }

    await Booking.create({
      propertyId: property._id,
      ownerID: property.ownerId,
      userID: req.userId,
      userName: userDetails.fullName,
      phone: userDetails.phone,
      bookingStatus: "pending",
    });

    return res.status(201).send({ success: true, message: "Permintaan booking terkirim" });
  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- GET ALL BOOKINGS (RENTER) ---
const getAllBookingsController = async (req, res) => {
  try {
    const bookings = await Booking.find({ userID: req.userId })
      .populate("propertyId", "propertyAddress propertyType propertyAdType propertyAmt ownerContact")
      .sort({ createdAt: -1 });
    return res.status(200).send({ success: true, data: bookings });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

// --- CANCEL BOOKING (RENTER, soft cancel to keep history) ---
const cancelBookingController = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.bookingid, userID: req.userId });
    if (!booking) {
      return res.status(404).send({ success: false, message: "Booking tidak ditemukan" });
    }
    if (booking.bookingStatus !== "pending") {
      return res.status(200).send({ success: false, message: "Hanya booking pending yang bisa dibatalkan" });
    }

    booking.bookingStatus = "cancelled";
    await booking.save();
    return res.status(200).send({ success: true, message: "Booking dibatalkan" });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  forgotPasswordRequestController,
  forgotPasswordResetController,
  authController,
  getAllPropertiesController,
  bookingHandleController,
  getAllBookingsController,
  cancelBookingController,
};
