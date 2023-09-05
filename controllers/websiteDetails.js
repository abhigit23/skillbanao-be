const { StatusCodes } = require("http-status-codes");
const websiteModel = require("../models/Website");

const updateDetails = async (req, res) => {
  const { professionals, chats, customers, id } = req.body;
  const detail = await websiteModel.findOne({ _id: id });

  detail.professionals = professionals;
  detail.chats = chats;
  detail.customers = customers;
  await detail.save();

  res.status(StatusCodes.OK).json({ msg: "Updated Successfully!" });
};

const showDetails = async (req, res) => {
  const detail = await websiteModel.find({}).select("-_id");
  res.status(StatusCodes.OK).json({ detail });
};

module.exports = { updateDetails, showDetails };
