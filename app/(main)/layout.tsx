'use client';

import AppLayout from "@/components/layouts/AppLayout";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import AppSideBar from "@/components/dashboard/AppSideBar";

interface AppLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: AppLayoutProps) => {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <AppLayout>{children}</AppLayout>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default ProtectedLayout;
