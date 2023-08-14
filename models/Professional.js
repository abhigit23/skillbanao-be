const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const professionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the name!"],
    maxlength: 50,
    minlength: 3,
    trim: true,
  },

  phone: {
    type: String,
    required: [true, "Please provide a phone number!"],
    minlength: 10,
    maxlength: 10,
  },

  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email!",
    },
  },

  gender: {
    type: String,
    required: [true, "Please provide the gender!"],
  },

  dob: {
    type: String,
    required: [true, "Please provide Date of Birth!"],
  },

  hno: {
    type: String,
    required: [true, "Please provide House Number!"],
  },

  locality: {
    type: String,
    required: [true, "Please provide the Locality!"],
  },

  state: {
    type: String,
    required: [true, "Please provide State!"],
  },

  pincode: {
    type: Number,
    required: [true, "Please provide Pincode!"],
  },

  pSkills: {
    type: String,
  },

  allSkills: {
    type: String,
  },

  language: {
    type: String,
  },

  experience: {
    type: String,
  },

  hours: {
    type: String,
  },

  reference: {
    type: String,
  },

  working: {
    type: String,
  },

  image: {
    type: String,
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
});

professionalSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

professionalSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

professionalSchema.methods.comparePassword = async function (
  candidatePassword
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Professional", professionalSchema);
