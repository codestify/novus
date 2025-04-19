import { createLowlight } from "lowlight";

// Import highlight.js language modules
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import sql from "highlight.js/lib/languages/sql";

// Create a new lowlight instance with no languages
export const lowlight = createLowlight();

// Register all our languages
lowlight.register("javascript", javascript);
lowlight.register("js", javascript);
lowlight.register("typescript", typescript);
lowlight.register("ts", typescript);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("php", php);
lowlight.register("python", python);
lowlight.register("py", python);
lowlight.register("java", java);
lowlight.register("json", json);
lowlight.register("markdown", markdown);
lowlight.register("md", markdown);
lowlight.register("sql", sql);

/**
 * Available language options for code blocks
 */
export const LANGUAGE_OPTIONS = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "php", label: "PHP" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "json", label: "JSON" },
    { value: "markdown", label: "Markdown" },
    { value: "sql", label: "SQL" },
];
