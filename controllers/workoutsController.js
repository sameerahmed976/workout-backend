import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Workouts from "../models/workoutModel";

// get all workouts

const getAllWorkouts = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const workouts = await Workouts.find({ userId: _id }).sort({ createdAt: -1 });

  // if (!workouts.length) {
  //   res.status(400).json(workouts);
  // }

  res.status(200).json(workouts);
});

// get  workout

const getWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // console.log(`* ~ file: workoutsController.js:23 ~ getWorkout ~ id`, id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("not  a valid id");
  }

  const workout = await Workouts.findById(id);

  res.status(200).json(workout);
});

// create  workout

const createWorkout = asyncHandler(async (req, res) => {
  const { title, load, reps, userId } = req.body;
  const { _id } = req.user;
  if (!title || !load || !reps) {
    res.status(400);
    throw new Error("All fields required");
  }

  const workouts = await Workouts.create({
    ...req.body,
    userId: _id,
  });
  res.status(201).json(workouts);
});

// update workout

const updateWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("not  a valid id");
  }

  const workout = await Workouts.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      ...req.body,
    },
    {
      new: true,
    }
  );

  res.status(200).json(workout);
});

// delete workout

const deleteWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("not  a valid id");
  }
  const workout = await Workouts.findOneAndDelete({
    _id: id,
  });

  res.status(200).json(workout);
});

export const workoutsController = {
  getAllWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
};
