import React from "react";
import { MediaItem } from "@novus/types/media";
import { MediaListItem } from "./MediaListItem";

type ListViewProps = {
    items: MediaItem[];
    selectedItems: number[];
    onSelect: (id: number) => void;
    onItemClick: (item: MediaItem) => void;
};

export function ListView({
    items,
    selectedItems,
    onSelect,
    onItemClick,
}: ListViewProps) {
    return (
        <div className="divide-y">
            {items.map((item) => (
                <MediaListItem
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    onSelect={onSelect}
                    onClick={onItemClick}
                />
            ))}
        </div>
    );
}
