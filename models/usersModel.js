import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please add a username"],
  },
  email: {
    type: String,
    required: [true, "Please add a email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a Password"],
  },
});

export default mongoose.model("User", userSchema);
