const express = require("express");
const route = express.Router();
const {
  authUser,
  authorizedPermission,
} = require("../middleware/authentication");
const {
  addChat,
  declineChat,
  showUserList,
  startChat,
  acceptRequest,
  requestCheck,
  pendingChats,
} = require("../controllers/chat.js");

route.post("/add-chat", authUser, addChat);
route.post("/decline-chat", authUser, declineChat);
route.post(
  "/showUserList",
  authUser,
  authorizedPermission("professional"),
  showUserList
);
route.post("/start-chat", authUser, startChat);
route.post("/checkReq", authUser, acceptRequest);
route.get("/accepted/:userId", authUser, requestCheck);
route.get("/pending", authUser, authorizedPermission("admin"), pendingChats);

module.exports = route;
