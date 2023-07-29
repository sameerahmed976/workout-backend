import express from "express";
import { workoutsController } from "../controllers/workoutsController";
import protect from "../middlewares/authMiddlewares";

const router = express.Router();

router
  .route("/")
  .get(protect, workoutsController.getAllWorkouts)
  .post(protect, workoutsController.createWorkout);

router
  .route("/:id")
  .get(protect, workoutsController.getWorkout)
  .put(protect, workoutsController.updateWorkout)
  .delete(protect, workoutsController.deleteWorkout);

export default router;
