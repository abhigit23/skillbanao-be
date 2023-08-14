const userModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthorizedError } = require("../errors");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const register = async (req, res) => {
  const user = await userModel.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      phone: user.phone,
      token,
    },
  });
};

const login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password)
    throw new BadRequestError("Please provide phone number and password!");

  const user = await userModel.findOne({ phone });
  if (!user) throw new UnauthorizedError("Invalid Phone Number!");

  const isPassCorrect = await user.comparePassword(password);
  if (!isPassCorrect) throw new UnauthorizedError("Invalid Password!");
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      phone: user.phone,
      token,
    },
  });
};

const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    { use_filename: true, folder: "users" }
  );

  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = { register, login, uploadImage };
