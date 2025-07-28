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
import { Toaster } from "sonner";
import { EventProvider } from "@/context/EventContext";

export const metadata: Metadata = {
  title: "TimelyMeet",
  description: "Smart meeting scheduler",
};

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <head>
        {/* <link rel="icon" href="/images/timely_meet_logo_dark.png" /> */}
        <link rel="icon" href="/icon.png" />
      </head>
      <body
        className={inter.className}
      >
        <ClerkProvider>
          <EventProvider>
            {children}
            <Toaster position="top-right" richColors />
            <Suspense fallback={null}>
              <CreateEventDrawer />
            </Suspense>
          </EventProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

export default RootLayout;