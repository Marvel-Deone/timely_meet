'use client';

import AppHeader from "@/components/dashboard/AppHeader";
import AppSidebar from "@/components/dashboard/AppSideBar";
import MobileSidebar from "@/components/dashboard/MobileSideBar";
// import AppSideBar from "@/components/dashboard/AppSideBar";
import { Toaster } from "@/components/ui/sonner";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { BarLoader } from "react-spinners"

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    const { isLoaded } = useUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    }


    return (
        <>
            {!isLoaded && <BarLoader width={"100%"} color="#36d7b7" />}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Desktop Sidebar */}
                <AppSidebar />

                {/* Mobile Sidebar */}
                <MobileSidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

                {/* Header */}
                <AppHeader onMobileMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />

                {/* Main Content */}
                <main className="md:pl-64 pt-6">
                    <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
                </main>
            </div>
            {/* {children} */}
            {/* <div className='w-full flex flex-col h-screen bg-blue-50 md:flex-row'>
                <AppSideBar />
                <main className="w-full flex-1 overflow-y-auto p-4 md:p-8">
                    <AppHeader />
                </main>
                <BottomNav />
            </div> */}
        </>
    )
}

export default AppLayout
