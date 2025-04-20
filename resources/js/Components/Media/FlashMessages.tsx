import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@novus/lib/utils";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@novus/Components/ui/alert";

type FlashMessageType = "success" | "error";

type FlashMessagesProps = {
    success?: string;
    error?: string | null;
    autoClose?: boolean;
    duration?: number;
};

export function FlashMessages({
    success,
    error,
    autoClose = true,
    duration = 5000,
}: FlashMessagesProps) {
    const [messages, setMessages] = useState<
        { type: FlashMessageType; text: string }[]
    >([]);
    const [visible, setVisible] = useState<boolean[]>([]);

    useEffect(() => {
        // Reset state when new messages come in
        const newMessages: { type: FlashMessageType; text: string }[] = [];

        if (success) newMessages.push({ type: "success", text: success });
        if (error) newMessages.push({ type: "error", text: error });

        if (newMessages.length > 0) {
            setMessages(newMessages);
            setVisible(new Array(newMessages.length).fill(true));

            // Set up auto-dismiss if enabled
            if (autoClose) {
                newMessages.forEach((_, index) => {
                    setTimeout(() => {
                        setVisible((prev) => {
                            const updated = [...prev];
                            updated[index] = false;
                            return updated;
                        });
                    }, duration);
                });
            }
        }
    }, [success, error, autoClose, duration]);

    // Remove message from DOM after animation completes
    const handleAnimationEnd = (index: number) => {
        if (!visible[index]) {
            setMessages((prev) => prev.filter((_, i) => i !== index));
            setVisible((prev) => prev.filter((_, i) => i !== index));
        }
    };

    // Close a specific message manually
    const closeMessage = (index: number) => {
        setVisible((prev) => {
            const updated = [...prev];
            updated[index] = false;
            return updated;
        });
    };

    if (messages.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 mb-6">
            {messages.map((message, index) => (
                <div
                    key={`${message.type}-${index}`}
                    className={cn(
                        "transition-all duration-300 ease-in-out transform",
                        visible[index]
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-4",
                    )}
                    onAnimationEnd={() => handleAnimationEnd(index)}
                >
                    <Alert
                        variant={
                            message.type === "success"
                                ? "default"
                                : "destructive"
                        }
                        className="relative"
                    >
                        {message.type === "success" ? (
                            <CheckCircle className="w-4 h-4 shrink-0" />
                        ) : (
                            <XCircle className="w-4 h-4 shrink-0" />
                        )}
                        <AlertTitle>
                            {message.type === "success" ? "Success" : "Error"}
                        </AlertTitle>
                        <AlertDescription>{message.text}</AlertDescription>
                        <button
                            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                            onClick={() => closeMessage(index)}
                        >
                            <X className="w-4 h-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </Alert>
                </div>
            ))}
        </div>
    );
}
