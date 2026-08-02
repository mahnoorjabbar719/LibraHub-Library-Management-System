
import sendEmail from "../utils/sendEmail.js";
import welcomeEmailTemplate from "../utils/welcomeEmailTemplate.js";import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// =======================
// Register User
// =======================

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      registrationNo,
      department,
    } = req.body;

    const cleanedName = name?.trim().replace(/\s+/g, " ");
    const cleanedEmail = email?.trim().toLowerCase();
    const cleanedPhone = phone?.trim();
    const cleanedRegistrationNo = registrationNo
      ?.trim()
      .toUpperCase();
    const cleanedDepartment = department
      ?.trim()
      .replace(/\s+/g, " ");

    // Required fields
    if (
      !cleanedName ||
      !cleanedEmail ||
      !password ||
      !cleanedPhone ||
      !cleanedRegistrationNo ||
      !cleanedDepartment
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Name validation
    const nameRegex = /^[A-Za-z\s]+$/;

    if (
      !nameRegex.test(cleanedName) ||
      cleanedName.replace(/\s/g, "").length < 3
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 3 letters and no numbers.",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long.",
      });
    }

    // Phone validation
    const phoneRegex = /^03\d{9}$/;

    if (!phoneRegex.test(cleanedPhone)) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number must be 11 digits and start with 03.",
      });
    }

    // Registration number validation
    const registrationRegex =
      /^\d{4}-[A-Z]{2,5}-\d{3}$/;

    if (
      !registrationRegex.test(cleanedRegistrationNo)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Registration number must follow a format like 2026-CS-001.",
      });
    }

    // Department validation
    const departmentRegex = /^[A-Za-z\s&-]+$/;

    if (
      !departmentRegex.test(cleanedDepartment) ||
      cleanedDepartment.length < 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid department name.",
      });
    }

    // Duplicate email
    const existingEmail = await User.findOne({
      email: cleanedEmail,
    });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Duplicate registration number
    const existingRegistration = await User.findOne({
      registrationNo: cleanedRegistrationNo,
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message:
          "This registration number is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: cleanedName,
      email: cleanedEmail,
      password: hashedPassword,
      phone: cleanedPhone,
      registrationNo: cleanedRegistrationNo,
      department: cleanedDepartment,

      // Public registration should always create a student
      role: "student",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        registrationNo: user.registrationNo,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
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