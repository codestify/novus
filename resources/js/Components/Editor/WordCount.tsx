import { Editor } from "@tiptap/core";
import { useEffect, useState } from "react";

interface WordCountProps {
    editor: Editor;
}

export const WordCount = ({ editor }: WordCountProps) => {
    const [stats, setStats] = useState({
        words: 0,
        characters: 0,
        readingTime: 0,
    });

    useEffect(() => {
        const updateStats = () => {
            const content = editor.getText();
            const words = content.trim().split(/\s+/).length;
            const characters = content.length;
            const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute

            setStats({
                words,
                characters,
                readingTime,
            });
        };

        editor.on("update", updateStats);
        editor.on("selectionUpdate", updateStats);
        updateStats();

        return () => {
            editor.off("update", updateStats);
            editor.off("selectionUpdate", updateStats);
        };
    }, [editor]);

    return (
        <div className="flex items-center gap-4 px-4 py-2 text-sm text-muted-foreground border-t">
            <div className="flex items-center gap-1">
                <span className="font-medium">{stats.words}</span>
                <span>words</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="font-medium">{stats.characters}</span>
                <span>characters</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="font-medium">{stats.readingTime}</span>
                <span>min read</span>
            </div>
        </div>
    );
};
