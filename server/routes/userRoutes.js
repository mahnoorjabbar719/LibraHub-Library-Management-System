import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getProfile,getAllUsers,getSingleUser, updateUser,deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
  
);
router.get(
  "/",
  protect,
  authorizeRoles("admin", "librarian"),
  getAllUsers
)
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "librarian"),
  getSingleUser
);
router.put(
  "/:id",
  protect,
  updateUser
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "librarian"),
  deleteUser
);

export default router;