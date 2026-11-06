import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "qcz8ykkg",
    dataset: "production",
  },
  deployment: {
    appId: "soundgoose-studio",
  },
  typegen: {
    enabled: true,
    path: "../web/app/**/*.{ts,tsx,js,jsx}",
    schema: "schema.json",
    generates: "../web/sanity.types.ts",
    overloadClientMethods: true,
  },
});
