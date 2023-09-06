const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

const accessTokenVerify = async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken)
    throw new UnauthorizedError("Invalid Authentication - Please log in!");

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, data) => {
    if (err)
      throw new UnauthorizedError("Session expired! Please log in again!");

    res.status(200).json({
      msg: "User authenticated!",
      data: { userId: data.userId, name: data.name, mainRole: data.mainRole },
    });
  });
};

module.exports = accessTokenVerify;
