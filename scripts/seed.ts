import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import { connectDB } from "../src/lib/db";

async function main() {
  await connectDB();
  console.log("NUBIA seed complete.");
  console.log("Admin login: admin@nubia.airport / NubiaAdmin2026!");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
