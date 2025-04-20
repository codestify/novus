import React, { useState, useEffect } from "react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { LANGUAGE_OPTIONS } from "@novus/editor/EditorLanguages";
import { ChevronDown } from "lucide-react";

export const CodeBlockComponent = ({
    node,
    updateAttributes,
    selected,
}: NodeViewProps) => {
    const language = node.attrs.language || "javascript";
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    const selectLanguage = (newLanguage: string) => {
        updateAttributes({ language: newLanguage });
        setShowLanguageSelector(false);
    };

    // Hide language selector when clicking outside
    useEffect(() => {
        if (!selected) {
            setShowLanguageSelector(false);
        }

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                !target.closest(".code-block-language-selector") &&
                !target.closest(".code-block-language-button")
            ) {
                setShowLanguageSelector(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selected]);

    const currentLanguage =
        LANGUAGE_OPTIONS.find((opt) => opt.value === language)?.label ||
        "Plain Text";

    return (
        <NodeViewWrapper className="code-block-wrapper">
            <div className="code-block-header">
                {/* Always show the language selector button */}
                <div className="code-block-language">
                    <button
                        className="code-block-language-button"
                        onClick={() =>
                            setShowLanguageSelector(!showLanguageSelector)
                        }
                    >
                        {currentLanguage}
                        <ChevronDown className="w-3 h-3 ml-1" />
                    </button>

                    {showLanguageSelector && (
                        <div className="code-block-language-selector">
                            {LANGUAGE_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    className={`language-option ${language === option.value ? "active" : ""}`}
                                    onClick={() => selectLanguage(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <pre
                className={`notion-code-block language-${language}`}
                data-language={language}
            >
                {/* Use NodeViewContent for editable content */}
                <code className={`language-${language} hljs`}>
                    <NodeViewContent as="span" />
                </code>
            </pre>
        </NodeViewWrapper>
    );
};

export default CodeBlockComponent;
