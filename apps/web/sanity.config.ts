import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./sanity/schemaTypes";
import { projectId, dataset } from "./sanity/env";
import { structure } from "./sanity/structure";
import { SendToMailingListAction } from "./sanity/actions/sendToMailingListAction";

export default defineConfig({
  basePath: "/content",
  name: "soundgoose-studio",
  title: "Soundgoose Studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema,
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
