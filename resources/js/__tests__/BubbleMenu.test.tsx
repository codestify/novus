import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BubbleMenuComponent } from "../Components/Editor/BubbleMenuComponent";
import { Editor } from "@tiptap/core";
import { vi } from "vitest";

// Mock the lucide-react icons
vi.mock("lucide-react", () => ({
    Bold: () => <div data-testid="bold-icon">B</div>,
    Italic: () => <div data-testid="italic-icon">I</div>,
    Link: () => <div data-testid="link-icon">L</div>,
    Highlighter: () => <div data-testid="highlighter-icon">H</div>,
}));

// Mock @tiptap/react BubbleMenu
vi.mock("@tiptap/react", () => ({
    BubbleMenu: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="bubble-menu">{children}</div>
    ),
}));

describe("BubbleMenu Component", () => {
    const mockEditor = {
        chain: () => ({
            focus: () => ({
                toggleBold: () => ({
                    run: vi.fn(),
                }),
                toggleItalic: () => ({
                    run: vi.fn(),
                }),
                toggleHighlight: () => ({
                    run: vi.fn(),
                }),
                setLink: () => ({
                    run: vi.fn(),
                }),
            }),
        }),
        isActive: vi.fn().mockReturnValue(false),
    } as unknown as Editor;

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset window.prompt mock before each test
        vi.spyOn(window, "prompt").mockImplementation(() => null);
    });

    it("renders all formatting buttons", () => {
        render(<BubbleMenuComponent editor={mockEditor} />);
        expect(screen.getByTestId("bold-icon")).toBeInTheDocument();
        expect(screen.getByTestId("italic-icon")).toBeInTheDocument();
        expect(screen.getByTestId("link-icon")).toBeInTheDocument();
        expect(screen.getByTestId("highlighter-icon")).toBeInTheDocument();
    });

    it("applies active class when format is active", () => {
        const activeEditor = {
            ...mockEditor,
            isActive: (format: string) => format === "bold",
        } as unknown as Editor;

        render(<BubbleMenuComponent editor={activeEditor} />);
        const boldButton = screen.getByTestId("bold-icon").parentElement;
        expect(boldButton).toHaveClass("bubble-menu-button-active");
    });

    it("toggles bold format when bold button is clicked", () => {
        const toggleBoldRun = vi.fn();
        const editorWithBold = {
            ...mockEditor,
            chain: () => ({
                focus: () => ({
                    toggleBold: () => ({
                        run: toggleBoldRun,
                    }),
                }),
            }),
        } as unknown as Editor;

        render(<BubbleMenuComponent editor={editorWithBold} />);
        fireEvent.click(screen.getByTestId("bold-icon"));
        expect(toggleBoldRun).toHaveBeenCalled();
    });

    it("prompts for URL when link button is clicked", () => {
        const setLinkRun = vi.fn();
        const editorWithLink = {
            ...mockEditor,
            chain: () => ({
                focus: () => ({
                    setLink: () => ({
                        run: setLinkRun,
                    }),
                }),
            }),
        } as unknown as Editor;

        const promptSpy = vi
            .spyOn(window, "prompt")
            .mockReturnValue("https://example.com");

        render(<BubbleMenuComponent editor={editorWithLink} />);
        fireEvent.click(screen.getByTestId("link-icon"));

        expect(promptSpy).toHaveBeenCalledWith("Enter URL");
        expect(setLinkRun).toHaveBeenCalled();
    });

    it("does not set link when URL prompt is cancelled", () => {
        const setLinkRun = vi.fn();
        const editorWithLink = {
            ...mockEditor,
            chain: () => ({
                focus: () => ({
                    setLink: () => ({
                        run: setLinkRun,
                    }),
                }),
            }),
        } as unknown as Editor;

        vi.spyOn(window, "prompt").mockReturnValue(null);

        render(<BubbleMenuComponent editor={editorWithLink} />);
        fireEvent.click(screen.getByTestId("link-icon"));

        expect(setLinkRun).not.toHaveBeenCalled();
    });
});
