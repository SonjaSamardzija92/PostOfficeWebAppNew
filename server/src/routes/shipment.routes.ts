import { Router } from "express";
import { ShipmentController } from "../controllers/shipment.controller";

const router = Router();
const shipmentController = new ShipmentController();

router.post("/", shipmentController.createShipment.bind(shipmentController));
router.get("/", shipmentController.getShipments.bind(shipmentController));

router.delete("/:shipmentNumber", shipmentController.deleteShipment);
router.put("/:shipmentNumber", shipmentController.updateShipment);
router.get("/:shipmentNumber", shipmentController.getShipmentByID);

export default router;
