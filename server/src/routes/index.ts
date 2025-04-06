import { Router } from "express";
import authRoutes from "./auth.routes";
import postOfficeRoutes from "./post-office.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/post-offices", postOfficeRoutes);

export default router;
