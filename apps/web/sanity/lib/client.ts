import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, isConfigured } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export { isConfigured };
