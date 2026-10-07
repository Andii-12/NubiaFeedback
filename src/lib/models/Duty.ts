import mongoose from "mongoose";

const DutySchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    engineerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Engineer",
      required: true,
    },
    shift: { type: String, default: "" },
    sheetMonth: { type: String, default: "" },
  },
  { timestamps: true }
);

DutySchema.index({ date: 1, engineerId: 1 }, { unique: true });
DutySchema.index({ date: 1 });
DutySchema.index({ sheetMonth: 1 });

const existing = mongoose.models.Duty;
if (existing && !existing.schema.path("sheetMonth")) {
  existing.schema.add({ sheetMonth: { type: String, default: "" } });
}

export default existing || mongoose.model("Duty", DutySchema);
