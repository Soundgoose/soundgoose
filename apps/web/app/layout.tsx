import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sound Goose — From Unfinished Demo to Global Release",
  description:
    "Claim your artist handle, share unreleased demos, find collaborators, and distribute your music. Join the waitlist for early access.",
  openGraph: {
    title: "Sound Goose — From Unfinished Demo to Global Release",
    description:
      "Claim your artist handle, share unreleased demos, find collaborators, and distribute your music.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${plusJakartaSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
