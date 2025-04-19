import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { cn } from "@novus/lib/utils";
import {
    Activity,
    BarChart3,
    ChevronDown,
    ChevronRight,
    FileEdit,
    FileText,
    Folder,
    Image,
    LayoutDashboard,
    Mail,
    PlusCircle,
} from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@novus/Components/ui/tooltip";

import { Separator } from "@novus/Components/ui/separator";
import { Author } from "@novus/types";

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    expanded: boolean;
    active?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    hasChildren?: boolean;
    isOpen?: boolean;
}

interface SidebarProps {
    open: boolean;
    user: Author;
}

const NavItem: React.FC<NavItemProps> = ({
    icon,
    label,
    href,
    expanded,
    active = false,
    onClick,
    hasChildren = false,
    isOpen,
}) => {
    const content = (
        <div
            className={cn(
                "flex items-center py-2 px-2.5 rounded-md transition-all duration-200 group",
                active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                hasChildren && "justify-between",
                !expanded && "justify-center",
            )}
            onClick={onClick}
        >
            <div className="flex items-center">
                <div
                    className={cn(
                        "w-5 h-5 flex items-center justify-center",
                        expanded && "mr-2.5",
                    )}
                >
                    {icon}
                </div>
                {expanded && (
                    <span className="text-sm font-medium">{label}</span>
                )}
            </div>

            {expanded &&
                hasChildren &&
                (isOpen ? (
                    <ChevronDown size={16} />
                ) : (
                    <ChevronRight size={16} />
                ))}
        </div>
    );

    if (hasChildren) {
        return content;
    }

    return expanded ? (
        <Link href={href} className="block mb-1">
            {content}
        </Link>
    ) : (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link href={href} className="block mb-1">
                        {content}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center ml-1">
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const NavSection: React.FC<{
    label: string;
    expanded: boolean;
    children: React.ReactNode;
}> = ({ label, expanded, children }) => {
    return (
        <div className="mb-6">
            {expanded && (
                <div className="px-3 mb-3 text-xs font-bold tracking-wider uppercase text-muted-foreground/70">
                    {label}
                </div>
            )}
            <div className="space-y-1">{children}</div>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [isPostsOpen, setIsPostsOpen] = useState(true);

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-30 pt-16 border-r transition-all duration-300 ease-in-out bg-card",
                open ? "w-64" : "w-16",
                "flex flex-col",
            )}
        >
            <div className="overflow-y-auto flex-1 p-3">
                <div className="mb-6">
                    <NavItem
                        icon={<LayoutDashboard className="text-primary" />}
                        label="Dashboard"
                        href="/novus"
                        expanded={open}
                        active={activeMenu === "dashboard"}
                    />
                </div>

                <Separator className="my-4" />

                <nav className="space-y-1">
                    <NavSection label="Content" expanded={open}>
                        <NavItem
                            icon={<FileText />}
                            label="Posts"
                            href="#"
                            expanded={open}
                            active={activeMenu === "posts"}
                            hasChildren={true}
                            isOpen={isPostsOpen}
                            onClick={() => setIsPostsOpen(!isPostsOpen)}
                        />

                        {isPostsOpen && open && (
                            <div className="pl-2 mt-1 mb-2 ml-6 space-y-1 border-l border-muted">
                                <NavItem
                                    icon={<FileEdit className="w-4 h-4" />}
                                    label="All Posts"
                                    href="/novus/posts"
                                    expanded={open}
                                />
                                <NavItem
                                    icon={<PlusCircle className="w-4 h-4" />}
                                    label="Add New"
                                    href="/novus/posts/create"
                                    expanded={open}
                                />
                            </div>
                        )}

                        <NavItem
                            icon={<Folder />}
                            label="Categories"
                            href="/novus/categories"
                            expanded={open}
                            active={activeMenu === "categories"}
                        />
                    </NavSection>

                    <Separator className="my-4" />

                    <NavSection label="Media" expanded={open}>
                        <NavItem
                            icon={<Image />}
                            label="Media Library"
                            href="/novus/media"
                            expanded={open}
                            active={activeMenu === "media"}
                        />
                    </NavSection>

                    <Separator className="my-4" />

                    <NavSection label="Users" expanded={open}>
                        <NavItem
                            icon={<Mail />}
                            label="Subscribers"
                            href="/novus/subscribers"
                            expanded={open}
                            active={activeMenu === "subscribers"}
                        />
                    </NavSection>

                    <Separator className="my-4" />

                    <NavSection label="Analytics" expanded={open}>
                        <NavItem
                            icon={<BarChart3 />}
                            label="Statistics"
                            href="/novus/statistics"
                            expanded={open}
                            active={activeMenu === "statistics"}
                        />

                        <NavItem
                            icon={<Activity />}
                            label="Performance"
                            href="/novus/performance"
                            expanded={open}
                            active={activeMenu === "performance"}
                        />
                    </NavSection>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
