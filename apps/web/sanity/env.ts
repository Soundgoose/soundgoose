export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder-project-id";

export const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "placeholder-project-id",
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
