import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Productivity at Localhost",
  description: "A local-first, frictionless, gamified productivity tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
