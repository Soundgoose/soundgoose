import type { Metadata } from "next";
import "./studio.css";

export const metadata: Metadata = {
  title: "Sound Goose Studio | Team Portal",
  description: "Internal operations and editorial management portal for Sound Goose",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="sg-studio-root">{children}</div>;
}
