import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Management System",
  description: "A Trello-style task board built with Next.js and Supabase"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
