const express = require("express");
const router = express.Router();

const {
  authUser,
  authorizedPermission,
} = require("../middleware/authentication");

const {
  register,
  login,
  uploadImage,
  getAllUsers,
} = require("../controllers/userAuth");

router.post("/register", register);
router.post("/login", login);
router.post(
  "/uploadImage",
  authUser,
  authorizedPermission("admin"),
  uploadImage
);
router.get(
  "/getAllUsers",
  authUser,
  authorizedPermission("admin"),
  getAllUsers
);

module.exports = router;
