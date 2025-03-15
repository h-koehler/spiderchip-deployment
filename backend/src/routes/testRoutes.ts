import express from "express";
import { authenticateJWT, authorizeRoles } from "../middleware";
import { Role } from "../config/roles";

const router = express.Router();

// route accessible only by admins
router.get("/admin-test", authenticateJWT, authorizeRoles(Role.ADMIN), (req, res) => {
  res.json({ message: "Access granted: Admin Route", user: req.user });
});

// route accessible by both admins and users
router.get("/user-test", authenticateJWT, authorizeRoles(Role.USER, Role.ADMIN), (req, res) => {
  res.json({ message: "Access granted: User Route", user: req.user });
});

export default router;
