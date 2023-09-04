const accessTokenVerify = require("../controllers/auth");
const express = require("express");
const router = express.Router();

router.post("/token", accessTokenVerify);

module.exports = router;
