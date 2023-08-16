const express = require("express");
const route = express.Router();
const {
  addChat,
  declineChat,
  showUserList,
  startChat,
} = require("../controllers/chat.js");

route.post("/add-chat", addChat);
route.post("/decline-chat", declineChat);
route.post("/showUserList", showUserList);
route.post("/start-chat", startChat);

module.exports = route;
