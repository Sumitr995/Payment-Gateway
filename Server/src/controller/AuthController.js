import express from "express";
import { AuthRegisterService, AuthLoginService } from "../services/AuthService.js";
import { generateToken } from "../utils/utils.js";

// Authentication Controllers

export const AuthRegister = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  } else {
    try {
      const user = await AuthRegisterService(
        req.body.name,
        req.body.email,
        req.body.password,
      );

      generateToken(res, user._id);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const AuthLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AuthLoginService(email, password);

    generateToken(res, user._id);

    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

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

