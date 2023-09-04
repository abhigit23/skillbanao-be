const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the name!"],
    maxlength: 50,
    minlength: 3,
    trim: true,
  },

  gender: {
    type: String,
    required: [true, "Please provide the gender!"],
  },

  image: {
    type: String,
  },

  dob: {
    type: String,
    required: [true, "Please provide Date of Birth!"],
  },

  phone: {
    type: String,
    validate: {
      validator: function (value) {
        return validator.isMobilePhone(value, "en-IN");
      },
      message: "Please provide a valid phone number!",
    },
    unique: true,
  },

  mainRole: {
    type: String,
    // default: "user",
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    validate: {
      validator: validator.isStrongPassword,
      message:
        "Password should contain atleast 8 letters with 1 uppercase, 1 lowercase, 1 number and 1 symbol",
    },
  },

  usedCoupons: Array,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name, mainRole: this.mainRole },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
