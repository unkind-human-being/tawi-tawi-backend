const env = require("../config/env");

function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  const response = {
    success: false,
    message: error.message || "Internal server error.",
  };

  if (env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
}

module.exports = errorMiddleware;