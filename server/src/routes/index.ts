import { Router } from "express";
import authRoutes from "./auth.routes";
import postOfficeRoutes from "./post-office.routes";
import shipmentRoutes from "./shipment.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/post-offices", postOfficeRoutes);
router.use("/shipments", shipmentRoutes);

export default router;
