import React, { ReactNode } from "react";
import { cn } from "@novus/lib/utils";
import { Button, ButtonProps } from "@novus/Components/ui/button";

export interface EmptyStateProps {
    /**
     * Icon to display in the empty state
     */
    icon?: ReactNode;

    /**
     * Title text for the empty state
     */
    title: string;

    /**
     * Optional description text
     */
    description?: string;

    /**
     * The primary call-to-action component
     */
    action?: ReactNode;

    /**
     * Text for the primary action button (if no action is provided)
     */
    actionText?: string;

    /**
     * The action to perform when the button is clicked
     */
    onAction?: () => void;

    /**
     * Props for the primary action button
     */
    actionProps?: ButtonProps;

    /**
     * Secondary action component
     */
    secondaryAction?: ReactNode;

    /**
     * Optional footer content
     */
    footer?: ReactNode;

    /**
     * Optional image to display above the icon
     */
    image?: ReactNode;

    /**
     * Optional className to apply to the container
     */
    className?: string;

    /**
     * Visual style variant
     */
    variant?: "default" | "compact" | "centered" | "card";

    /**
     * Additional CSS classes for the icon container
     */
    iconClassName?: string;

    /**
     * Animation for the empty state
     */
    animation?: "none" | "pulse" | "bounce" | "fade";
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    actionText = "Get Started",
    onAction,
    actionProps,
    secondaryAction,
    footer,
    image,
    className,
    variant = "default",
    iconClassName,
    animation = "none",
}: EmptyStateProps) {
    const animationClass = {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        fade: "animate-in fade-in duration-700",
    }[animation];

    const variantStyles = {
        default: "py-16",
        compact: "py-8",
        centered: "py-20 max-w-md mx-auto",
        card: "bg-card rounded-lg border shadow-sm p-8",
    }[variant];

    return (
        <div
            className={cn(
                "flex flex-col justify-center items-center px-4 w-full text-center",
                variantStyles,
                animationClass,
                className,
            )}
        >
            {image && <div className="mb-6 max-w-xs">{image}</div>}

            {icon && (
                <div
                    className={cn(
                        "flex items-center justify-center rounded-full bg-muted/50 mb-5",
                        variant === "compact" ? "h-16 w-16" : "h-20 w-20",
                        iconClassName,
                    )}
                >
                    <div className="text-muted-foreground">{icon}</div>
                </div>
            )}

            <h3
                className={cn(
                    "font-semibold tracking-tight",
                    variant === "compact" ? "text-base" : "text-xl",
                )}
            >
                {title}
            </h3>

            {description && (
                <p
                    className={cn(
                        "text-muted-foreground mt-2.5 max-w-sm",
                        variant === "compact" ? "text-sm" : "text-base",
                    )}
                >
                    {description}
                </p>
            )}

            {(action || onAction) && (
                <div className="flex flex-wrap gap-3 justify-center items-center mt-6">
                    {action || (
                        <Button onClick={onAction} {...actionProps}>
                            {actionText}
                        </Button>
                    )}

                    {secondaryAction && <div>{secondaryAction}</div>}
                </div>
            )}

            {footer && (
                <div className="mt-6 text-sm text-muted-foreground">
                    {footer}
                </div>
            )}
        </div>
    );
}
