import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
    CommandList,
    CommandItemProps,
} from "../Components/Editor/CommandList";
import { Editor } from "@tiptap/core";
import { vi } from "vitest";

// Mock the lucide-react icons
vi.mock("lucide-react", () => ({
    Heading1: () => <div data-testid="heading1-icon">H1</div>,
    Heading2: () => <div data-testid="heading2-icon">H2</div>,
    List: () => <div data-testid="list-icon">List</div>,
    ListOrdered: () => <div data-testid="list-ordered-icon">Ordered</div>,
    Quote: () => <div data-testid="quote-icon">Quote</div>,
    Code2: () => <div data-testid="code-icon">Code</div>,
    Heading3: () => <div data-testid="heading3-icon">H3</div>,
    ListTodo: () => <div data-testid="list-todo-icon">Todo</div>,
}));

describe("CommandList Component", () => {
    const mockEditor = {
        chain: () => ({
            focus: () => ({
                toggleHeading: () => ({
                    run: vi.fn(),
                }),
                toggleBulletList: () => ({
                    run: vi.fn(),
                }),
            }),
        }),
    } as unknown as Editor;

    const mockItems: CommandItemProps[] = [
        {
            title: "Heading 1",
            icon: <div>H1</div>,
            command: vi.fn(),
        },
        {
            title: "Bullet List",
            icon: <div>List</div>,
            command: vi.fn(),
        },
    ];

    const defaultProps = {
        items: mockItems,
        command: vi.fn(),
        selected: 0,
        setSelected: vi.fn(),
        editor: mockEditor,
        clientRect: () => ({
            top: 0,
            left: 0,
            width: 100,
            height: 100,
            right: 100,
            bottom: 100,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        }),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders command items correctly", () => {
        render(<CommandList {...defaultProps} />);
        expect(screen.getByText("Heading 1")).toBeInTheDocument();
        expect(screen.getByText("Bullet List")).toBeInTheDocument();
    });

    it("highlights the selected item", () => {
        render(<CommandList {...defaultProps} selected={1} />);
        const selectedItem = screen.getByText("Bullet List").closest("button");
        expect(selectedItem).toHaveClass("selected");
    });

    it("calls command function when item is clicked", () => {
        render(<CommandList {...defaultProps} />);
        fireEvent.click(screen.getByText("Heading 1"));
        expect(defaultProps.command).toHaveBeenCalledWith(mockItems[0]);
    });

    it("shows 'No results found' message when items array is empty", () => {
        render(<CommandList {...defaultProps} items={[]} />);
        expect(screen.getByText("No results found.")).toBeInTheDocument();
    });

    it("renders command item icons", () => {
        render(<CommandList {...defaultProps} />);
        const icons = screen
            .getAllByRole("button")
            .map((button) => button.querySelector(".command-menu-item-icon"));
        expect(icons).toHaveLength(2);
        expect(icons[0]).toBeInTheDocument();
        expect(icons[1]).toBeInTheDocument();
    });

    it("applies correct CSS classes to menu container", () => {
        const { container } = render(<CommandList {...defaultProps} />);
        expect(container.querySelector(".command-menu")).toBeInTheDocument();
        expect(
            container.querySelector(".command-menu-items"),
        ).toBeInTheDocument();
    });
});
