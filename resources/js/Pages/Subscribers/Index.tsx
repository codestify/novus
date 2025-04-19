import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthLayout from "@novus/Layouts/AuthLayout";
import { Button } from "@novus/Components/ui/button";
import {
    Plus,
    Edit,
    Trash2,
    MailCheck,
    CheckCheck,
    X,
    Mail,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@novus/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@novus/Components/ui/table";
import { Checkbox } from "@novus/Components/ui/checkbox";
import { format } from "date-fns";

import useRoute from "@novus/Hooks/useRoute";
import { useToast } from "@novus/Hooks/use-toast";
import { EmptyState } from "@novus/Components/EmptyState";
import { PaginationWrapper } from "@novus/Components/PaginationWrapper";
import SubscriberFilters from "@novus/Components/Subscribers/SubscriberFilters";
import SubscriberFormDialog from "@novus/Components/Subscribers/SubscriberFormDialog";
import DeleteSubscriberDialog from "@novus/Components/Subscribers/DeleteSubscriberDialog";
import { StatusBadge } from "@novus/Components/Subscribers/StatusBadge";
import { Subscriber } from "@novus/types/subscriber";
import { SubscribersResponse } from "@novus/types";

interface Props {
    subscribers: SubscribersResponse;
    filters: {
        search: string;
        status: string;
        sort_by: string;
        sort_dir: string;
        per_page: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const Index: React.FC<Props> = ({ subscribers, filters, flash }) => {
    const route = useRoute();
    const { toast } = useToast();

    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [selectedSubscribers, setSelectedSubscribers] = useState<number[]>(
        [],
    );
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingSubscriber, setEditingSubscriber] =
        useState<Subscriber | null>(null);
    const [deletingSubscriber, setDeletingSubscriber] =
        useState<Subscriber | null>(null);

    // Display success/error toast if flash messages exist
    React.useEffect(() => {
        if (flash?.success) {
            toast({
                title: "Success",
                description: flash.success,
                variant: "default",
            });
        }
        if (flash?.error) {
            toast({
                title: "Error",
                description: flash.error,
                variant: "destructive",
            });
        }
    }, [flash]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchQuery });
    };

    const handleStatusFilterChange = (status: string) => {
        applyFilters({ status });
    };

    const applyFilters = (newFilters: Partial<typeof filters>) => {
        router.get(
            route("novus.subscribers.index"),
            {
                ...filters,
                ...newFilters,
            },
            { preserveState: true },
        );
    };

    const handleSelectAll = () => {
        if (selectedSubscribers.length === subscribers.data.length) {
            setSelectedSubscribers([]);
        } else {
            setSelectedSubscribers(
                subscribers.data.map((subscriber) => subscriber.id),
            );
        }
    };

    const handleSelectSubscriber = (subscriberId: number) => {
        if (selectedSubscribers.includes(subscriberId)) {
            setSelectedSubscribers(
                selectedSubscribers.filter((id) => id !== subscriberId),
            );
        } else {
            setSelectedSubscribers([...selectedSubscribers, subscriberId]);
        }
    };

    const handleBulkAction = (action: string) => {
        if (selectedSubscribers.length === 0) return;

        router.post(
            route("novus.subscribers.bulk.action"),
            {
                action,
                subscriber_ids: selectedSubscribers,
            },
            {
                onSuccess: () => {
                    setSelectedSubscribers([]);
                    router.reload({ only: ["subscribers"] });
                },
                preserveScroll: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            route("novus.subscribers.index", { page }),
            {
                search: searchQuery || undefined,
                status: filters.status !== "all" ? filters.status : undefined,
            },
            { preserveState: true },
        );
    };

    const handleEditSubscriber = (subscriber: Subscriber) => {
        setEditingSubscriber(subscriber);
        setFormDialogOpen(true);
    };

    const handleDeleteSubscriber = (subscriber: Subscriber) => {
        setDeletingSubscriber(subscriber);
        setDeleteDialogOpen(true);
    };

    const renderVerificationStatus = (subscriber: Subscriber) => {
        if (subscriber.email_verified_at) {
            return (
                <div className="flex items-center text-green-600">
                    <CheckCheck className="mr-1 w-4 h-4" />
                    <span className="text-xs">
                        {format(
                            new Date(subscriber.email_verified_at),
                            "MMM d, yyyy",
                        )}
                    </span>
                </div>
            );
        }
        return (
            <div className="flex items-center text-amber-600">
                <X className="mr-1 w-4 h-4" />
                <span className="text-xs">Not verified</span>
            </div>
        );
    };

    const renderPreferences = (subscriber: Subscriber) => {
        if (!subscriber.preferences)
            return <span className="text-sm text-muted-foreground">None</span>;

        const preferences = subscriber.preferences as Record<string, boolean>;
        const activePrefs = Object.entries(preferences)
            .filter(([_, value]) => value)
            .map(([key]) => key);

        if (activePrefs.length === 0) {
            return <span className="text-sm text-muted-foreground">None</span>;
        }

        return (
            <div className="flex flex-wrap gap-1">
                {activePrefs.map((pref) => (
                    <span
                        key={pref}
                        className="px-1.5 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-md capitalize"
                    >
                        {pref}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <>
            <Head title="Subscribers" />
            <AuthLayout>
                <div className="container py-20 max-w-7xl">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Subscribers
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Manage your email subscribers and their
                                preferences
                            </p>
                        </div>

                        <Button onClick={() => setFormDialogOpen(true)}>
                            <Plus className="mr-2 w-4 h-4" />
                            New Subscriber
                        </Button>
                    </div>

                    <Card className="rounded-md shadow-xs">
                        <CardHeader className="pb-3">
                            <CardTitle>All Subscribers</CardTitle>
                            <CardDescription>
                                {subscribers.meta?.total || 0} total subscribers
                            </CardDescription>
                        </CardHeader>

                        <SubscriberFilters
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            statusFilter={filters.status}
                            handleStatusFilterChange={handleStatusFilterChange}
                            handleSearch={handleSearch}
                            selectedSubscribers={selectedSubscribers}
                            handleBulkAction={handleBulkAction}
                            total={subscribers.meta?.total || 0}
                        />

                        <CardContent className="p-0">
                            {subscribers.data.length > 0 ? (
                                <div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-muted/50">
                                                <TableHead className="px-4 w-12">
                                                    <Checkbox
                                                        checked={
                                                            selectedSubscribers.length >
                                                                0 &&
                                                            selectedSubscribers.length ===
                                                                subscribers.data
                                                                    .length
                                                        }
                                                        onCheckedChange={
                                                            handleSelectAll
                                                        }
                                                        aria-label="Select all"
                                                    />
                                                </TableHead>
                                                <TableHead className="px-4">
                                                    Email
                                                </TableHead>
                                                <TableHead className="px-4">
                                                    Name
                                                </TableHead>
                                                <TableHead className="hidden px-4 md:table-cell">
                                                    Verified
                                                </TableHead>
                                                <TableHead className="px-4">
                                                    Status
                                                </TableHead>
                                                <TableHead className="hidden px-4 lg:table-cell">
                                                    Preferences
                                                </TableHead>
                                                <TableHead className="hidden px-4 md:table-cell">
                                                    Subscribed
                                                </TableHead>
                                                <TableHead className="px-4 text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {subscribers.data.map(
                                                (subscriber) => (
                                                    <TableRow
                                                        key={subscriber.id}
                                                        className="hover:bg-muted/50"
                                                    >
                                                        <TableCell className="px-4 py-3">
                                                            <Checkbox
                                                                checked={selectedSubscribers.includes(
                                                                    subscriber.id,
                                                                )}
                                                                onCheckedChange={() =>
                                                                    handleSelectSubscriber(
                                                                        subscriber.id,
                                                                    )
                                                                }
                                                                aria-label={`Select ${subscriber.email}`}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 font-medium">
                                                            <div className="flex items-center">
                                                                <Mail className="mr-2 w-4 h-4 text-muted-foreground" />
                                                                {
                                                                    subscriber.email
                                                                }
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3">
                                                            {subscriber.name || (
                                                                <span className="italic text-muted-foreground">
                                                                    Not provided
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="hidden px-4 py-3 md:table-cell">
                                                            {renderVerificationStatus(
                                                                subscriber,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3">
                                                            <StatusBadge
                                                                status={
                                                                    subscriber.status
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell className="hidden px-4 py-3 lg:table-cell">
                                                            {renderPreferences(
                                                                subscriber,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="hidden px-4 py-3 text-sm md:table-cell text-muted-foreground">
                                                            {format(
                                                                new Date(
                                                                    subscriber.subscribed_at,
                                                                ),
                                                                "MMM d, yyyy",
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-4 py-3 text-right">
                                                            <div className="flex gap-2 justify-end">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-8 h-8"
                                                                    onClick={() =>
                                                                        handleEditSubscriber(
                                                                            subscriber,
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                    <span className="sr-only">
                                                                        Edit
                                                                    </span>
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-8 h-8 text-destructive"
                                                                    onClick={() =>
                                                                        handleDeleteSubscriber(
                                                                            subscriber,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    <span className="sr-only">
                                                                        Delete
                                                                    </span>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>

                                    {subscribers.meta.last_page > 1 && (
                                        <div className="flex justify-between items-center px-6 py-4 border-t">
                                            <div className="mr-auto text-sm whitespace-nowrap text-muted-foreground">
                                                Showing{" "}
                                                <span className="font-medium">
                                                    {subscribers.meta.from}
                                                </span>{" "}
                                                to{" "}
                                                <span className="font-medium">
                                                    {subscribers.meta.to}
                                                </span>{" "}
                                                of{" "}
                                                <span className="font-medium">
                                                    {subscribers.meta.total}
                                                </span>{" "}
                                                subscribers
                                            </div>

                                            <PaginationWrapper
                                                currentPage={
                                                    subscribers.meta
                                                        .current_page
                                                }
                                                lastPage={
                                                    subscribers.meta.last_page
                                                }
                                                links={subscribers.meta.links}
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<MailCheck className="w-10 h-10" />}
                                    title="No subscribers found"
                                    description={
                                        searchQuery || filters.status !== "all"
                                            ? "No subscribers match your search criteria. Try different keywords or filters."
                                            : "Get started by adding your first subscriber to your mailing list."
                                    }
                                    action={
                                        searchQuery ||
                                        filters.status !== "all" ? (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    applyFilters({
                                                        search: "",
                                                        status: "all",
                                                    });
                                                }}
                                            >
                                                Clear Filters
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    setFormDialogOpen(true)
                                                }
                                            >
                                                <Plus className="mr-2 w-4 h-4" />
                                                Add Subscriber
                                            </Button>
                                        )
                                    }
                                    className="py-16"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AuthLayout>

            {/* Subscriber Form Dialog */}
            <SubscriberFormDialog
                isOpen={formDialogOpen}
                onOpenChange={setFormDialogOpen}
                subscriber={editingSubscriber}
                onSuccess={() => {
                    setEditingSubscriber(null);
                }}
            />

            {/* Delete Subscriber Dialog */}
            <DeleteSubscriberDialog
                isOpen={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                subscriber={deletingSubscriber}
                onSuccess={() => {
                    setDeletingSubscriber(null);
                }}
            />
        </>
    );
};

export default Index;
