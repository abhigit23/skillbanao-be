const BadRequestError = require("../errors/badRequest.js");
const Professional = require("../models/Professional.js");
const User = require("../models/User.js");

const acceptedRequests = new Set();

exports.addChat = async (req, res) => {
  try {
    const { userId, professionalId } = req.body;
    const updateResult = await Professional.updateOne(
      { _id: professionalId, "inQueue.userId": { $ne: userId } },
      { $addToSet: { inQueue: { userId, timestamp: new Date() } } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new BadRequestError("Already in a queue please wait...");
    }

    res.status(200).send({
      message: "Added in queue successfully please wait!",
      result: updateResult,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.declineChat = async (req, res) => {
  try {
    const { userId, professionalId } = req.body;
    const updatedResult = await Professional.findByIdAndUpdate(
      professionalId,
      { $pull: { inQueue: { userId } } },
      { new: true }
    );

    if (updatedResult.modifiedCount === 0) {
      throw new Error("User not found in the queue.");
    }
    acceptedRequests.delete(userId);
    if (!updatedResult) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Chat Removed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.showUserList = async (req, res) => {
  try {
    const { professionalId } = req.body;
    const professionalInfo = await Professional.findById(professionalId);
    if (!professionalInfo) {
      return res.status(400).send("No Professional with the given Id");
    }

    const inQueue = professionalInfo.inQueue;

    const userIds = inQueue.map((item) => item.userId);

    const userList = await User.find({ _id: { $in: userIds } }).select(
      "-password"
    );

    const userIdToTimestamp = {};
    inQueue.forEach((item) => {
      userIdToTimestamp[item.userId] = item.timestamp;
    });

    const userListWithTimestamps = userList.map((user) => ({
      ...user.toObject(),
      timestamp: userIdToTimestamp[user._id] || null, // Use the map to associate timestamps
    }));

    res.status(200).json({ result: userListWithTimestamps });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.pendingChats = async (req, res) => {
  const pro = await Professional.find({ inQueue: { $ne: [] } });
  res.status(200).json({ chats: pro });
};

exports.startChat = async (req, res) => {
  const io = req.socketConfig;
  const { userId, professionalId } = req.body;
  if (!userId || !professionalId) {
    return res.status(400).send("please provide both ids");
  }
  io.on("connection", (socket) => {
    // console.log("A user connected", socket.id);
    socket.on("disconnect", () => {
      // console.log("A user disconnected");
    });
    socket.on(`${userId}-${professionalId}-chat`, (message) => {
      // Broadcast the message to all connected sockets
      // console.log(message);
      io.emit(`${userId}-${professionalId}-chat`, message);
    });
  });

  res.status(200).send("connection established outside");
};

exports.acceptRequest = async (req, res) => {
  const io = req.socketConfig;
  const { userId, professionalId } = req.body;
  io.to(userId).emit("requestAccepted", professionalId);
  acceptedRequests.add(userId);
  // console.log(acceptedRequests);
  res.status(200).json("Your request has been accepted!");
};

exports.requestCheck = async (req, res) => {
  const { userId } = req.params;
  const isAccepted = acceptedRequests.has(userId);
  res.json({ isAccepted });
};
