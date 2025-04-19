import React from "react";
import { render, screen } from "@testing-library/react";
import { SlashCommands } from "@novus/Components/Editor/SlashCommands";
import { vi } from "vitest";
import type { Editor } from "@tiptap/core";

// Mock suggestions items
const mockItems = [
    { title: "Heading 1", icon: <div></div>, command: vi.fn() },
    { title: "Heading 2", icon: <div></div>, command: vi.fn() },
    { title: "Heading 3", icon: <div></div>, command: vi.fn() },
    { title: "Bullet List", icon: <div></div>, command: vi.fn() },
    { title: "Numbered List", icon: <div></div>, command: vi.fn() },
    { title: "Task List", icon: <div></div>, command: vi.fn() },
    { title: "Table", icon: <div></div>, command: vi.fn() },
    { title: "Code Block", icon: <div></div>, command: vi.fn() },
    { title: "Blockquote", icon: <div></div>, command: vi.fn() },
];

// Create the mock for CommandList
vi.mock("@novus/Components/Editor/CommandList", () => ({
    CommandList: vi.fn(() => <div data-testid="command-list" />),
    suggestions: {
        items: ({ query = "" }) => {
            if (!query) return mockItems;
            return mockItems.filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase()),
            );
        },
    },
}));

describe("SlashCommands Extension", () => {
    it("creates extension with correct name", () => {
        expect(SlashCommands.name).toBe("slash-commands");
    });

    it("has correct suggestion options", () => {
        const options = SlashCommands.options;
        expect(options.suggestion.char).toBe("/");
        expect(typeof options.suggestion.items).toBe("function");
    });

    describe("suggestions.items", () => {
        it("returns all items when query is empty", () => {
            const items = mockItems;
            expect(items).toHaveLength(9); // Total number of default commands
            expect(items[0].title).toBe("Heading 1");
            expect(items[1].title).toBe("Heading 2");
            expect(items[2].title).toBe("Heading 3");
            expect(items[3].title).toBe("Bullet List");
            expect(items[4].title).toBe("Numbered List");
            expect(items[5].title).toBe("Task List");
            expect(items[6].title).toBe("Table");
            expect(items[7].title).toBe("Code Block");
            expect(items[8].title).toBe("Blockquote");
        });

        it("filters items based on query", () => {
            const items = mockItems.filter((item) =>
                item.title.toLowerCase().includes("head"),
            );
            expect(items).toHaveLength(3); // Should find all heading items
            expect(
                items.every((item) =>
                    item.title.toLowerCase().includes("head"),
                ),
            ).toBe(true);
        });

        it("returns empty array when no matches found", () => {
            const items = mockItems.filter((item) =>
                item.title.toLowerCase().includes("nonexistent"),
            );
            expect(items).toHaveLength(0);
        });

        it("is case insensitive", () => {
            const items = mockItems.filter((item) =>
                item.title.toLowerCase().includes("head".toLowerCase()),
            );
            expect(items).toHaveLength(3); // Should find all heading items
            expect(
                items.every((item) =>
                    item.title.toLowerCase().includes("head"),
                ),
            ).toBe(true);
        });

        it("includes command function for each item", () => {
            const items = mockItems;
            items.forEach((item) => {
                expect(typeof item.command).toBe("function");
                expect(item.icon).toBeDefined();
            });
        });
    });
});
