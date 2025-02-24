// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const Joi = require("joi");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const REFRESH_SECRET =
  process.env.REFRESH_SECRET || "your_refresh_jwt_secret_key";
const RESET_SECRET = process.env.RESET_SECRET || "your_reset_secret_key";

// Expiry durations
const ACCESS_TOKEN_EXPIRES_IN = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = "7d"; // 7 days

// Generate tokens
function generateAccessToken(user) {
  return jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ userId: user._id }, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

// Save refresh token in DB
async function saveRefreshToken(token, userId) {
  const decoded = jwt.decode(token);
  const expiresDate = new Date(decoded.exp * 1000); // decoded.exp is in seconds
  const newToken = new RefreshToken({ token, userId, expires: expiresDate });
  await newToken.save();
}

// Remove refresh token from DB
async function removeRefreshToken(token) {
  await RefreshToken.deleteOne({ token });
}

exports.register = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      name: Joi.string().optional(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { code: 400, message: error.details[0].message },
      });
    }
    const { email, password, name } = req.body;
    // Use the static method findUserByEmail
    const existing = await User.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        error: { code: 400, message: "User already exists" },
      });
    }
    const newUser = new User({ email, password, name });
    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    await saveRefreshToken(refreshToken, newUser._id);

    return res.status(201).json({
      message: "User registered",
      accessToken,
      refreshToken,
      user: { email: newUser.email, name: newUser.name },
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({
      error: { code: 500, message: "Registration failed." },
    });
  }
};

exports.login = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: { code: 400, message: error.details[0].message },
      });
    }
    const { email, password } = req.body;
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        error: { code: 400, message: "Invalid credentials" },
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        error: { code: 400, message: "Invalid credentials" },
      });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await saveRefreshToken(refreshToken, user._id);

    return res.status(200).json({
      message: "Logged in",
      accessToken,
      refreshToken,
      user: { email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({
      error: { code: 500, message: "Login failed." },
    });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        error: { code: 400, message: "Refresh token required" },
      });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      return res.status(400).json({
        error: { code: 400, message: "Invalid refresh token" },
      });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        await removeRefreshToken(refreshToken);
        return res.status(403).json({
          error: { code: 403, message: "Refresh token expired" },
        });
      }
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          error: { code: 404, message: "User not found" },
        });
      }
      const newAccessToken = generateAccessToken(user);
      return res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error("Refresh Error:", err);
    return res.status(500).json({
      error: { code: 500, message: "Token refresh failed." },
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        error: { code: 400, message: "Refresh token required to log out" },
      });
    }
    await removeRefreshToken(refreshToken);
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({
      error: { code: 500, message: "Logout failed." },
    });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        error: { code: 400, message: "Email required" },
      });
    }
    const user = await User.findUserByEmail(email);
    if (!user) {
      // For security, we respond with a 200 but a generic message
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign({ userId: user._id }, RESET_SECRET, {
      expiresIn: "1h",
    });
    // In production, send the token via email.
    // For testing, return it.
    return res.json({ message: "Reset link sent", resetToken });
  } catch (err) {
    console.error("Request Password Reset Error:", err);
    return res.status(500).json({
      error: { code: 500, message: "Failed to request password reset." },
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        error: { code: 400, message: "Token and new password required" },
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, RESET_SECRET);
    } catch (err) {
      return res.status(400).json({
        error: { code: 400, message: "Token invalid or expired" },
      });
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        error: { code: 404, message: "User not found" },
      });
    }
    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();
    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({
      error: { code: 500, message: "Failed to reset password." },
    });
  }
};
