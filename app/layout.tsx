import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {
  ClerkProvider
} from '@clerk/nextjs';
import CreateEventDrawer from "@/components/ui/create-event";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "TimelyMeet",
  description: "Smart meeting scheduler",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <link rel="icon" href="/images/timely_meet_logo_dark.png" /> */}
        <link rel="icon" href="/icon.png" />
      </head>
      <ClerkProvider>
        <body
          className={inter.className}
        >
          {/* <Header /> */}
          <main className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white">
            {children}
            {/* <Toaster /> */}
          </main>
          <Footer />
          <Suspense fallback={null}>
            <CreateEventDrawer />
          </Suspense>
        </body>
      </ClerkProvider>
    </html >
  );
}
