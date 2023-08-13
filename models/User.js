const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  name: { type: String, required: false },
  role: { type: String, required: false },
  gender: { type: String, required: false },
  photo: { type: String, required: false },
  phoneNumber: { type: String, required: false },
});

// Create a model based on the schema
const User = model("User", userSchema);

module.exports = User;
