'use client';

import AppLayout from "@/components/layouts/AppLayout";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface AppLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: AppLayoutProps) => {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>
            <AppLayout>{children}</AppLayout>
        </QueryClientProvider>
    )
}

export default ProtectedLayout;
