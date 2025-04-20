import React from "react";
import { cn } from "@novus/lib/utils";
import useTypedPage from "@novus/Hooks/useTypePage";

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    const { logo } = useTypedPage().props;

    if (!logo) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center gap-2",
                    className,
                )}
            >
                <div className="h-10 w-10 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                    <span className="text-white dark:text-black font-bold text-2xl">
                        N
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={className} dangerouslySetInnerHTML={{ __html: logo }} />
    );
};

export default Logo;
