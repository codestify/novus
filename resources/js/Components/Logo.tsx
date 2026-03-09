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
            <div className={cn("flex items-center gap-2", className)}>
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">N</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Novus
                </span>
            </div>
        );
    }

    return (
        <div className={className} dangerouslySetInnerHTML={{ __html: logo }} />
    );
};

export default Logo;
