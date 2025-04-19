import React from "react";
import { AlertTriangle, Check } from "lucide-react";
import { Input } from "@novus/Components/ui/input";
import { Label } from "@novus/Components/ui/label";
import { Textarea } from "@novus/Components/ui/textarea";
import { Badge } from "@novus/Components/ui/badge";
import { cn } from "@novus/lib/utils";
import { FieldWithCountProps } from "../types/post";

const FieldWithCount: React.FC<FieldWithCountProps> = ({
    label,
    fieldName,
    placeholder,
    maxLength = 0,
    description,
    isTextarea = false,
    data,
    setData,
    errors,
}) => {
    const value = data[fieldName] || "";
    const count = value.length;
    const isNearLimit = maxLength > 0 && count >= maxLength * 0.8;
    const isOverLimit = maxLength > 0 && count > maxLength;
    const isOptimal = maxLength > 0 && count > 0 && count <= maxLength * 0.8;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label
                    htmlFor={`seo-${fieldName}`}
                    className="font-medium text-sm"
                >
                    {label}
                </Label>
                {maxLength > 0 && (
                    <div className="flex items-center">
                        {isOptimal && (
                            <Badge
                                variant="outline"
                                className="mr-2 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 text-[10px] h-5"
                            >
                                <Check className="mr-1 h-3 w-3" />
                                Optimal
                            </Badge>
                        )}
                        <span
                            className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded-full",
                                isOverLimit
                                    ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                                    : isNearLimit
                                      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                                      : count > 0
                                        ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                                        : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
                            )}
                        >
                            {count}/{maxLength}
                        </span>
                    </div>
                )}
            </div>

            {isTextarea ? (
                <Textarea
                    id={`seo-${fieldName}`}
                    value={value}
                    onChange={(e) => setData(fieldName, e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                        "font-mono text-sm transition-colors duration-200 focus-within:border-primary/70 shadow-sm",
                        errors?.[fieldName] &&
                            "border-destructive focus-visible:ring-destructive/25",
                        isOverLimit &&
                            "border-red-300 dark:border-red-800 focus-visible:ring-red-500/20",
                        isNearLimit && "border-amber-300 dark:border-amber-800",
                        isOptimal && "border-green-300 dark:border-green-800",
                    )}
                />
            ) : (
                <Input
                    id={`seo-${fieldName}`}
                    value={value}
                    onChange={(e) => setData(fieldName, e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                        "font-mono text-sm h-9 transition-colors duration-200 focus-within:border-primary/70 shadow-sm",
                        errors?.[fieldName] &&
                            "border-destructive focus-visible:ring-destructive/25",
                        isOverLimit &&
                            "border-red-300 dark:border-red-800 focus-visible:ring-red-500/20",
                        isNearLimit && "border-amber-300 dark:border-amber-800",
                        isOptimal && "border-green-300 dark:border-green-800",
                    )}
                />
            )}

            {description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                    {description}
                </p>
            )}

            {errors?.[fieldName] && (
                <p className="text-xs text-destructive flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {errors[fieldName]}
                </p>
            )}
        </div>
    );
};

export default FieldWithCount;
