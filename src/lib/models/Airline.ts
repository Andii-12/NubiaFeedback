import mongoose from "mongoose";

const AirlineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    logo: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AirlineSchema.index({ code: 1 }, { unique: true });

export default mongoose.models.Airline ||
  mongoose.model("Airline", AirlineSchema);
