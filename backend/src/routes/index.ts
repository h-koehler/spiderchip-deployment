import express from "express";
import authRoutes from "./authRoutes";
import roleRoutes from "./roleRoutes";
import testRoutes from "./testRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/role", roleRoutes);
router.use("/test", testRoutes);

export default router;
