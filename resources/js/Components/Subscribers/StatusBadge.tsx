import React from "react";
import { Badge } from "@novus/Components/ui/badge";

interface StatusBadgeProps {
    status: "active" | "inactive" | "unsubscribed";
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const getVariant = () => {
        switch (status) {
            case "active":
                return "default"; // Changed from "success" to "default"
            case "inactive":
                return "secondary";
            case "unsubscribed":
                return "destructive";
            default:
                return "default";
        }
    };

    return (
        <Badge variant={getVariant()} className="capitalize">
            {status}
        </Badge>
    );
};
