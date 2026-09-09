import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    type: { type: String, enum: ["checkin", "gate"], required: true },
    isActive: { type: Boolean, default: true },
    qrIdentifier: { type: String, required: true, trim: true, uppercase: true },
  },
  { timestamps: true }
);

LocationSchema.index({ qrIdentifier: 1 }, { unique: true });
LocationSchema.index({ code: 1, type: 1 }, { unique: true });

export default mongoose.models.Location ||
  mongoose.model("Location", LocationSchema);
