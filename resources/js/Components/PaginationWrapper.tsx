import * as React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./ui/pagination";

interface PaginationWrapperProps {
    currentPage: number;
    lastPage: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    onPageChange: (page: number) => void;
}

export function PaginationWrapper({
    currentPage,
    lastPage,
    links,
    onPageChange,
}: PaginationWrapperProps) {
    return (
        <Pagination className="justify-end">
            <PaginationContent>
                {links.map((link, index) => {
                    if (link.label.includes("Previous")) {
                        return (
                            <PaginationItem key={index}>
                                <PaginationPrevious
                                    href={link.url || "#"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (link.url) {
                                            onPageChange(currentPage - 1);
                                        }
                                    }}
                                />
                            </PaginationItem>
                        );
                    }

                    if (link.label.includes("Next")) {
                        return (
                            <PaginationItem key={index}>
                                <PaginationNext
                                    href={link.url || "#"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (link.url) {
                                            onPageChange(currentPage + 1);
                                        }
                                    }}
                                />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href={link.url || "#"}
                                isActive={link.active}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (link.url) {
                                        onPageChange(parseInt(link.label));
                                    }
                                }}
                            >
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
}
