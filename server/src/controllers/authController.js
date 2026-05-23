import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

const authResponse = (user) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  },
  token: signToken(user._id)
});

export const register = async (req, res) => {
  // Input shape is already validated by express-validator middleware
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json(authResponse(user));
};

export const login = async (req, res) => {
  // Input shape is already validated by express-validator middleware
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Use the same message for both cases to prevent user enumeration
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json(authResponse(user));
};
