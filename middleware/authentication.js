const jwt = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("../errors");

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthorizedError("Invalid Authentication!");
  }

  const token = authHeader.split(" ")[1];
  try {
    const { name, userId, mainRole } = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = { name, userId, mainRole };
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid Authentication!");
  }
};

const authorizedPermission = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user);
    if (!roles.includes(req.user.mainRole))
      throw new ForbiddenError("You aren't authorize to access this route");
    next();
  };
};

module.exports = { authUser, authorizedPermission };
