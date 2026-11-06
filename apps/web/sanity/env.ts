export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export function getProjectId(): string {
  const envPid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (envPid && envPid.trim() && envPid !== "placeholder-project-id") {
    return envPid.trim();
  }
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("sg_sanity_project_id");
      if (stored && stored.trim() && stored !== "placeholder-project-id") {
        return stored.trim();
      }
    } catch {
      // ignore storage access errors
    }
  }
  return "qcz8ykkg";
}

export const projectId = getProjectId() || "qcz8ykkg";

export const isConfigured = Boolean(getProjectId());
