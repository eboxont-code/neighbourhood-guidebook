export type AdminSessionState = "loading" | "signed-out" | "signed-in";
export type AdminAccessState = "loading" | "sign-in" | "checking" | "denied" | "dashboard";

/** The private admin dashboard is available only after an authenticated admin role check. */
export function adminAccessState(
  session: AdminSessionState,
  isAdmin: boolean | null,
): AdminAccessState {
  if (session === "loading") return "loading";
  if (session === "signed-out") return "sign-in";
  if (isAdmin === null) return "checking";
  return isAdmin ? "dashboard" : "denied";
}
