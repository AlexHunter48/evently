import express from "express";

import { OAuth2Client } from "google-auth-library";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

import { sendWelcomeEmail } from "../config/emailConfig.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    let assignedRole;

    if (role === "organizer" || role === "guest") {
      assignedRole = role;
    } else {
      assignedRole = "guest";
    }

    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: assignedRole,
    });

    try {
      await sendWelcomeEmail(newUser.email, newUser.username);
    } catch (mailError) {
      console.error(
        "Nodemailer failed to dispatch welcome message:",
        mailError.message,
      );
    }

    res.status(201).json({
      message: "Account created succesfully ",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.log("Error creating user:", err);

    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or  Password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,

      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "logged in succesfully",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error loggin in user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const googleSignIn = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res
      .status(400)
      .json({ message: "ID Token is required from the frontend" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email: email,
        password: "",
        role: "guest",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "logged in succesfully",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error logging in user via Google:", error.message || error);
    return res.status(400).json({ message: "Invalid or expired Google token" });
  }
};
