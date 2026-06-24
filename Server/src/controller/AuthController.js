import { AuthRegisterService, AuthLoginService } from "../services/AuthService.js";
import { generateToken } from "../utils/utils.js";
import { sendEmail } from "../utils/email.js";
import logger from "../utils/logger.js";
import asyncHandler from "../middleware/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const AuthRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await AuthRegisterService(name, email, password);

  generateToken(res, user._id);

  try {
    const welcomeHtml = `<h1>Welcome ${user.name}!</h1><p>Thank you for registering at Payment Gateway.</p>`;
    await sendEmail(user.email, "Welcome to Payment Gateway", welcomeHtml);
  } catch (emailError) {
    logger.error({ err: emailError }, "Failed to send welcome email");
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

export const AuthLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await AuthLoginService(email, password);

  generateToken(res, user._id);

  try {
    const loginHtml = `<p>Hello ${user.name}, you just logged into your account.</p><p>If this wasn't you, please secure your account.</p>`;
    await sendEmail(user.email, "Login Notification", loginHtml);
  } catch (emailError) {
    logger.error({ err: emailError }, "Failed to send login notification email");
  }

  res.status(200).json({
    name: user.name,
    email: user.email,
  });
});

export const LogoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const GetUserProfile = async (req, res) => {
  const user = req.user;

  if (user) {
    res.json({
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

