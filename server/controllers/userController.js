import User from "../models/User.js";

// =======================
// Get Logged-in User Profile
// =======================

export const getProfile = async (req, res) => {
  try {
    // req.user comes from JWT middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// =======================
// Get All Users
// =======================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// =======================
// Get Single User
// =======================

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// =======================
// Update User
// =======================

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Student can update only his own profile
if (
  req.user.role === "student" &&
  req.user.id !== id
) {
  return res.status(403).json({
    success: false,
    message: "Access Denied",
  });
}

    const {
      name,
      email,
      role,
      phone,
      registrationNo,
      department,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
   if (req.user.role !== "student") {
    user.role = role || user.role;}
    user.phone = phone || user.phone;
    user.registrationNo = registrationNo || user.registrationNo;
    user.department = department || user.department;

    await user.save();

    const updatedUser = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};// =======================
// Delete User
// =======================

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};