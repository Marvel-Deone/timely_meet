'use client';

import AppHeader from "@/components/dashboard/AppHeader";
import AppSideBar from "@/components/dashboard/AppSideBar";
import { Toaster } from "@/components/ui/sonner";
import { useUser } from "@clerk/nextjs";
import { BarLoader } from "react-spinners"

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    const { isLoaded } = useUser();

    return (
        <>
            {!isLoaded && <BarLoader width={"100%"} color="#36d7b7" />}
            <div className='w-full flex flex-col h-screen bg-blue-50 md:flex-row'>
                <AppSideBar />
                <main className="w-full flex-1 overflow-y-auto p-4 md:p-8">
                    <AppHeader />
                    {children}
                </main>
                {/* <BottomNav /> */}
            </div>
        </>
    )
}

export default AppLayout
