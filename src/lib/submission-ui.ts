export function uiStatusLabel(status: string): { label: "Live" | "Pending" | "Draft"; tone: "green" | "yellow" | "gray" } {
  if (status === "published") return { label: "Live", tone: "green" };
  if (status === "draft") return { label: "Draft", tone: "gray" };
  return { label: "Pending", tone: "yellow" };
}

export function badgeClass(tone: "green" | "yellow" | "gray"): string {
  switch (tone) {
    case "green":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "yellow":
      return "bg-amber-50 text-amber-800 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}
