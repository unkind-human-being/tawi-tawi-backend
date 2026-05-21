const { OAuth2Client } = require("google-auth-library");

const env = require("../../../config/env");
const AppError = require("../../../utils/AppError");

let googleClient = null;

function getGoogleClient() {
  if (
    !env.GOOGLE_CLIENT_ID ||
    env.GOOGLE_CLIENT_ID === "your_google_client_id_here"
  ) {
    throw new AppError("Google Client ID is not configured.", 500);
  }

  if (!googleClient) {
    googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  }

  return googleClient;
}

async function verifyGoogleIdToken(idToken) {
  const client = getGoogleClient();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new AppError("Invalid Google token.", 401);
  }

  if (!payload.sub) {
    throw new AppError("Google account ID is missing.", 401);
  }

  if (!payload.email) {
    throw new AppError("Google account email is required.", 400);
  }

  if (payload.email_verified === false) {
    throw new AppError("Google email is not verified.", 401);
  }

  return {
    provider: "google",
    providerUserId: payload.sub,
    email: payload.email.toLowerCase(),
    fullName: payload.name || payload.email,
    picture: payload.picture || null,
  };
}

module.exports = {
  verifyGoogleIdToken,
};