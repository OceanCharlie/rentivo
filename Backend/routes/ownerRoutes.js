const express = require("express");
const path = require("path");
const multer = require("multer");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");
const {
  addPropertyController,
  getAllOwnerPropertiesController,
  updatePropertyController,
  deletePropertyController,
  getAllBookingsController,
  handleAllBookingstatusController,
} = require("../controllers/ownerController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Hanya file gambar yang diizinkan"));
  },
});

// Every owner route requires a granted owner
router.use(authMiddleware, roleMiddleware("Owner"));

router.post("/postproperty", upload.array("propertyImages", 6), addPropertyController);
router.get("/getallproperties", getAllOwnerPropertiesController);
router.patch("/updateproperty/:propertyid", upload.single("propertyImage"), updatePropertyController);
router.delete("/deleteproperty/:propertyid", deletePropertyController);
router.get("/getallbookings", getAllBookingsController);
router.post("/handlebookingstatus", handleAllBookingstatusController);

module.exports = router;
