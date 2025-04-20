import { Editor } from "@tiptap/core";
import { Button } from "@novus/Components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@novus/Components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from "@novus/Components/ui/dialog";
import {
    Wand2,
    Sparkles,
    Scissors,
    Expand,
    MessageSquare,
    Loader2,
} from "lucide-react";
import { useState } from "react";
import AIService from "../../Services/AIService";
import { cn } from "@novus/lib/utils";

export const AIAssistant = ({ editor }: { editor: Editor }) => {
    const [loading, setLoading] = useState<string | null>(null);
    const [dialog, setDialog] = useState({
        open: false,
        message: "",
        isError: false,
    });

    const actions = [
        {
            id: "improve",
            label: "Improve Writing",
            icon: <Sparkles className="w-4 h-4" />,
        },
        {
            id: "shorten",
            label: "Shorten",
            icon: <Scissors className="w-4 h-4" />,
        },
        { id: "expand", label: "Expand", icon: <Expand className="w-4 h-4" /> },
        {
            id: "adjust-tone",
            label: "Professional Tone",
            icon: <MessageSquare className="w-4 h-4" />,
            params: { tone: "professional" },
        },
    ];

    /**
     * Insert markdown content into the editor
     * @param markdown The markdown content to insert
     * @param position Optional position to insert at (from and to), otherwise uses current selection
     */
    const insertMarkdown = (
        markdown: string,
        position?: { from: number; to: number },
    ) => {
        if (!markdown.trim()) return false;

        // Use position if provided, otherwise use current selection
        const { from, to } = position || editor.state.selection;

        // Delete the range if there's a selection
        if (from !== to) {
            editor.chain().focus().deleteRange({ from, to });
        }

        // Insert the markdown content
        // This relies on the Markdown extension transforming the content
        editor.chain().focus().insertContent(markdown).run();

        return true;
    };

    const handleAction = async (
        action: string,
        params: Record<string, string> = {},
    ) => {
        try {
            const { from, to } = editor.state.selection;
            if (from === to) {
                setDialog({
                    open: true,
                    message:
                        "Please select text before applying AI enhancement",
                    isError: false,
                });
                return;
            }

            setLoading(action);
            const text = editor.state.doc.textBetween(from, to, " ");

            if (!text.trim()) {
                setDialog({
                    open: true,
                    message: "The selected text is empty",
                    isError: false,
                });
                setLoading(null);
                return;
            }

            let result: string;

            switch (action) {
                case "improve":
                    result = await AIService.improve(text);
                    break;
                case "shorten":
                    result = await AIService.shorten(text);
                    break;
                case "expand":
                    result = await AIService.expand(text);
                    break;
                case "adjust-tone":
                    result = await AIService.adjustTone(
                        text,
                        params.tone || "professional",
                    );
                    break;
                default:
                    result = await AIService.processAction({
                        action,
                        content: text,
                        ...params,
                    });
            }

            if (result.trim()) {
                // Check if the result appears to be markdown by looking for common markdown characters
                const isMarkdown =
                    /[*#`>-]/.test(result) || result.includes("```");

                if (isMarkdown) {
                    insertMarkdown(result, { from, to });
                } else {
                    // Use the original insertion method for non-markdown content
                    editor
                        .chain()
                        .focus()
                        .deleteRange({ from, to })
                        .insertContent(result)
                        .run();
                }
            } else {
                setDialog({
                    open: true,
                    message: "The AI service returned an empty result",
                    isError: true,
                });
            }
        } catch (error) {
            console.error(error);
            setDialog({
                open: true,
                message:
                    error instanceof Error
                        ? error.message
                        : "An error occurred during AI processing",
                isError: true,
            });
        } finally {
            setLoading(null);
        }
    };

    return (
        <>
            <Dialog
                open={dialog.open}
                onOpenChange={(open) => setDialog({ ...dialog, open })}
            >
                <DialogContent className="sm:max-w-sm p-4">
                    <DialogTitle
                        className={
                            dialog.isError ? "text-red-600" : "text-foreground"
                        }
                    >
                        {dialog.isError ? "Error" : "Attention"}
                    </DialogTitle>
                    <p className="py-2 text-sm">{dialog.message}</p>
                    <DialogFooter>
                        <Button
                            size="sm"
                            onClick={() =>
                                setDialog({ ...dialog, open: false })
                            }
                        >
                            OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-10 hover:bg-primary/10"
                    >
                        <Wand2 className="w-4 h-4 text-primary" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3">
                    <p className="text-sm font-medium mb-2">AI Assistant</p>
                    <div className="grid gap-1.5">
                        {actions.map((action) => (
                            <Button
                                key={action.id}
                                variant="ghost"
                                size="sm"
                                className="justify-start h-9 hover:bg-primary/10"
                                onClick={() =>
                                    handleAction(action.id, action.params)
                                }
                                disabled={loading !== null}
                            >
                                <div className="flex items-center">
                                    <span
                                        className={cn(
                                            "text-primary mr-2",
                                            loading === action.id
                                                ? "animate-pulse"
                                                : "",
                                        )}
                                    >
                                        {loading === action.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            action.icon
                                        )}
                                    </span>
                                    {action.label}
                                </div>
                            </Button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
};
