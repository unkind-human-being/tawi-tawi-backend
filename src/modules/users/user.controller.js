const AppError = require("../../utils/AppError");
const { successResponse } = require("../../utils/response");
const userService = require("./user.service");
const { validateUpdateMe } = require("./user.validation");

async function getMe(req, res, next) {
  try {
    return successResponse(res, "User profile fetched successfully.", {
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

async function updateMe(req, res, next) {
  try {
    const validation = validateUpdateMe(req.body);

    if (!validation.isValid) {
      throw new AppError(validation.errors[0], 400);
    }

    const user = await userService.updateMe(req.user.id, validation.value);

    return successResponse(res, "User profile updated successfully.", {
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMe,
  updateMe,
};