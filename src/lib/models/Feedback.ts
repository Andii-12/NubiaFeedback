import mongoose from "mongoose";

const AdminNoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const FeedbackSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, unique: true },
    airlineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airline",
      required: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    locationType: { type: String, enum: ["checkin", "gate"], required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    shift: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true,
    },
    devices: { type: [String], required: true },
    technicalAnswers: {
      deviceStatus: { type: String, required: true },
      printingStatus: { type: String, default: "" },
      scanningStatus: { type: String, default: "" },
      workstationStatus: { type: String, default: "" },
      impactLevel: { type: String, required: true },
    },
    engineerAnswers: {
      responseSpeed: { type: String, required: true },
      resolutionSpeed: { type: String, required: true },
      fullyResolved: { type: String, required: true },
      communication: { type: String, required: true },
      explanationQuality: { type: String, required: true },
    },
    engineerRating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "", maxlength: 500 },
    engineerId: { type: mongoose.Schema.Types.ObjectId, ref: "Engineer" },
    adminNotes: { type: [AdminNoteSchema], default: [] },
  },
  { timestamps: true }
);

FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ date: -1 });
FeedbackSchema.index({ airlineId: 1 });
FeedbackSchema.index({ locationId: 1 });

export default mongoose.models.Feedback ||
  mongoose.model("Feedback", FeedbackSchema);
