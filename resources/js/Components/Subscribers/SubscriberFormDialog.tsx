// resources/js/Components/Subscribers/SubscriberFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import useRoute from "@novus/Hooks/useRoute";
import { Button } from "@novus/Components/ui/button";
import { Input } from "@novus/Components/ui/input";
import { Label } from "@novus/Components/ui/label";
import { cn } from "@novus/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@novus/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@novus/Components/ui/select";
import { Switch } from "@novus/Components/ui/switch";
import { Mail, BellRing, Send } from "lucide-react";
import { Subscriber, SubscriberFormData } from "@novus/types/subscriber";

interface SubscriberFormDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    subscriber?: Subscriber | null;
    onSuccess?: () => void;
}

const SubscriberFormDialog: React.FC<SubscriberFormDialogProps> = ({
    isOpen,
    onOpenChange,
    subscriber,
    onSuccess,
}) => {
    const route = useRoute();
    const isEditing = !!subscriber;

    const { data, setData, post, patch, processing, errors, reset } =
        useForm<SubscriberFormData>({
            email: "",
            name: "",
            status: "active",
            preferences: {
                marketing: true,
                newsletter: true,
                productUpdates: false,
            },
        });

    useEffect(() => {
        if (isOpen && subscriber) {
            setData({
                email: subscriber.email,
                name: subscriber.name || "",
                status: subscriber.status,
                preferences: subscriber.preferences || {
                    marketing: false,
                    newsletter: false,
                    productUpdates: false,
                },
            });
        } else if (isOpen) {
            reset();
        }
    }, [isOpen, subscriber]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const onComplete = () => {
            onOpenChange(false);
            if (onSuccess) onSuccess();
        };

        if (isEditing && subscriber) {
            patch(route("novus.subscribers.update", subscriber.id), {
                onSuccess: onComplete,
            });
        } else {
            post(route("novus.subscribers.store"), {
                onSuccess: onComplete,
            });
        }
    };

    const handlePreferenceChange = (key: string, value: boolean) => {
        setData("preferences", {
            ...data.preferences,
            [key]: value,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Subscriber" : "Add New Subscriber"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update subscriber details and preferences"
                            : "Add a new subscriber to your mailing list"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-3">
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email{" "}
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="subscriber@example.com"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className={cn(
                                        "pl-9",
                                        errors.email && "border-destructive",
                                    )}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className={cn(
                                    errors.name && "border-destructive",
                                )}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value: any) =>
                                    setData("status", value)
                                }
                            >
                                <SelectTrigger
                                    id="status"
                                    className={cn(
                                        errors.status && "border-destructive",
                                    )}
                                >
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                    <SelectItem value="unsubscribed">
                                        Unsubscribed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-xs text-destructive">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Email Preferences</Label>
                            <div className="rounded-md border divide-y">
                                <div className="flex justify-between items-center px-3 py-2">
                                    <div className="flex gap-2 items-center">
                                        <div className="flex justify-center items-center w-7 h-7 rounded-full bg-primary/10">
                                            <Send className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <Label
                                            htmlFor="marketing"
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            Marketing emails
                                        </Label>
                                    </div>
                                    <Switch
                                        id="marketing"
                                        checked={
                                            data.preferences?.marketing || false
                                        }
                                        onCheckedChange={(checked) =>
                                            handlePreferenceChange(
                                                "marketing",
                                                checked,
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex justify-between items-center px-3 py-2">
                                    <div className="flex gap-2 items-center">
                                        <div className="flex justify-center items-center w-7 h-7 rounded-full bg-primary/10">
                                            <Mail className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <Label
                                            htmlFor="newsletter"
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            Newsletter
                                        </Label>
                                    </div>
                                    <Switch
                                        id="newsletter"
                                        checked={
                                            data.preferences?.newsletter ||
                                            false
                                        }
                                        onCheckedChange={(checked) =>
                                            handlePreferenceChange(
                                                "newsletter",
                                                checked,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? isEditing
                                    ? "Saving..."
                                    : "Adding..."
                                : isEditing
                                  ? "Save Changes"
                                  : "Add Subscriber"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SubscriberFormDialog;
