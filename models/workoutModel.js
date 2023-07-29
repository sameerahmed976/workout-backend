import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    reps: {
      type: Number,
      required: [true, "Please add a reps"],
    },
    load: {
      type: Number,
      required: [true, "Please add a load"],
    },
    userId: {
      type: String,
      required: [true, "please add valid id"],
    },
  },
  {
    timestamps: true,
  }
);

//  singular Workout
export default mongoose.model("Workout", workoutSchema);
