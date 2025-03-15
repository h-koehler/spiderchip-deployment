import express from "express";
import { login, register, currentUser } from "../controllers";
import { userRegisterSchema, userLoginSchema } from "../validation/userSchema";
import { validateRequest, authenticateJWT } from "../middleware";

const router = express.Router();

router.post("/register", validateRequest(userRegisterSchema), register);
router.post("/login", validateRequest(userLoginSchema), login);
router.get("/current-user", authenticateJWT, currentUser);

export default router;
