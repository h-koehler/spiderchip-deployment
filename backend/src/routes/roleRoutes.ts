import express from "express";
import { getRoles, getRole, createRole, updateRole, deleteRole, getRoleByName } from "../controllers";
import { createRoleSchema, updateRoleSchema } from "../validation/roleSchema";
import { validateRequest, authenticateJWT, authorizeRoles } from "../middleware";
import { Role } from "../config/roles";

const router = express.Router();

router.get("/", authenticateJWT, authorizeRoles(Role.ADMIN), getRoles);
router.get("/:id", authenticateJWT, authorizeRoles(Role.ADMIN), getRole);
router.get("/name/:name", authenticateJWT, authorizeRoles(Role.ADMIN), getRoleByName);
router.post("/", authenticateJWT, authorizeRoles(Role.ADMIN), validateRequest(createRoleSchema), createRole);
router.patch("/:id", authenticateJWT, authorizeRoles(Role.ADMIN), validateRequest(updateRoleSchema), updateRole);
router.delete("/:id", authenticateJWT, authorizeRoles(Role.ADMIN), deleteRole);

export default router;
