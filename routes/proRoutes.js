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
  getProsAdmin,
  getSinglePro,
  verifyPro,
  declinePro,
  unVerifyPro,
} = require("../controllers/ProAuth");

router.post("/register", register);
router.post("/login", login);
router.post("/uploadImage", uploadImage);
router.get("/getAllPros", getAllPros);
router.get(
  "/getProsAdmin",
  authUser,
  authorizedPermission("admin"),
  getProsAdmin
);
router.get("/getSinglePro/:proId", authUser, getSinglePro);
router.patch("/verifyPro", authUser, authorizedPermission("admin"), verifyPro);
router.patch(
  "/unVerifyPro",
  authUser,
  authorizedPermission("admin"),
  unVerifyPro
);
router.delete(
  "/declinePro",
  authUser,
  authorizedPermission("admin"),
  declinePro
);

module.exports = router;
