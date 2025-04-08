import { Router } from "express";
import { PostOfficeController } from "../controllers/post-office.controller";

const router = Router();
const postOfficeController = new PostOfficeController();

router.post("/", postOfficeController.createNewPostOffice);
router.get("/", postOfficeController.getPostOffices.bind(postOfficeController));
router.delete("/:zipCode", postOfficeController.deletePostOffice);
router.put("/:zipCode", postOfficeController.updatePostOffice);
router.get("/:zipCode", postOfficeController.getPostOfficeByZipCode);

export default router;
