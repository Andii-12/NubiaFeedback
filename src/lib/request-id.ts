import { Counter } from "@/lib/models";

export async function nextRequestId() {
  const year = new Date().getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { key: `feedback-${year}` },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  );
  return `NUB-${year}-${String(counter.seq).padStart(4, "0")}`;
}
