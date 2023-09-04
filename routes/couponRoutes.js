const express = require("express");
const router = express.Router();

const {
  authUser,
  authorizedPermission,
} = require("../middleware/authentication");

const {
  addCoupon,
  deleteCoupon,
  showCoupons,
} = require("../controllers/couponController");

router.post("/add", authUser, authorizedPermission("admin"), addCoupon);
router.delete("/delete", authUser, authorizedPermission("admin"), deleteCoupon);
router.get("/showAll", authUser, authorizedPermission("admin"), showCoupons);

module.exports = router;
