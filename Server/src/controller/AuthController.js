import express from "express";
import { AuthRegisterService } from "../services/AuthService.js";

// Authentication Controllers

export const AuthRegister = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  } else {
    try {
      const result = await AuthRegisterService(
        req.body.name,
        req.body.email,
        req.body.password,
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

