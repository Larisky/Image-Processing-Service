import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

export default router;
