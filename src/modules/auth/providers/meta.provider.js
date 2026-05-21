const axios = require("axios");

const env = require("../../../config/env");
const AppError = require("../../../utils/AppError");

function getMetaAppAccessToken() {
  if (
    !env.META_APP_ID ||
    env.META_APP_ID === "your_meta_app_id_here" ||
    !env.META_APP_SECRET ||
    env.META_APP_SECRET === "your_meta_app_secret_here"
  ) {
    throw new AppError("Meta app credentials are not configured.", 500);
  }

  return `${env.META_APP_ID}|${env.META_APP_SECRET}`;
}

async function verifyMetaAccessToken(accessToken) {
  const appAccessToken = getMetaAppAccessToken();

  const debugUrl = "https://graph.facebook.com/debug_token";

  const debugResponse = await axios.get(debugUrl, {
    params: {
      input_token: accessToken,
      access_token: appAccessToken,
    },
  });

  const debugData = debugResponse.data?.data;

  if (!debugData || debugData.is_valid !== true) {
    throw new AppError("Invalid Meta access token.", 401);
  }

  if (String(debugData.app_id) !== String(env.META_APP_ID)) {
    throw new AppError("Meta token app mismatch.", 401);
  }

  const userId = debugData.user_id;

  if (!userId) {
    throw new AppError("Meta user ID is missing.", 401);
  }

  const profileResponse = await axios.get("https://graph.facebook.com/me", {
    params: {
      fields: "id,name,email,picture",
      access_token: accessToken,
    },
  });

  const profile = profileResponse.data;

  if (!profile?.id) {
    throw new AppError("Unable to fetch Meta profile.", 401);
  }

  const email = profile.email
    ? profile.email.toLowerCase()
    : `meta_${profile.id}@meta.local`;

  return {
    provider: "meta",
    providerUserId: profile.id,
    email,
    fullName: profile.name || "Meta User",
    picture: profile.picture?.data?.url || null,
  };
}

module.exports = {
  verifyMetaAccessToken,
};