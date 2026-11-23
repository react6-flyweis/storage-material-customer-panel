export type DrawingStage = "pending" | "approved" | "revision";

/** Where a drawing stands in its approval, as the drawing viewer sees it. */
export function getDrawingStage(status?: string): DrawingStage {
  const normalized = String(status || "").toLowerCase().trim();
  if (normalized === "approved") return "approved";
  if (["revision required", "revision_required", "rejected"].includes(normalized)) {
    return "revision";
  }
  return "pending";
}
