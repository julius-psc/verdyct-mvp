import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/components/layout/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verdyct — AI Customs Compliance",
  description: "Verdyct automates document processing, HS code classification, and CBAM compliance for independent customs brokers and freight forwarders. AI-native, live in 1 day, built for SME brokers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme');var d=document.documentElement;if(s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches)){d.classList.add('dark')}else{d.classList.remove('dark')}})()`,
          }}
        />
      </head>
      <body className="h-full">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
          <Toaster
            theme="system"
            position="bottom-right"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
