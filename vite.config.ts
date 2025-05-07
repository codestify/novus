import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Environment detection
const isPackage = !__dirname.includes("vendor") && !__dirname.includes("node_modules");
const isCI = process.env.CI === 'true';

export default defineConfig({
    plugins: [
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
            "@novus": resolve(__dirname, "resources/js"),
            "ziggy-js": isCI
                ? false // Skip Ziggy in CI environment to prevent build errors
                : isPackage 
                    ? resolve(__dirname, "../../vendor/tightenco/ziggy") 
                    : resolve(__dirname, "../../../tightenco/ziggy"),
        },
    },
    base: '/vendor/novus/',
    build: {
        outDir: "public/build",
        assetsDir: "assets",
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
