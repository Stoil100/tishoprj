"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CalendarClock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type PaymentType = string;

interface HistoryItem {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    choreographer_id: string;
    choreographer_name: string;
    attendanceCount: number;
    payments: Record<PaymentType, number>;
    revenue: number;
}

export function GroupHistoryDialog({ groupId }: { groupId: number }) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;

        const fetchHistory = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/admin/groups/${groupId}/history`);

                if (!res.ok) {
                    throw new Error(`Failed to fetch history: ${res.status}`);
                }

                const data = await res.json();
                setHistory(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load history"
                );
                console.error("Error fetching group history:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [open, groupId]);

    // Format currency with Bulgarian Lev symbol
    const formatCurrency = (amount: number) => {
        return `${amount.toFixed(2)} лв.`;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                    title="View rehearsal history"
                >
                    <CalendarClock className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Rehearsal History</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[500px] pr-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                                Loading history...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
                            <p className="text-sm font-medium text-destructive">
                                {error}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    setOpen(true); // This will trigger the useEffect to fetch again
                                }}
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                                No rehearsal history available
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {history.map((item) => {
                                const tax = item.revenue * 0.4;
                                const choreographerShare = item.revenue * 0.6;

                                return (
                                    <li
                                        key={item.id}
                                        className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">
                                                {new Date(
                                                    item.date
                                                ).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </h3>
                                            <Badge
                                                variant="outline"
                                                className="font-normal"
                                            >
                                                {item.start_time} -{" "}
                                                {item.end_time}
                                            </Badge>
                                        </div>

                                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">
                                                    Attendance
                                                </p>
                                                <p className="font-medium">
                                                    {item.attendanceCount}{" "}
                                                    participants
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground">
                                                    Payment Types
                                                </p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {Object.entries(
                                                        item.payments
                                                    ).map(([type, count]) => (
                                                        <Badge
                                                            key={type}
                                                            variant="secondary"
                                                            className="font-normal"
                                                        >
                                                            {type}: {count}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                Хореограф/Id
                                            </p>
                                            <p className="font-medium">
                                                {item.choreographer_name}/
                                                {item.choreographer_id}
                                            </p>
                                        </div>

                                        <Separator className="my-3" />

                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <div
                                                className={cn(
                                                    "rounded-md p-2 bg-green-50 dark:bg-green-950/30"
                                                )}
                                            >
                                                <p className="text-muted-foreground">
                                                    Total Revenue
                                                </p>
                                                <p className="font-semibold text-green-600 dark:text-green-400">
                                                    {formatCurrency(
                                                        item.revenue
                                                    )}
                                                </p>
                                            </div>

                                            <div
                                                className={cn(
                                                    "rounded-md p-2 bg-amber-50 dark:bg-amber-950/30"
                                                )}
                                            >
                                                <p className="text-muted-foreground">
                                                    Taxes (40%)
                                                </p>
                                                <p className="font-medium text-amber-600 dark:text-amber-400">
                                                    {formatCurrency(tax)}
                                                </p>
                                            </div>

                                            <div
                                                className={cn(
                                                    "rounded-md p-2 bg-blue-50 dark:bg-blue-950/30"
                                                )}
                                            >
                                                <p className="text-muted-foreground">
                                                    Choreographer
                                                </p>
                                                <p className="font-medium text-blue-600 dark:text-blue-400">
                                                    {formatCurrency(
                                                        choreographerShare
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
