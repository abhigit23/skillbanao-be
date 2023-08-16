const proModel = require("../models/Professional");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../errors");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const register = async (req, res) => {
  const { phone, email } = req.body;
  const phoneAlreadyExists = await proModel.findOne({ phone });
  if (phoneAlreadyExists) {
    throw new BadRequestError("Phone number is already registered!");
  }
  const emailAlreadyExists = await proModel.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError("Email Id is already registered!");
  }

  const user = await proModel.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      token,
    },
  });
};

const login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    throw new BadRequestError("Please provide Phone number and Password!");
  }

  const user = await proModel.findOne({ phone });
  if (!user) {
    throw new UnauthorizedError("Invalid Phone Number!");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Password!");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      token,
    },
  });
};

const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    { use_filename: true, folder: "professionals" }
  );

  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

const getAllPros = async (req, res) => {
  const pros = await proModel.find({}).select("-password");
  res.status(StatusCodes.OK).json({ pros });
};

const verifyPro = async (req, res) => {
  const { proId } = req.body;
  const pro = await proModel.findOne({ _id: proId });
  if (!pro) throw new NotFoundError(`No professional with ${proId} found!`);

  pro.isVerified = true;
  await pro.save();

  res.status(StatusCodes.OK).json({ msg: "Verified Successfully!" });
};

const declinePro = async (req, res) => {
  const { proId } = req.body;
  const pro = await proModel.findOne({ _id: proId });
  if (!pro) throw new NotFoundError(`No professional with ${proId} found!`);

  await pro.deleteOne();

  res
    .status(StatusCodes.OK)
    .json({ msg: "User declined and removed from the database!" });
};

module.exports = {
  register,
  login,
  uploadImage,
  getAllPros,
  verifyPro,
  declinePro,
};
