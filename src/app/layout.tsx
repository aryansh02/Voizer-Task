import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Voizer Task",
  description: "Manage agents and test prompts seamlessly.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
