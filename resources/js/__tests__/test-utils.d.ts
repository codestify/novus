import "@testing-library/jest-dom";
import { Editor } from "@tiptap/core";
import { Mock } from "vitest";
import { EditorView } from "prosemirror-view";

declare global {
    namespace Vi {
        interface JestMatchers<T> {
            toBeInTheDocument(): boolean;
            toHaveClass(className: string): boolean;
        }
    }
}

// Create a type that matches the public interface of Editor
type PublicEditor = Pick<Editor, keyof Editor>;

// Create a type that includes all required properties
type RequiredEditorProperties = {
    injectCSS: Mock;
    createExtensionManager: Mock;
    createCommandManager: Mock;
    createSchema: Mock;
    createState: Mock;
    createView: Mock;
    setOptions: Mock;
    setEditable: Mock;
    getEditable: Mock;
    isEditable: Mock;
    dispatchTransaction: Mock;
    getHTML: Mock;
    getText: Mock;
    isActive: Mock;
    chain: Mock;
    focus: Mock;
    run: Mock;
    on: Mock;
    off: Mock;
    toggleBold: Mock;
    toggleItalic: Mock;
    toggleStrike: Mock;
    toggleBulletList: Mock;
    toggleOrderedList: Mock;
    toggleBlockquote: Mock;
    toggleCodeBlock: Mock;
    setImage: Mock;
    insertTable: Mock;
    state: {
        selection: {
            content: Mock;
        };
        doc: {
            descendants: Mock;
        };
    };
    view: Partial<EditorView> & {
        dom: {
            classList: {
                add: Mock;
                remove: Mock;
            };
        };
    };
};

// Create a type that matches the Editor interface but makes all properties optional
type PartialEditor = Partial<Editor>;

// Create a type that includes private properties as optional
type PrivateEditorProperties = {
    commandManager?: any;
    css?: any;
    capturedTransaction?: any;
    callbacks?: any;
};

// Create a type that matches the Editor interface but makes private properties optional
type EditorWithOptionalPrivate = Omit<Editor, keyof PrivateEditorProperties> &
    PrivateEditorProperties;

export type MockEditor = EditorWithOptionalPrivate & RequiredEditorProperties;
