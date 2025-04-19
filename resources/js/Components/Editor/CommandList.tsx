import React, { forwardRef } from "react";
import { Editor } from "@tiptap/core";
import {
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Code2,
    Heading3,
    ListTodo,
    Table2,
} from "lucide-react";

export interface CommandItemProps {
    title: string;
    icon: React.ReactNode;
    command: (editor: Editor) => void;
}

export interface CommandListProps {
    items: CommandItemProps[];
    command: (item: CommandItemProps) => void;
    selected: number;
    setSelected: (index: number) => void;
    editor: Editor;
    clientRect: () => DOMRect;
}

export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(
    (props, ref) => {
        const selectItem = (index: number) => {
            const item = props.items[index];
            if (item) {
                props.command(item);
            }
        };

        const upHandler = () => {
            props.setSelected(
                (props.selected + props.items.length - 1) % props.items.length,
            );
        };

        const downHandler = () => {
            props.setSelected((props.selected + 1) % props.items.length);
        };

        const enterHandler = () => {
            selectItem(props.selected);
        };

        return (
            <div className="command-menu" ref={ref}>
                <div className="command-menu-items">
                    {props.items.length ? (
                        props.items.map(
                            (item: CommandItemProps, index: number) => {
                                return (
                                    <button
                                        className={`command-menu-item ${
                                            index === props.selected
                                                ? "selected"
                                                : ""
                                        }`}
                                        key={index}
                                        onClick={() => selectItem(index)}
                                    >
                                        <div className="command-menu-item-icon">
                                            {item.icon}
                                        </div>
                                        <div className="command-menu-item-content">
                                            <div className="command-menu-item-title">
                                                {item.title}
                                            </div>
                                        </div>
                                    </button>
                                );
                            },
                        )
                    ) : (
                        <div className="command-menu-empty">
                            <div className="command-menu-empty-text">
                                No results found.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    },
);

CommandList.displayName = "CommandList";

export const suggestions = {
    items: ({ query }: { query: string }) => {
        const items: CommandItemProps[] = [
            {
                title: "Heading 1",
                icon: <Heading1 className="w-4 h-4" />,
                command: (editor: Editor) => {
                    editor.chain().focus().toggleHeading({ level: 1 }).run();
                },
            },
            {
                title: "Heading 2",
                icon: <Heading2 className="w-4 h-4" />,
                command: (editor: Editor) => {
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                },
            },
            {
                title: "Heading 3",
                icon: <Heading3 className="w-4 h-4" />,
                command: (editor: Editor) => {
                    editor.chain().focus().toggleHeading({ level: 3 }).run();
                },
            },
            {
                title: "Bullet List",
                icon: <List className="w-4 h-4" />,
                command: (editor: Editor) => {
                    editor.chain().focus().toggleBulletList().run();
                },
            },
            {
                title: "Numbered List",
                icon: <ListOrdered className="w-4 h-4" />,
                command: (editor: Editor) => {
                    editor.chain().focus().toggleOrderedList().run();
                },
            },
            {
                title: "Task List",
                icon: <ListTodo className="w-4 h-4" />,
                command: (editor: Editor) => {
                    editor.chain().focus().toggleTaskList().run();
                },
            },
            {
                title: "Table",
                icon: <Table2 className="w-4 h-4" />,
                command: (editor: Editor) => {
                    editor
                        .chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
                        .run();
                },
            },
            {
                title: "Code Block",
                icon: <Code2 className="w-4 h-4" />,
                command: (editor: Editor) => {
                    // Default to JavaScript but user can change it after inserting
                    editor
                        .chain()
                        .focus()
                        .toggleCodeBlock({ language: "javascript" })
                        .run();
                },
            },
            {
                title: "Blockquote",
                icon: <Quote className="w-4 h-4" />,
                command: (editor: Editor) => {
                    editor.chain().focus().toggleBlockquote().run();
                },
            },
        ];

        return items.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()),
        );
    },
};
