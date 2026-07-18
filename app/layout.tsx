import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "PrepArena — ICSE Class 10 Board Exam Prep",
  description: "Practice with real ICSE Class 10 Board exam questions, track your streaks, earn XP, and clear your concepts using step-by-step AI tutoring explanations.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PrepArena — ICSE Class 10 Board Exam Prep",
    description: "Practice with real ICSE Class 10 Board exam questions, track your streaks, earn XP, and clear your concepts using step-by-step AI tutoring explanations.",
    type: "website",
    url: "https://preparena.org",
    siteName: "PrepArena",
    images: [
      {
        url: "https://preparena.org/og-default.png",
        width: 1200,
        height: 630,
        alt: "PrepArena Board Exam Training Ground"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepArena — ICSE Class 10 Board Exam Prep",
    description: "Practice with real ICSE Class 10 Board exam questions, track your streaks, earn XP, and clear your concepts using step-by-step AI tutoring explanations.",
    images: ["https://preparena.org/og-default.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-bgPrimary text-textPrimary antialiased selection:bg-primary/30 selection:text-white">
          {children}
          <Toaster theme="dark" position="bottom-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
