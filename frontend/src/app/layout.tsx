import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/shared/Navbar";
import { QueryProvider } from "@/components/shared/QueryProvider";
import { VerificationGate } from "@/components/shared/VerificationGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LensLoom | Find Your Perfect Photographer",
  description: "Connecting clients with top-tier professional photographers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <Toaster position="top-right" richColors />
            <VerificationGate>{children}</VerificationGate>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
