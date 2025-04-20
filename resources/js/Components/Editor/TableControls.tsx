import { Editor } from "@tiptap/core";
import { Button } from "@novus/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@novus/Components/ui/tooltip";
import { Table2, Rows, Columns, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface TableControlsProps {
    editor: Editor;
}

export const TableControls = ({ editor }: TableControlsProps) => {
    const [isTableActive, setIsTableActive] = useState(false);

    useEffect(() => {
        const updateTableActive = () => {
            setIsTableActive(editor.isActive("table"));
        };

        editor.on("selectionUpdate", updateTableActive);
        editor.on("transaction", updateTableActive);

        return () => {
            editor.off("selectionUpdate", updateTableActive);
            editor.off("transaction", updateTableActive);
        };
    }, [editor]);

    const safeCommand = useCallback(
        (command: () => boolean) => {
            try {
                if (editor.isActive("table")) {
                    command();
                }
            } catch (error) {
                // Error executing table command
            }
        },
        [editor],
    );

    if (!isTableActive) {
        return null;
    }

    return (
        <div className="absolute right-0 top-10 flex flex-col gap-1 bg-background border rounded-md shadow-sm p-1 z-10">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() =>
                                safeCommand(() =>
                                    editor.chain().focus().addRowBefore().run(),
                                )
                            }
                            className="h-8 w-8 p-0"
                        >
                            <Rows className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add row</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() =>
                                safeCommand(() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .addColumnBefore()
                                        .run(),
                                )
                            }
                            className="h-8 w-8 p-0"
                        >
                            <Columns className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add column</TooltipContent>
                </Tooltip>

                <div className="h-px w-full bg-border my-1" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() =>
                                safeCommand(() =>
                                    editor.chain().focus().deleteRow().run(),
                                )
                            }
                            className="h-8 w-8 p-0 text-destructive"
                        >
                            <Rows className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete row</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() =>
                                safeCommand(() =>
                                    editor.chain().focus().deleteColumn().run(),
                                )
                            }
                            className="h-8 w-8 p-0 text-destructive"
                        >
                            <Columns className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete column</TooltipContent>
                </Tooltip>

                <div className="h-px w-full bg-border my-1" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() =>
                                safeCommand(() =>
                                    editor.chain().focus().deleteTable().run(),
                                )
                            }
                            className="h-8 w-8 p-0 text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete table</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};
