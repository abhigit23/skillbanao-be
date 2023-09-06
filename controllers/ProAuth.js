const proModel = require("../models/Professional");
const userModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../errors");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const register = async (req, res) => {
  const { phone, email, language } = req.body;
  const phoneAlreadyExists = await proModel.findOne({ phone });

  if (phoneAlreadyExists) {
    throw new BadRequestError("Phone number is already registered!");
  }
  const emailAlreadyExists = await proModel.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError("Email Id is already registered!");
  }

  if (!language) throw new BadRequestError("Please provide the language!");

  const user = await proModel.create({ ...req.body, mainRole: "professional" });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
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
      isVerified: user.isVerified,
      proId: user._id,
      image: user.image,
      token,
    },
  });
};

const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    { use_filename: true, folder: "skillbanao" }
  );

  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

const getAllPros = async (req, res) => {
  const pros = await proModel.find({ isVerified: true }).select({
    name: 1,
    role: 1,
    language: 1,
    experience: 1,
    image: 1,
    // isVerified: 1,
    gender: 1,
  });
  res.status(StatusCodes.OK).json({ pros });
};

const getProsAdmin = async (req, res) => {
  const pros = await proModel.find({}).select("-password");
  res.status(StatusCodes.OK).json({ pros });
};

const getSinglePro = async (req, res) => {
  const { proId } = req.params;
  const professional = await userModel
    .findOne({ _id: proId })
    .select("-password");
  if (!professional) throw BadRequestError("Professional not found!");
  res.status(StatusCodes.OK).json({ professional });
};

const verifyPro = async (req, res) => {
  const { proId } = req.body;
  const pro = await proModel.findOne({ _id: proId });
  if (!pro) throw new NotFoundError(`No professional with ${proId} found!`);

  pro.isVerified = true;
  await pro.save();

  res.status(StatusCodes.OK).json({ msg: "Verified Successfully!" });
};

const unVerifyPro = async (req, res) => {
  const { proId } = req.body;
  const pro = await proModel.findOne({ _id: proId });
  if (!pro) throw new NotFoundError(`No professional with ${proId} found!`);

  pro.isVerified = false;
  await pro.save();

  res.status(StatusCodes.OK).json({ msg: "Unverified Successfully!" });
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
  getProsAdmin,
  getSinglePro,
  verifyPro,
  declinePro,
  unVerifyPro,
};
