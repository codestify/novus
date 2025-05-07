/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
        moduleNameMapper: {
            "^ziggy-js$": "<rootDir>/resources/js/__mocks__/ziggy-js.ts",
        },
    },
    resolve: {
        alias: {
            "@novus": resolve(__dirname, "resources/js"),
        },
    },
});
