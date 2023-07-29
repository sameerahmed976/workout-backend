import express from "express";
import { usersController } from "../controllers/usersController";
import protect from "../middlewares/authMiddlewares";
const router = express.Router();

router.route("/signup").post(usersController.signup);
router.route("/login").post(usersController.login);
router.route("/me").get(protect, usersController.getMe);

// public route
router.route("/reset/forgetPassword").post(usersController.forgetPassword);
router.route("/reset/:id/:token").post(usersController.resetPassword);
export default router;
