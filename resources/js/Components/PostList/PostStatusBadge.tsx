import React from "react";
import { Badge } from "@novus/Components/ui/badge";

interface PostStatusBadgeProps {
    status: string;
}

export default function PostStatusBadge({ status }: PostStatusBadgeProps) {
    const getStatusConfig = () => {
        status = status.toLowerCase();
        switch (status) {
            case "published":
                return { variant: "default", label: "Published" };
            case "draft":
                return { variant: "outline", label: "Draft" };
            case "scheduled":
                return { variant: "warning", label: "Scheduled" };
            case "trashed":
                return { variant: "destructive", label: "Trashed" };
            default:
                return { variant: "secondary", label: status };
        }
    };

    const { variant, label } = getStatusConfig();

    return (
        <Badge variant={variant as any} className="capitalize">
            {label}
        </Badge>
    );
}
