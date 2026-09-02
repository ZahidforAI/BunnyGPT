import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BunnyGPT — Meet the Intelligence",
  description:
    "Choose Quant, Trader, or Contrarian and explore BunnyHood through three distinct AI agent archetypes.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/bunny-hood-logo.png",
    shortcut: "/bunny-hood-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
