const express = require("express");
const route = express.Router();
const { authUser } = require("../middleware/authentication");
const {
  addChat,
  declineChat,
  showUserList,
  startChat,
  acceptRequest,
  requestCheck,
} = require("../controllers/chat.js");

route.post("/add-chat", authUser, addChat);
route.post("/decline-chat", authUser, declineChat);
route.post("/showUserList", authUser, showUserList);
route.post("/start-chat", authUser, startChat);
route.post("/checkReq", authUser, acceptRequest);
route.get("/accepted/:userId", authUser, requestCheck);

module.exports = route;
