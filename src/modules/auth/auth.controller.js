const AppError = require("../../utils/AppError");
const { successResponse } = require("../../utils/response");
const authService = require("./auth.service");
const {
  validateRegister,
  validateLogin,
} = require("./auth.validation");

async function register(req, res, next) {
  try {
    const validation = validateRegister(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.errors[0], 400);
    }

    const result = await authService.registerPublicUser(validation.value);

    return successResponse(
      res,
      "Public user registered successfully.",
      result,
      201
    );
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const validation = validateLogin(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.errors[0], 400);
    }

    const result = await authService.loginPublicUser(validation.value);

    return successResponse(res, "Login successful.", result);
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logoutPublicUser();

    return successResponse(res, "Logout successful.");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
};