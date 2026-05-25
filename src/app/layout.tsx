import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HireNova – The Smarter Way to Hire and Get Hired",
  description:
    "A modern recruitment platform connecting talent with opportunity. Find jobs, post jobs, and manage recruitment effortlessly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased"><Providers>{children}</Providers></body>
    </html>
  );
}
