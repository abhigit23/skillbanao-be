const express = require("express");
const router = express.Router();

const { register, login, uploadImage } = require("../controllers/ProAuth");

router.post("/register", register);
router.post("/login", login);
router.post("/uploadImage", uploadImage);

module.exports = router;
