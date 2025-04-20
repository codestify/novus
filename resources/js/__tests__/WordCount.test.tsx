import { render, screen, act } from "@testing-library/react";
import { WordCount } from "@novus/Components/Editor/WordCount";
import { MockEditor } from "./test-utils";
import { vi } from "vitest";
import type { Editor } from "@tiptap/core";

// Create a mock editor that matches the Editor interface
const mockEditor = {
    getText: vi
        .fn()
        .mockReturnValue(
            "This is a test sentence with seven words.",
        ) as unknown as Editor["getText"],
    on: vi.fn() as unknown as Editor["on"],
    off: vi.fn() as unknown as Editor["off"],
    injectCSS: vi.fn(),
    createExtensionManager: vi.fn(),
    createCommandManager: vi.fn(),
    createSchema: vi.fn(),
    createState: vi.fn(),
    createView: vi.fn(),
    setOptions: vi.fn(),
    setEditable: vi.fn(),
    getEditable: vi.fn(),
    isEditable: vi.fn(),
    dispatchTransaction: vi.fn(),
    view: {
        dom: {
            classList: {
                add: vi.fn(),
                remove: vi.fn(),
            },
        },
    },
    // Add required Editor properties
    commands: {},
    can: () => true,
    chain: () => ({ run: vi.fn() }),
    destroy: vi.fn(),
} as unknown as Editor;

// Helper function to find text across multiple elements
const getTextContent = (element: Element): string => {
    const spans = element.querySelectorAll("span");
    return Array.from(spans)
        .map((span) => span.textContent || "")
        .join(" ")
        .trim();
};

describe("WordCount", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders word count statistics", () => {
        const { container } = render(<WordCount editor={mockEditor} />);
        const stats = container.querySelectorAll(".flex.items-center.gap-1");

        // The string "This is a test sentence with seven words." has 8 words
        expect(getTextContent(stats[0])).toBe("8 words");
        expect(getTextContent(stats[1])).toBe("41 characters");
        expect(getTextContent(stats[2])).toBe("1 min read");
    });

    it("updates when the document changes", () => {
        const { container } = render(<WordCount editor={mockEditor} />);

        // Simulate document update with new content
        (mockEditor.getText as ReturnType<typeof vi.fn>).mockReturnValue(
            "This is a new test sentence with eight words.",
        );

        const updateCallback = (mockEditor.on as ReturnType<typeof vi.fn>).mock
            .calls[0][1];

        // Wrap the update callback in act
        act(() => {
            updateCallback();
        });

        const stats = container.querySelectorAll(".flex.items-center.gap-1");
        expect(getTextContent(stats[0])).toBe("9 words");
        expect(getTextContent(stats[1])).toBe("45 characters");
        expect(getTextContent(stats[2])).toBe("1 min read");
    });

    it("cleans up event listeners on unmount", () => {
        const { unmount } = render(<WordCount editor={mockEditor} />);
        unmount();
        expect(mockEditor.off).toHaveBeenCalled();
    });

    it("calculates reading time correctly", () => {
        // Test with more words to get a longer reading time
        (mockEditor.getText as ReturnType<typeof vi.fn>).mockReturnValue(
            "This is a longer test sentence that should take more time to read. " +
                "It contains multiple sentences and more words than the previous test. " +
                "The reading time should be calculated based on the average reading speed.",
        );

        const { container } = render(<WordCount editor={mockEditor} />);
        const stats = container.querySelectorAll(".flex.items-center.gap-1");
        expect(getTextContent(stats[2])).toBe("1 min read");
    });
});
