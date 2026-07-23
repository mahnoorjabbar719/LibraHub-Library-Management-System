import express from "express";
import { adminDashboard } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/admin",
  protect,
  authorizeRoles("admin", "librarian"),
  adminDashboard
);

export default router;