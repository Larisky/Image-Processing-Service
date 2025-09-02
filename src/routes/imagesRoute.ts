import { Router } from "express";
import multer from "multer";
import { authenticateJWT } from "../middleware/authMiddleware";
import { ImageController } from "../controllers/imageController";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authenticateJWT, upload.single("image"), ImageController.uploadImage);
router.get("/", authenticateJWT, ImageController.listImages);
router.get("/:id", authenticateJWT, ImageController.getImage);
router.post("/:id/transform", authenticateJWT, ImageController.transformImage);


export default router;