import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Determine if we're running in the package directory or from a parent project
const isPackage =
    !__dirname.includes("vendor") && !__dirname.includes("node_modules");

export default defineConfig({
    plugins: [
        //@ts-ignore
        laravel({
            input: ["resources/css/app.css", "resources/js/app.tsx"],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: "automatic",
    },
    resolve: {
        alias: {
            // The critical part: ensure @novus resolves to the correct path
            "@novus": resolve(__dirname, "resources/js"),
            "ziggy-js": resolve(__dirname, "../../vendor/tightenco/ziggy"),
        },
    },
    build: {
        outDir: "public/build",
        manifest: true,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: [
                        "react",
                        "react-dom",
                        "react/jsx-runtime",
                        "lucide-react",
                        "@inertiajs/react",
                        "axios",
                    ],
                    ui: [
                        "@radix-ui/react-accordion",
                        "@radix-ui/react-alert-dialog",
                        "@radix-ui/react-dialog",
                        "@radix-ui/react-dropdown-menu",
                        "@radix-ui/react-tabs",
                        "@radix-ui/react-toast",
                        "class-variance-authority",
                        "clsx",
                        "tailwind-merge",
                    ],
                },
            },
        },
    },
});
