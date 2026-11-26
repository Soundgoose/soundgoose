import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { SendToMailingListAction } from "./actions/sendToMailingListAction";

export default defineConfig({
  name: "default",
  title: "Sound Goose Studio",

  projectId: "qcz8ykkg",
  dataset: "production",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      if (
        context.schemaType === "post" ||
        context.schemaType === "newsletter"
      ) {
        return [...prev, SendToMailingListAction];
      }
      return prev;
    },
  },
});
