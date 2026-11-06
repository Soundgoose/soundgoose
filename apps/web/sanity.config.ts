import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./sanity/schemaTypes";
import { projectId, dataset } from "./sanity/env";
import { structure } from "./sanity/structure";

export default defineConfig({
  basePath: "/",
  name: "soundgoose-studio",
  title: "Sound Goose Studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema,
});
