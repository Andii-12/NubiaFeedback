import mongoose from "mongoose";

const EngineerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Engineer ||
  mongoose.model("Engineer", EngineerSchema);
