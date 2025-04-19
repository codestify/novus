import React, { useCallback, useEffect } from "react";
import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Editor } from "@tiptap/core";
import { lowlight } from "../editor/EditorLanguages";
import { BubbleMenuComponent } from "./Editor/BubbleMenuComponent";
import { AIAssistant } from "./Editor/AIAssistant";
import { WordCount } from "./Editor/WordCount";
import "../editor/editor-styles.css";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { SlashCommands } from "./Editor/SlashCommands";
import { TableControls } from "./Editor/TableControls";
import { cn } from "../lib/utils";
import CodeBlockComponent from "./Editor/CodeBlockComponent";
import { Markdown } from "tiptap-markdown";

interface NovelEditorProps {
    initialContent?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    className?: string;
    aiEnabled?: boolean;
    error?: boolean;
}

export const NovelEditor = ({
    initialContent = "",
    onChange,
    placeholder = "Start writing...",
    className = "",
    aiEnabled = true,
    error = false,
}: NovelEditorProps) => {
    const updateContent = useCallback(
        (editor: Editor | null) => {
            if (editor?.isEditable && !editor.isDestroyed) {
                onChange?.(editor.getHTML());
            }
        },
        [onChange],
    );

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
                showOnlyCurrent: true,
                emptyNodeClass: "is-editor-empty",
                emptyEditorClass: "is-editor-empty",
                showOnlyWhenEditable: true,
            }),
            Link.configure({
                openOnClick: true,
                HTMLAttributes: {
                    class: "text-blue-500 underline cursor-pointer",
                },
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: "notion-task-list",
                },
            }),
            TaskItem.configure({
                HTMLAttributes: {
                    class: "notion-task-item",
                },
                nested: true,
            }),
            Highlight.configure({
                HTMLAttributes: {
                    class: "bg-yellow-100 dark:bg-yellow-900 px-1 rounded",
                },
            }),
            CodeBlockLowlight.extend({
                addNodeView() {
                    return ReactNodeViewRenderer(CodeBlockComponent);
                },
                addAttributes() {
                    return {
                        language: {
                            default: "javascript",
                            parseHTML: (element) =>
                                element.getAttribute("data-language") ||
                                element
                                    .getAttribute("class")
                                    ?.replace(/^language-/, ""),
                            renderHTML: (attributes) => ({
                                "data-language": attributes.language,
                                class: `language-${attributes.language}`,
                            }),
                        },
                    };
                },
            }).configure({
                lowlight,
                HTMLAttributes: {
                    class: "notion-code-block",
                },
                defaultLanguage: "javascript",
                languageClassPrefix: "language-",
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: "border-collapse w-full border border-gray-200 dark:border-gray-700 relative group",
                },
                allowTableNodeSelection: true,
                handleWidth: 5,
                cellMinWidth: 100,
            }),
            TableRow.configure({
                HTMLAttributes: {
                    class: "border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: "border border-gray-200 dark:border-gray-700 p-2",
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: "border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 font-medium",
                },
            }),
            Image.configure({
                allowBase64: true,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Markdown.configure({
                html: true,
                tightLists: true,
                tightListClass: "tight",
                bulletListMarker: "-",
                linkify: true,
                breaks: true,
                transformPastedText: true,
            }),
            SlashCommands,
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none ${className}`,
            },
            handleDOMEvents: {
                focus: (view) => {
                    if (!view.hasFocus()) {
                        view.focus();
                    }
                    return false;
                },
                keydown: (view, event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                        return false;
                    }
                    if (event.key === "/") {
                        return false;
                    }
                    return false;
                },
            },
        },
        onUpdate: ({ editor }) => {
            updateContent(editor);
        },
    });

    // Add cleanup effect to destroy editor on unmount
    useEffect(() => {
        return () => {
            if (editor) {
                editor.destroy();
            }
        };
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="relative">
            <div className="flex flex-col h-[calc(100vh-300px)]">
                <div
                    className={cn(
                        "flex-1 rounded-lg bg-background overflow-y-auto",
                        error ? "border border-red-500" : "",
                    )}
                >
                    <BubbleMenuComponent editor={editor} />
                    {aiEnabled && <AIAssistant editor={editor} />}
                    <div className="min-h-[500px] p-4">
                        <div className="relative">
                            <EditorContent editor={editor} />
                            <TableControls editor={editor} />
                        </div>
                    </div>
                </div>
                <div className="sticky bottom-0 bg-background border-t border-border">
                    <WordCount editor={editor} />
                </div>
            </div>
        </div>
    );
};

export default NovelEditor;
