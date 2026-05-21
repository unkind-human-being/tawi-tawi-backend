function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegister(body) {
  const errors = [];

  const fullName = body.fullName ? String(body.fullName).trim() : "";
  const email = body.email ? String(body.email).trim().toLowerCase() : "";
  const password = body.password ? String(body.password) : "";

  if (!fullName || fullName.length < 2) {
    errors.push("Full name must be at least 2 characters.");
  }

  if (!email || !isValidEmail(email)) {
    errors.push("Please provide a valid email address.");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      fullName,
      email,
      password,
    },
  };
}

function validateLogin(body) {
  const errors = [];

  const email = body.email ? String(body.email).trim().toLowerCase() : "";
  const password = body.password ? String(body.password) : "";

  if (!email || !isValidEmail(email)) {
    errors.push("Please provide a valid email address.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      email,
      password,
    },
  };
}

function validateGoogleLogin(body) {
  const errors = [];

  const idToken = body.idToken ? String(body.idToken).trim() : "";

  if (!idToken) {
    errors.push("Google ID token is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      idToken,
    },
  };
}

function validateMetaLogin(body) {
  const errors = [];

  const accessToken = body.accessToken ? String(body.accessToken).trim() : "";

  if (!accessToken) {
    errors.push("Meta access token is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      accessToken,
    },
  };
}

module.exports = {
  validateRegister,
  validateLogin,
  validateGoogleLogin,
  validateMetaLogin,
};