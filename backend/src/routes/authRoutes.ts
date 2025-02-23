import express from "express";
import { login, register, currentUser } from "../controllers/authController";
import { userSchema } from "../validation/userSchema";
import { validateRequest, authenticateJWT } from "../middleware";

const router = express.Router();

router.post("/register", validateRequest(userSchema), register);
router.post("/login", login);
router.get("/current-user", authenticateJWT, currentUser);

export default router;
