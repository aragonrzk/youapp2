import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YouApp - Dating & Horoscope",
  description: "Find your match based on horoscope compatibility",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="max-w-md mx-auto min-h-screen bg-gray-50">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
