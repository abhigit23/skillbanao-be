const { BadRequestError } = require("../errors");
const couponModel = require("../models/Coupon");
const { StatusCodes } = require("http-status-codes");

const addCoupon = async (req, res) => {
  const coupon = await couponModel.create(req.body);
  res.status(StatusCodes.CREATED).json({
    coupon,
  });
};

const deleteCoupon = async (req, res) => {
  const { couponId } = req.body;
  const coupon = await couponModel.findOneAndDelete({ _id: couponId });
  if (!coupon) throw new BadRequestError("Coupon not found!");
  res.status(StatusCodes.OK).json({ msg: "Coupon removed successfully!" });
};

const showCoupons = async (req, res) => {
  const coupons = await couponModel.find({});
  res.status(StatusCodes.OK).json({ coupons });
};

module.exports = { addCoupon, deleteCoupon, showCoupons };
