import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// =======================
// Register User
// =======================

export const registerUser = async (req, res) => {
  console.log(req.body);
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      registrationNo,
      department,
    } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      registrationNo,
      department,
    });

   const createdUser = await User.findById(user._id).select("-password");

res.status(201).json({
  success: true,
  message: "User Registered Successfully",
  user: createdUser,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    // console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// =======================
// Login User
// =======================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Remove password before sending response
    const loggedInUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: loggedInUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};