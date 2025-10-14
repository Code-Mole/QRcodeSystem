import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  accessCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

  const userModel = mongoose.model("User", userSchema);

  export default userModel;
