const userModel = require("../models/User");
const proModel = require("../models/Professional");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthorizedError } = require("../errors");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const register = async (req, res) => {
  const { phone } = req.body;
  const phoneAlreadyExists = await userModel.findOne({ phone });

  if (phoneAlreadyExists) {
    throw new BadRequestError("Phone number is already registered!");
  }

  const user = await userModel.create({ ...req.body, mainRole: "user" });
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
      userId: user._id,
      mainRole: user.mainRole,
      token,
    },
  });
};

const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    { use_filename: true, folder: "blogs" }
  );

  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

const getAllUsers = async (req, res) => {
  const users = await userModel.find({}).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { userId } = req.params;
  const user = await userModel.findOne({ _id: userId }).select("-password");
  if (!user) throw BadRequestError("User not found!");
  res.status(StatusCodes.OK).json({ user });
};

module.exports = { register, login, uploadImage, getAllUsers, getSingleUser };
