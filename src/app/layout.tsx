import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soreti Loan Origination Platform",
  description: "Modern loan origination platform for seamless financing solutions. Apply for loans, track applications, and manage your financial journey.",
  keywords: ["Soreti", "Loan", "Financing", "Banking", "Ethiopia", "Loan Application"],
  authors: [{ name: "Soreti Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Soreti Loan Origination Platform",
    description: "Apply for loans and manage your financial journey with ease",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soreti Loan Origination Platform",
    description: "Apply for loans and manage your financial journey with ease",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
