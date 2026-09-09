import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "ENGINEER", "VIEWER"],
      default: "VIEWER",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.AdminUser ||
  mongoose.model("AdminUser", AdminUserSchema);
