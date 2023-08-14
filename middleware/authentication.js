const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthorizedError("Invalid Authentication!");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid Authentication!");
  }
};

module.exports = authUser;
