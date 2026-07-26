import express from "express";
import {
  adminDashboard,
  publicDashboard,
} from "../controllers/dashboardController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public landing-page stats
router.get("/public", publicDashboard);

// Protected admin dashboard
router.get(
  "/admin",
  protect,
  authorizeRoles("admin", "librarian"),
  adminDashboard
);

export default router;