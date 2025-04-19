import React, { useState } from "react";
import { Label } from "@novus/Components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, isAfter } from "date-fns";
import { cn } from "@novus/lib/utils";
import { Button } from "@novus/Components/ui/button";
import { Calendar } from "@novus/Components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@novus/Components/ui/popover";
import { PostDatePickerProps } from "@novus/types/post";

const PostDatePicker: React.FC<
    PostDatePickerProps & { postStatus: string }
> = ({ date, onChange, error, postStatus }) => {
    const [open, setOpen] = useState(false);

    const selectedDate = date ? new Date(date) : new Date();
    const isDateInFuture = date ? isAfter(new Date(date), new Date()) : false;

    const getLabels = () => {
        switch (postStatus) {
            case "draft":
                return {
                    label: "Set publication date",
                    description: "Choose when this content will be published",
                };
            case "scheduled":
                return {
                    label: "Scheduled publication date",
                    description:
                        "Content will publish automatically on this date",
                };
            case "published":
                return {
                    label: "Publication date",
                    description: "When this content was published",
                };
            default:
                return {
                    label: "Publication date",
                    description: "Select a date",
                };
        }
    };

    const { label: dateLabel, description: dateDescription } = getLabels();

    const handleDateChange = (newDate: Date | undefined) => {
        if (newDate) {
            const formattedDate = format(newDate, "yyyy-MM-dd");
            onChange(formattedDate);
            setOpen(false);
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="published_at" className="text-sm font-medium">
                {dateLabel}
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
                {dateDescription}
            </p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal shadow-none mt-[0.15rem] cursor-pointer",
                            !date && "text-muted-foreground",
                        )}
                    >
                        <CalendarIcon className="mr-2 w-4 h-4" />
                        {date ? (
                            format(new Date(date), "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
    );
};

export default PostDatePicker;
