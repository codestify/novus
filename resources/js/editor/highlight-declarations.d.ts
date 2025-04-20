// Type declarations for highlight.js language modules
declare module "highlight.js/lib/languages/javascript";
declare module "highlight.js/lib/languages/typescript";
declare module "highlight.js/lib/languages/xml";
declare module "highlight.js/lib/languages/css";
declare module "highlight.js/lib/languages/php";
declare module "highlight.js/lib/languages/python";
declare module "highlight.js/lib/languages/java";
declare module "highlight.js/lib/languages/json";
declare module "highlight.js/lib/languages/markdown";
declare module "highlight.js/lib/languages/sql";

// Declare the core module
declare module "lowlight/lib/core" {
    export const lowlight: {
        registerLanguage: (name: string, language: any) => void;
    };
}
