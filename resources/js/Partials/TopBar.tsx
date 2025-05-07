import React from "react";
import { Link } from "@inertiajs/react";
import {
    Bell,
    FileText,
    Laptop,
    LogOut,
    MessageCircle,
    Moon,
    PanelLeft,
    PanelLeftClose,
    Search,
    Settings,
    Sun,
    User,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@novus/Components/ui/dropdown-menu";

import { Button } from "@novus/Components/ui/button";
import { Input } from "@novus/Components/ui/input";
import { Badge } from "@novus/Components/ui/badge";
import { useTheme } from "../providers/ThemeProvider";
import useRoute from "@novus/hooks/useRoute";
import { Author } from "@novus/types";
import Logo from "@novus/Components/Logo";

interface TopBarProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    title: string;
    user: Author;
    isLoggedIn: boolean;
}

const TopBar = ({ sidebarOpen, toggleSidebar, title, user }: TopBarProps) => {
    const { theme, setTheme } = useTheme();
    const route = useRoute();

    const toggleTheme = (newTheme: "light" | "dark" | "system") => {
        setTheme(newTheme);
    };

    return (
        <header className="fixed top-0 inset-x-0 h-16 bg-background/95 backdrop-blur-sm border-b z-40 flex items-center justify-between px-4 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex items-center">
                    <Logo />
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                    {sidebarOpen ? (
                        <PanelLeftClose className="h-5 w-5" />
                    ) : (
                        <PanelLeft className="h-5 w-5" />
                    )}
                </Button>

                <div className="hidden md:block border-l pl-4 ml-1">
                    <div className="text-sm font-semibold">{title}</div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Search"
                    className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Search className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Theme"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {theme === "light" && <Sun className="h-5 w-5" />}
                            {theme === "dark" && <Moon className="h-5 w-5" />}
                            {theme === "system" && (
                                <Laptop className="h-5 w-5" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Theme</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => toggleTheme("light")}
                            className="cursor-pointer"
                        >
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => toggleTheme("dark")}
                            className="cursor-pointer"
                        >
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => toggleTheme("system")}
                            className="cursor-pointer"
                        >
                            <Laptop className="h-4 w-4 mr-2" />
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-8 w-8 rounded-full overflow-hidden"
                            aria-label="User menu"
                        >
                            <div className="flex items-center justify-center h-8 w-8 bg-accent text-accent-foreground rounded-full">
                                <User className="h-4 w-4" />
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="flex items-center p-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">
                                    {user.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            asChild
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            <Link
                                href={route("novus.auth.logout")}
                                method="post"
                                as="button"
                                className="w-full flex items-center"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default TopBar;
