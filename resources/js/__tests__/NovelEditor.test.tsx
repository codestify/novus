// Import mocks must be at the top level, before imports
vi.mock("@tiptap/react", () => ({
    useEditor: vi.fn(),
    EditorContent: vi.fn(() => <div data-testid="editor-content" />),
}));

vi.mock("@tiptap/starter-kit", () => ({
    default: {
        configure: vi.fn(() => ({ name: "StarterKit" })),
    },
}));

vi.mock("@tiptap/extension-placeholder", () => ({
    default: {
        configure: vi.fn(() => ({ name: "Placeholder" })),
    },
}));

vi.mock("@tiptap/extension-link", () => ({
    default: {
        configure: vi.fn(() => ({ name: "Link" })),
    },
}));

vi.mock("@tiptap/extension-task-list", () => ({
    default: {
        configure: vi.fn(() => ({ name: "TaskList" })),
    },
}));

vi.mock("@tiptap/extension-task-item", () => ({
    default: {
        configure: vi.fn(() => ({ name: "TaskItem" })),
    },
}));

vi.mock("@tiptap/extension-highlight", () => ({
    default: {
        configure: vi.fn(() => ({ name: "Highlight" })),
    },
}));

vi.mock("@tiptap/extension-code-block-lowlight", () => ({
    default: {
        extend: vi.fn(() => ({
            configure: vi.fn(() => ({ name: "CodeBlockLowlight" })),
            addNodeView: vi.fn(),
        })),
    },
}));

vi.mock("@tiptap/extension-table", () => ({
    Table: {
        configure: vi.fn(() => ({ name: "Table" })),
    },
}));

vi.mock("@tiptap/extension-table-row", () => ({
    TableRow: {
        configure: vi.fn(() => ({ name: "TableRow" })),
    },
}));

vi.mock("@tiptap/extension-table-cell", () => ({
    TableCell: {
        configure: vi.fn(() => ({ name: "TableCell" })),
    },
}));

vi.mock("@tiptap/extension-table-header", () => ({
    TableHeader: {
        configure: vi.fn(() => ({ name: "TableHeader" })),
    },
}));

vi.mock("@tiptap/extension-image", () => ({
    Image: {
        configure: vi.fn(() => ({ name: "Image" })),
        addNodeView: vi.fn(),
    },
}));

vi.mock("@tiptap/extension-text-align", () => ({
    TextAlign: {
        configure: vi.fn(() => ({ name: "TextAlign" })),
    },
}));

vi.mock("@novus/Components/Editor/SlashCommands", () => ({
    SlashCommands: { name: "SlashCommands" },
}));

vi.mock("@novus/Components/Editor/TableControls", () => ({
    TableControls: vi.fn(() => <div data-testid="table-controls" />),
}));

vi.mock("@novus/Components/Editor/AIAssistant", () => ({
    AIAssistant: vi.fn(() => <div data-testid="ai-assistant" />),
}));

vi.mock("@novus/Components/Editor/BubbleMenuComponent", () => ({
    BubbleMenuComponent: vi.fn(() => <div data-testid="bubble-menu" />),
}));

vi.mock("@novus/Components/Editor/WordCount", () => ({
    WordCount: vi.fn(() => <div data-testid="word-count" />),
}));

vi.mock("@novus/editor/EditorLanguages", () => ({
    lowlight: {},
}));

import React from "react";
import { render, screen } from "@testing-library/react";
import { NovelEditor } from "@novus/Components/NovelEditor";
import { vi } from "vitest";
import type { Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";

// Create a reference to the mocked useEditor
const useEditorMock = useEditor as unknown as ReturnType<typeof vi.fn>;

// Simplified Mock Editor that implements necessary Editor interface properties
const mockEditor = {
    isEditable: true,
    isDestroyed: false,
    getHTML: vi.fn(() => "<p>Test Content</p>"),
    state: { doc: { textContent: "Test Content" } },
    on: vi.fn(),
    off: vi.fn(),
    destroy: vi.fn(),
    commands: {},
    can: () => true,
    chain: () => ({ run: vi.fn() }),
    view: { dom: document.createElement("div") },
} as unknown as Editor;

describe("NovelEditor", () => {
    const defaultProps = {
        initialContent: "<p>Initial Content</p>",
        onChange: vi.fn(),
        placeholder: "Test Placeholder",
        className: "test-class",
        aiEnabled: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useEditorMock.mockReturnValue(mockEditor);
    });

    it("renders the editor and its sub-components", () => {
        render(<NovelEditor {...defaultProps} />);
        expect(screen.getByTestId("editor-content")).toBeInTheDocument();
        expect(screen.getByTestId("ai-assistant")).toBeInTheDocument();
        expect(screen.getByTestId("bubble-menu")).toBeInTheDocument();
        expect(screen.getByTestId("table-controls")).toBeInTheDocument();
        expect(screen.getByTestId("word-count")).toBeInTheDocument();
    });

    it("initializes useEditor with configuration", () => {
        render(<NovelEditor {...defaultProps} />);
        expect(useEditorMock).toHaveBeenCalledWith(
            expect.objectContaining({
                extensions: expect.any(Array),
                content: defaultProps.initialContent,
                editorProps: expect.any(Object),
            }),
        );
    });

    it("calls onChange when editor content updates", () => {
        render(<NovelEditor {...defaultProps} />);
        const onUpdateCallback = useEditorMock.mock.calls[0][0].onUpdate;
        onUpdateCallback?.({ editor: mockEditor });
        expect(defaultProps.onChange).toHaveBeenCalledWith(
            "<p>Test Content</p>",
        );
    });

    it("toggles AI assistant based on aiEnabled prop", () => {
        const { rerender } = render(
            <NovelEditor {...defaultProps} aiEnabled={true} />,
        );
        expect(screen.getByTestId("ai-assistant")).toBeInTheDocument();

        rerender(<NovelEditor {...defaultProps} aiEnabled={false} />);
        expect(screen.queryByTestId("ai-assistant")).not.toBeInTheDocument();
    });

    it("calls editor cleanup on unmount", () => {
        // Mock the editor's destroy method
        const destroySpy = vi.fn();
        const editorWithDestroy = {
            ...mockEditor,
            destroy: destroySpy,
        } as unknown as Editor;

        // Set up the mock to return our editor with the spy
        useEditorMock.mockReturnValue(editorWithDestroy);

        // Render and unmount
        const { unmount } = render(<NovelEditor {...defaultProps} />);
        unmount();

        // Verify destroy was called
        expect(destroySpy).toHaveBeenCalled();
    });
});
