const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");
const {
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
} = require("../controllers/userController");

const router = express.Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/forgotpassword/request", forgotPasswordRequestController);
router.post("/forgotpassword/reset", forgotPasswordResetController);
router.get("/getAllProperties", getAllPropertiesController);

// Protected routes
router.post("/getuserdata", authMiddleware, authController);
router.post("/bookinghandle/:propertyid", authMiddleware, roleMiddleware("Renter"), bookingHandleController);
router.get("/getallbookings", authMiddleware, roleMiddleware("Renter"), getAllBookingsController);
router.delete("/cancelbooking/:bookingid", authMiddleware, roleMiddleware("Renter"), cancelBookingController);

module.exports = router;
