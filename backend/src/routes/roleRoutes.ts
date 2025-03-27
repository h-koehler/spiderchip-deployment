import express from "express";
import { getRoles, getRole, createRole, updateRole, deleteRole, getRoleByName } from "../controllers";
import { createRoleSchema, updateRoleSchema } from "../validation/roleSchema";
import { validateRequest, authenticateJWT } from "../middleware";

const router = express.Router();

router.get("/", getRoles);
router.get("/:id", getRole);
router.get("/name/:name", getRoleByName);
router.post("/", validateRequest(createRoleSchema), createRole);
router.patch("/:id", validateRequest(updateRoleSchema), updateRole);
router.delete("/:id", deleteRole);

export default router;
