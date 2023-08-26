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
  getAllPros,
  verifyPro,
  declinePro,
} = require("../controllers/ProAuth");

router.post("/register", register);
router.post("/login", login);
router.post("/uploadImage", uploadImage);
router.get("/getAllPros", getAllPros);
router.patch("/verifyPro", authUser, authorizedPermission("admin"), verifyPro);
router.delete(
  "/declinePro",
  authUser,
  authorizedPermission("admin"),
  declinePro
);

module.exports = router;
