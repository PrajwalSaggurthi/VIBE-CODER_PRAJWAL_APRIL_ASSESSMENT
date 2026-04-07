import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkHub — Your Links, Your Brand",
  description: "Create a stunning link-in-bio page with custom themes, analytics, and drag-and-drop link management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
