import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import tippy, { Instance } from "tippy.js";
import { CommandList, suggestions } from "./CommandList";

const renderItems = () => {
    let component: ReactRenderer | null = null;
    let popup: Instance[] | null = null;
    let selected = 0;

    const setSelected = (index: number) => {
        selected = index;
        if (component) {
            component.updateProps({ selected });
        }
    };

    const destroyPopup = () => {
        if (popup?.[0]) {
            popup[0].destroy();
            popup = null;
        }
    };

    const selectItem = (item: any) => {
        if (popup?.[0]) {
            popup[0].hide();
            destroyPopup();
        }
        if (component) {
            const editor = (component.props as any).editor;
            component.destroy();
            component = null;
            item.command(editor);
        }
    };

    return {
        onStart: (props: any) => {
            destroyPopup();

            component = new ReactRenderer(CommandList, {
                props: {
                    ...props,
                    selected,
                    setSelected,
                    command: selectItem,
                },
                editor: props.editor,
            });

            popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
                theme: "light-border",
            });
        },

        onUpdate: (props: any) => {
            if (!popup?.[0] || !component) return;

            component.updateProps({
                ...props,
                selected,
                setSelected,
                command: selectItem,
            });

            popup[0].setProps({
                getReferenceClientRect: props.clientRect,
            });
        },

        onKeyDown: (props: { event: KeyboardEvent }) => {
            const { event } = props;

            if (!component?.props) {
                return false;
            }

            const componentProps = component.props as any;

            if (event.key === "ArrowUp") {
                const itemsLength = componentProps.items.length;
                if (itemsLength > 0) {
                    setSelected((selected + itemsLength - 1) % itemsLength);
                    return true;
                }
            }

            if (event.key === "ArrowDown") {
                const itemsLength = componentProps.items.length;
                if (itemsLength > 0) {
                    setSelected((selected + 1) % itemsLength);
                    return true;
                }
            }

            if (event.key === "Enter") {
                const item = componentProps.items[selected];
                if (item) {
                    selectItem(item);
                    return true;
                }
            }

            if (event.key === "Escape") {
                destroyPopup();
                return true;
            }

            return false;
        },

        onExit: () => {
            if (component) {
                component.destroy();
                component = null;
            }
            destroyPopup();
        },
    };
};

export const SlashCommands = Extension.create({
    name: "slash-commands",
    addOptions() {
        return {
            suggestion: {
                char: "/",
                ...suggestions,
                render: renderItems,
            },
        };
    },
    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});
