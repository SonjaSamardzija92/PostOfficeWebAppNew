import { Router } from "express";
import { PostOfficeController } from "../controllers/post-office.controller";

const router = Router();
const postOfficeController = new PostOfficeController();

router.post("/", postOfficeController.createNewPostOffice);
router.get("/", postOfficeController.getPostOffices.bind(postOfficeController));
router.delete("/:shipmentNumber", postOfficeController.deletePostOffice);
router.put("/:shipmentNumber", postOfficeController.updatePostOffice);
router.get("/:shipmentNumber", postOfficeController.getPostOfficeByZipCode);

export default router;
