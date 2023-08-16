const express = require("express");
const router = express.Router();

const {
  register,
  login,
  uploadImage,
  getAllPros,
  verifyPro,
  declinePro,
} = require("../controllers/ProAuth");

router.post("/register", register);
router.post("/login", login);
router.post("/uploadImage", uploadImage);
router.get("/getAllPros", getAllPros);
router.patch("/verifyPro", verifyPro);
router.delete("/declinePro", declinePro);

module.exports = router;
