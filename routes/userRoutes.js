const express = require("express");
const router = express.Router();

const {
  register,
  login,
  uploadImage,
  getAllUsers,
} = require("../controllers/userAuth");

router.post("/register", register);
router.post("/login", login);
router.post("/uploadImage", uploadImage);
router.get("/getAllUsers", getAllUsers);

module.exports = router;
