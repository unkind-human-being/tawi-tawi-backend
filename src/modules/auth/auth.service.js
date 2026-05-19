const { randomUUID } = require("crypto");

const AppError = require("../../utils/AppError");
const generateToken = require("../../utils/generateToken");
const { hashPassword, comparePassword } = require("../../utils/password");
const USER_STATUS = require("../../constants/userStatus");

const {
  createUser,
  findUserByEmail,
} = require("../users/user.repository");

const { serializeUser } = require("../users/user.serializer");

async function registerPublicUser(registerData) {
  const existingUser = await findUserByEmail(registerData.email);

  if (existingUser) {
    throw new AppError("Email is already registered.", 409);
  }

  const now = new Date().toISOString();

  const passwordHash = await hashPassword(registerData.password);

  const userNode = await createUser({
    id: randomUUID(),
    fullName: registerData.fullName,
    email: registerData.email.toLowerCase(),
    passwordHash,
    status: USER_STATUS.ACTIVE,
    createdAt: now,
    updatedAt: now,
  });

  const user = serializeUser(userNode);

  const token = generateToken({
    userId: user.id,
  });

  return {
    token,
    user,
  };
}

async function loginPublicUser(loginData) {
  const userNode = await findUserByEmail(loginData.email);

  if (!userNode) {
    throw new AppError("Invalid email or password.", 401);
  }

  const user = userNode.properties;

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new AppError("Your account is disabled.", 403);
  }

  const isPasswordCorrect = await comparePassword(
    loginData.password,
    user.passwordHash
  );

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = generateToken({
    userId: user.id,
  });

  return {
    token,
    user: serializeUser(userNode),
  };
}

async function logoutPublicUser() {
  return true;
}

module.exports = {
  registerPublicUser,
  loginPublicUser,
  logoutPublicUser,
};