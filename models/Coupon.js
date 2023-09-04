const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide coupon name!"],
  },

  code: {
    type: String,
    required: [true, "Please provide coupon code!"],
    unique: true,
  },

  minutes: {
    type: Number,
    required: [true, "Please provide coupon minutes!"],
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
