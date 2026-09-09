import { auth } from "@/lib/auth";
import type { UserRole } from "@/types";

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return {
    id: session.user.id,
    name: session.user.name || "",
    email: session.user.email,
    role: (session.user.role as UserRole) || "VIEWER",
  };
}

export function canWrite(role: UserRole) {
  return role === "ADMIN" || role === "ENGINEER";
}

export function canManage(role: UserRole) {
  return role === "ADMIN";
}
