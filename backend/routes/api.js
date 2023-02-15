import express from "express";
import UserController from "../controllers/UserController.js";
import RefreshToken from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

// init router
const router = express.Router();

router.get("/api/users", verifyToken, UserController.getUsers);
router.post("/api/users", UserController.register);
router.post("/api/login", UserController.login);
router.get("/api/refresh", RefreshToken.refresh);
router.delete("/api/logout", UserController.logout);

export default router;
