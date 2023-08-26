const CustomAPIError = require("./customApi");
const BadRequestError = require("./badRequest");
const NotFoundError = require("./notFound");
const UnauthorizedError = require("./unauthorized");
const ForbiddenError = require("./forbidden");

module.exports = {
  CustomAPIError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
};
