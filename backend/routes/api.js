import express from "express";
import UserController from "../controllers/UserController.js";

// init router
const router = express.Router();

router.get("/api/users", UserController.getUsers);
router.post("/api/users", UserController.register);
router.post("/api/login", UserController.login);

export default router;
