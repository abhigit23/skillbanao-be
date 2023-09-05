const express = require("express");
const { updateDetails, showDetails } = require("../controllers/websiteDetails");
const {
  authUser,
  authorizedPermission,
} = require("../middleware/authentication");
const router = express.Router();

router.patch(
  "/updateDetails",
  authUser,
  authorizedPermission("admin"),
  updateDetails
);
router.get("/details", showDetails);

module.exports = router;
