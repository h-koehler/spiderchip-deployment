import express from "express";
import * as userController from "../controllers/userController";
import { authenticateJWT, authorizeRoles } from "../middleware";
import { Role } from "../config/roles";

const router = express.Router();

/**
 * Protected Routes (Require Authentication)
 */
router.get("/", authenticateJWT, authorizeRoles(Role.ADMIN), userController.getAllUsers);
router.get("/current", authenticateJWT, userController.getUserById);
router.patch("/", authenticateJWT, userController.updateUser);
router.delete("/:userId", authenticateJWT, authorizeRoles(Role.ADMIN), userController.deleteUser);

/**
 * Public Routes
 */
router.post("/register", userController.createUser);
router.get("/email/:email", userController.getUserByEmail);

export default router;
