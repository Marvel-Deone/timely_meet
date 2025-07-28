'use client';

import AppLayout from "@/components/layouts/AppLayout";
// import AppSideBar from "@/components/dashboard/AppSideBar";
import { Toaster } from "@/components/ui/sonner";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { BarLoader } from "react-spinners"

interface AppLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: AppLayoutProps) => {
    return <AppLayout>{children}</AppLayout>;
}

export default ProtectedLayout;
