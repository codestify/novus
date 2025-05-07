import React, { useRef, useState } from "react";
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
import { Check, ChevronsUpDown, PlusCircle, Tag, X } from "lucide-react";
import { cn } from "@novus/lib/utils";
import { Badge } from "@novus/Components/ui/badge";
import useTypedPage from "@novus/hooks/useTypePage";
import { Category } from "@novus/types";

interface CategoryInputProps {
    categories: string[];
    availableCategories?: string[];
    onCategoriesChange: (categories: string[]) => void;
    error?: string;
}

const CategoryInput = ({
    categories,
    availableCategories = [],
    onCategoriesChange,
    error,
}: CategoryInputProps) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const { all_categories: storedCategories } = useTypedPage().props;

    const storedCategoryNames =
        (storedCategories.length &&
            storedCategories.map((category: Category) => category.name)) ||
        [];

    const combinedAvailableCategories = [
        ...new Set([...storedCategoryNames, ...availableCategories]),
    ];

    const allCategories = [
        ...new Set([...combinedAvailableCategories, ...categories]),
    ];

    const filteredCategories = allCategories.filter((category) =>
        category.toLowerCase().includes(inputValue.toLowerCase()),
    );

    const isNewCategory =
        inputValue.trim() !== "" &&
        !allCategories.some(
            (category) => category.toLowerCase() === inputValue.toLowerCase(),
        );

    const addCategory = (category: string) => {
        if (category.trim() && !categories.includes(category.trim())) {
            onCategoriesChange([...categories, category.trim()]);
            setInputValue("");
        }
    };

    const removeCategory = (category: string) => {
        onCategoriesChange(categories.filter((c) => c !== category));
    };

    const handleSelect = (value: string) => {
        if (categories.includes(value)) {
            removeCategory(value);
        } else {
            addCategory(value);
        }
    };

    const handleCreateNew = () => {
        if (inputValue.trim()) {
            addCategory(inputValue.trim());
            setOpen(false);
        }
    };

    return (
        <Card className="p-5 rounded-md border border-muted shadow-xs bg-card">
            <div className="flex items-center mb-3">
                <Tag className="mr-2 w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Categories</h2>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between w-full h-10 cursor-pointer text-muted-foreground"
                    >
                        {categories.length > 0
                            ? `${categories.length} categor${
                                  categories.length === 1 ? "y" : "ies"
                              } selected`
                            : "Select categories"}
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
                            placeholder="Search or add new category..."
                            value={inputValue}
                            onValueChange={setInputValue}
                            ref={inputRef}
                            className="h-9"
                        />
                        <CommandList className="w-full">
                            <CommandEmpty>
                                {isNewCategory ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="justify-start w-full text-muted-foreground hover:text-foreground"
                                        onClick={handleCreateNew}
                                    >
                                        <PlusCircle className="mr-2 w-4 h-4" />
                                        Create "{inputValue}"
                                    </Button>
                                ) : (
                                    <p>No categories found</p>
                                )}
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredCategories.map((category) => (
                                    <CommandItem
                                        key={category}
                                        value={category}
                                        onSelect={() => handleSelect(category)}
                                        className="flex items-center"
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 h-4 w-4 flex items-center justify-center",
                                                categories.includes(category)
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        >
                                            <Check className={cn("w-4 h-4")} />
                                        </div>
                                        {category}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            {isNewCategory && (
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={handleCreateNew}
                                        className="flex items-center"
                                    >
                                        <PlusCircle className="mr-2 w-4 h-4" />
                                        Create "{inputValue}"
                                    </CommandItem>
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {categories.map((category) => (
                        <Badge
                            key={category}
                            variant="secondary"
                            className="flex gap-1 items-center px-2 py-1 text-sm"
                        >
                            {category}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="p-0 ml-1 w-5 h-5 rounded-full hover:bg-muted-foreground/20"
                                onClick={() => removeCategory(category)}
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

export default CategoryInput;
