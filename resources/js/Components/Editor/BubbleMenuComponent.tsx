import React, { useEffect, useState } from "react";
import { BubbleMenu } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { Bold, Italic, Link as LinkIcon, Highlighter } from "lucide-react";

interface BubbleMenuComponentProps {
    editor: Editor;
}

export const BubbleMenuComponent = ({ editor }: BubbleMenuComponentProps) => {
    // Detect dark mode
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Check for dark mode on component mount and when theme changes
    useEffect(() => {
        // Initial check
        setIsDarkMode(document.documentElement.classList.contains("dark"));

        // Create observer to watch for changes to the dark class
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    setIsDarkMode(
                        document.documentElement.classList.contains("dark"),
                    );
                }
            });
        });

        // Start observing
        observer.observe(document.documentElement, { attributes: true });

        // Cleanup
        return () => observer.disconnect();
    }, []);

    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{
                duration: 100,
                theme: isDarkMode ? "dark" : "light",
            }}
            className="bubble-menu"
        >
            <div className="bubble-menu-container">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`bubble-menu-button ${
                        editor.isActive("bold")
                            ? "bubble-menu-button-active"
                            : ""
                    }`}
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`bubble-menu-button ${
                        editor.isActive("italic")
                            ? "bubble-menu-button-active"
                            : ""
                    }`}
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() =>
                        editor.chain().focus().toggleHighlight().run()
                    }
                    className={`bubble-menu-button ${
                        editor.isActive("highlight")
                            ? "bubble-menu-button-active"
                            : ""
                    }`}
                >
                    <Highlighter className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        const url = window.prompt("Enter URL");
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    className={`bubble-menu-button ${
                        editor.isActive("link")
                            ? "bubble-menu-button-active"
                            : ""
                    }`}
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
            </div>
        </BubbleMenu>
    );
};
