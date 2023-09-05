const mongoose = require("mongoose");

const websiteSchema = mongoose.Schema({
  professionals: {
    type: Number,
    default: 0,
  },
  chats: {
    type: Number,
    default: 0,
  },
  customers: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Detail", websiteSchema);
