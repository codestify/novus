import { render, screen, fireEvent } from "@testing-library/react";
import { AIAssistant } from "../Components/Editor/AIAssistant";
import { vi } from "vitest";
import type { Editor } from "@tiptap/core";

// Create a spy for the selection content function
const contentSpy = vi.fn().mockReturnValue({
    content: {
        firstChild: {
            textContent: "Selected text",
        },
    },
});

const mockEditor = {
    state: {
        selection: {
            content: contentSpy,
        },
    },
    chain: vi.fn().mockReturnThis(),
    focus: vi.fn().mockReturnThis(),
    run: vi.fn(),
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
} as unknown as Editor;

describe("AIAssistant", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the AI assistant button", () => {
        render(<AIAssistant editor={mockEditor} />);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("opens the popover when clicked", () => {
        render(<AIAssistant editor={mockEditor} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(screen.getByText("AI Assistant")).toBeInTheDocument();
    });

    it("displays AI action buttons", () => {
        render(<AIAssistant editor={mockEditor} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);

        expect(screen.getByText("Improve Writing")).toBeInTheDocument();
        expect(screen.getByText("Make Shorter")).toBeInTheDocument();
        expect(screen.getByText("Expand")).toBeInTheDocument();
        expect(screen.getByText("Adjust Tone")).toBeInTheDocument();
    });

    it("handles AI actions", () => {
        render(<AIAssistant editor={mockEditor} />);
        const button = screen.getByRole("button");
        fireEvent.click(button);

        const improveButton = screen.getByText("Improve Writing");
        fireEvent.click(improveButton);

        // Verify that the editor's selection content was accessed
        expect(contentSpy).toHaveBeenCalled();
    });
});
