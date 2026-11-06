"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

export default function ContentStudioPage() {
  return (
    <div
      style={{
        flex: 1,
        height: "calc(100vh - 52px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <NextStudio config={config} />
    </div>
  );
}
