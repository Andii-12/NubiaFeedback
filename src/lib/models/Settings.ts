import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    publicUrl: { type: String, default: "http://localhost:3000" },
    organization: { type: String, default: "NUBIA AIS" },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
