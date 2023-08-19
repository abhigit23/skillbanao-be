const BadRequestError = require("../errors/badRequest.js");
const Professional = require("../models/Professional.js");
const User = require("../models/User.js");

exports.addChat = async (req, res) => {
  try {
    const { userId, professionalId } = req.body;
    const professional = await Professional.findById(professionalId);
    if (professional.inQueue.includes(userId)) throw new BadRequestError();
    const updatedResult = await Professional.findByIdAndUpdate(
      professionalId,
      { $push: { inQueue: userId } },
      { new: true }
    );
    if (!updatedResult) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).send({
      message: "Added in queue successfully please wait!",
      result: updatedResult,
    });
  } catch (err) {
    res.status(400).json({ message: "Already in queue. Please wait!" });
  }
};

exports.declineChat = async (req, res) => {
  try {
    const { userId, professionalId } = req.body;
    const updatedResult = await Professional.findByIdAndUpdate(
      professionalId,
      { $pull: { inQueue: userId } },
      { new: true }
    );
    if (!updatedResult) {
      return res.status(400).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Chat Removed successfully", result: updatedResult });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.showUserList = async (req, res) => {
  try {
    const { professionalId } = req.body;
    const professionalInfo = await Professional.findById(professionalId);
    if (!professionalInfo) {
      return res.status(400).send("No Professional with given Id");
    }
    const usersId = professionalInfo.inQueue;
    const userList = await User.find({ _id: { $in: usersId } }).select(
      "-password"
    );
    res.status(200).json({ result: userList });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.startChat = async (req, res) => {
  const io = req.socketConfig;
  const { userId, professionalId } = req.body;
  if (!userId || !professionalId) {
    return res.status(400).send("please provide both ids");
  }
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
    socket.on(`${userId}-${professionalId}-chat`, (message) => {
      // Broadcast the message to all connected sockets
      io.emit(`${userId}-${professionalId}-chat`, message);
    });
  });

  res.status(200).send("connection established outside");
};

exports.acceptRequest = async (req, res) => {
  const io = req.socketConfig;
  const { userId, professionalId } = req.body;
  io.to(userId).emit("requestAccepted", professionalId);
  res.status(200).send("Your request has been accepted!");
};
