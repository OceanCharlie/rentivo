const express = require("express");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  handleStatusController,
  getAllPropertiesController,
  getAllBookingsController,
} = require("../controllers/adminController");

const router = express.Router();

router.use(authMiddleware, roleMiddleware("Admin"));

router.get("/getallusers", getAllUsersController);
router.post("/handlestatus", handleStatusController);
router.get("/getallproperties", getAllPropertiesController);
router.get("/getallbookings", getAllBookingsController);

module.exports = router;
