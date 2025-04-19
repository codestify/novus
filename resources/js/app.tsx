import "./bootstrap";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { RouteContext } from "../js/Hooks/useRoute";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider } from "./providers/ThemeProvider";

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    progress: {
        color: "#4B5563",
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            //@ts-ignore
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        return root.render(
            <ThemeProvider defaultTheme="system" storageKey="novus-ui-theme">
                <RouteContext.Provider value={(window as any).route}>
                    <App {...props} />
                </RouteContext.Provider>
            </ThemeProvider>
        );
    },
});
