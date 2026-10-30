const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");

// Verifies the JWT cookie and attaches the user id to the request
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ success: false, message: "Silakan login terlebih dahulu" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).send({ success: false, message: "Sesi habis, silakan login kembali" });
  }
};

// Allows only the given role; owners must also be granted by the admin
const roleMiddleware = (role) => async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user || user.type !== role) {
      return res.status(403).send({ success: false, message: "Akses ditolak" });
    }
    if (role === "Owner" && user.granted !== "granted") {
      return res.status(403).send({ success: false, message: "Akun owner belum disetujui admin" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Role Middleware Error:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};

module.exports = { authMiddleware, roleMiddleware };
