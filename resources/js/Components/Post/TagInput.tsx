import React, { useState } from "react";
import { Card } from "@novus/Components/ui/card";
import { Button } from "@novus/Components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@novus/Components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@novus/Components/ui/command";
import { Check, ChevronsUpDown, Hash, PlusCircle, X } from "lucide-react";
import { cn } from "@novus/lib/utils";
import { Badge } from "@novus/Components/ui/badge";
import useTypedPage from "@novus/Hooks/useTypePage";

// Define Tag type
export type Tag = {
    id: number;
    name: string;
    slug: string;
};

interface TagInputProps {
    tags: string[];
    availableTags?: string[];
    onTagsChange: (tags: string[]) => void;
    error?: string;
}

const TagInput: React.FC<TagInputProps> = ({
    tags,
    availableTags = [],
    onTagsChange,
    error,
}) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Get stored tags from the page props
    const { all_tags: storedTags = [] } = useTypedPage().props;

    // Extract tag names from stored tags
    const storedTagNames =
        (storedTags.length && storedTags.map((tag: Tag) => tag.name)) || [];

    // Combine stored tag names with any explicitly provided available tags
    const combinedAvailableTags = [
        ...new Set([...storedTagNames, ...availableTags]),
    ];

    // Combine all tag names and selected tags for the dropdown
    const allTags = [...new Set([...combinedAvailableTags, ...tags])];

    // Filter tags based on input
    const filteredTags = allTags.filter((tag) =>
        tag.toLowerCase().includes(inputValue.toLowerCase()),
    );

    // Check if the current input is a new tag
    const isNewTag =
        inputValue.trim() !== "" &&
        !allTags.some((tag) => tag.toLowerCase() === inputValue.toLowerCase());

    const addTag = (tag: string) => {
        if (tag.trim() && !tags.includes(tag.trim())) {
            onTagsChange([...tags, tag.trim()]);
            setInputValue("");
        }
    };

    const removeTag = (tag: string) => {
        onTagsChange(tags.filter((t) => t !== tag));
    };

    const handleSelect = (value: string) => {
        if (tags.includes(value)) {
            removeTag(value);
        } else {
            addTag(value);
        }
    };

    const handleCreateNew = () => {
        if (inputValue.trim()) {
            addTag(inputValue.trim());
            setOpen(false);
        }
    };

    return (
        <Card className="p-5 rounded-md border border-muted shadow-xs bg-card">
            <div className="flex items-center mb-3">
                <Hash className="mr-2 w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Tags</h2>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between w-full h-10 cursor-pointer text-muted-foreground"
                    >
                        {tags.length > 0
                            ? `${tags.length} tag${tags.length === 1 ? "" : "s"} selected`
                            : "Select tags"}
                        <ChevronsUpDown className="ml-2 w-4 h-4 opacity-50 shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0 min-w-[var(--radix-popover-trigger-width)] w-[var(--radix-popover-trigger-width)]"
                    align="start"
                    sideOffset={2}
                >
                    <Command className="w-full">
                        <CommandInput
                            placeholder="Search or add new tag..."
                            value={inputValue}
                            onValueChange={setInputValue}
                            className="h-9"
                        />
                        <CommandList className="w-full">
                            <CommandEmpty>
                                {isNewTag ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="justify-start w-full text-muted-foreground hover:text-foreground"
                                        onClick={handleCreateNew}
                                    >
                                        <PlusCircle className="mr-2 w-4 h-4" />
                                        Create tag "{inputValue}"
                                    </Button>
                                ) : (
                                    <p>No tags found</p>
                                )}
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredTags.map((tag) => (
                                    <CommandItem
                                        key={tag}
                                        value={tag}
                                        onSelect={() => handleSelect(tag)}
                                        className="flex items-center"
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 h-4 w-4 flex items-center justify-center",
                                                tags.includes(tag)
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        >
                                            <Check className={cn("w-4 h-4")} />
                                        </div>
                                        {tag}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            {isNewTag && (
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={handleCreateNew}
                                        className="flex items-center"
                                    >
                                        <PlusCircle className="mr-2 w-4 h-4" />
                                        Create tag "{inputValue}"
                                    </CommandItem>
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="flex gap-1 items-center px-2 py-1 text-sm"
                        >
                            #{tag}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="p-0 ml-1 w-5 h-5 rounded-full hover:bg-muted-foreground/20"
                                onClick={() => removeTag(tag)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}

            {error && (
                <div className="mt-2 text-sm text-destructive">{error}</div>
            )}
        </Card>
    );
};

export default TagInput;
