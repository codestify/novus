import React, { useState, useEffect } from "react";
import { cn } from "@novus/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import Sidebar from "@novus/Partials/Sidebar";
import TopBar from "@novus/Partials/TopBar";
import { Toaster } from "@novus/Components/ui/toaster";
import useTypedPage from "@novus/hooks/useTypePage";

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
}

const AuthLayout = ({ children, title = "Dashboard" }: AuthLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const isDesktop = useMediaQuery("only screen and (min-width: 1024px)");
    const { auth } = useTypedPage().props;
    const { user, isLoggedIn } = auth;

    useEffect(() => {
        setSidebarOpen(isDesktop);
    }, [isDesktop]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <TopBar
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                title={title}
                user={user}
                isLoggedIn={isLoggedIn}
            />

            <div className="flex overflow-hidden flex-1">
                <Sidebar open={sidebarOpen} user={user} />

                <main
                    className={cn(
                        "flex-1 overflow-y-auto transition-all duration-300 ease-in-out p-4 md:p-6",
                        sidebarOpen && isDesktop ? "lg:ml-64" : "lg:ml-16",
                    )}
                >
                    <div className="container mx-auto">{children}</div>
                </main>
            </div>

            <Toaster />
        </div>
    );
};

export default AuthLayout;
