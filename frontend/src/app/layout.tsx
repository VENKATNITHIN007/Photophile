import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/QueryProvider";
import { VerificationGate } from "@/components/guards/VerificationGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Photophile | India's Leading Photography Marketplace",
  description: "The all-in-one studio management platform for professional photographers.",
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
            <Toaster position="top-right" richColors />
            <VerificationGate>{children}</VerificationGate>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
