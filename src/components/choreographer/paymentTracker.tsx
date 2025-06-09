"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Banknote,
    Calendar,
    CreditCard,
    Receipt,
    UserCheck,
} from "lucide-react";
import { useState } from "react";

type PaymentType =
    | "cash"
    | "card"
    | "multisport"
    | "coolsport"
    | "monthly"
    | "presence"
    | null;

interface Dancer {
    id: number;
    name: string;
    created_at: Date;
}

interface DancerPayment {
    dancerId: number;
    paymentType: PaymentType;
}

interface PaymentTrackerProps {
    dancers: Dancer[];
    groupName: string;
}

const PAYMENT_RATES = {
    cash: 10,
    card: 10,
    multisport: 8,
    coolsport: 8,
    monthly: 70,
    presence: 0,
};

const PAYMENT_LABELS = {
    cash: "Cash",
    card: "Card",
    multisport: "Multisport Card",
    coolsport: "Coolsport Card",
    monthly: "Monthly Payment",
    presence: "Present (No Payment)",
};

export default function PaymentTracker({
    dancers,
    groupName,
}: PaymentTrackerProps) {
    const [payments, setPayments] = useState<DancerPayment[]>([]);
    const [rehearsalDate, setRehearsalDate] = useState("");
    const [rehearsalStartTime, setRehearsalStartTime] = useState("");
    const [rehearsalEndTime, setRehearsalEndTime] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handlePaymentClick = (dancerId: number, paymentType: PaymentType) => {
        setPayments((prev) => {
            const existing = prev.find((p) => p.dancerId === dancerId);
            if (existing) {
                if (existing.paymentType === paymentType) {
                    // Remove payment if clicking the same button
                    return prev.filter((p) => p.dancerId !== dancerId);
                } else {
                    // Update payment type
                    return prev.map((p) =>
                        p.dancerId === dancerId ? { ...p, paymentType } : p
                    );
                }
            } else {
                // Add new payment
                return [...prev, { dancerId, paymentType }];
            }
        });
    };

    const getButtonVariant = (dancerId: number, paymentType: PaymentType) => {
        const payment = payments.find((p) => p.dancerId === dancerId);
        return payment?.paymentType === paymentType ? "default" : "outline";
    };

    const calculateFinancials = () => {
        const totalRevenue = payments.reduce((sum, payment) => {
            if (payment.paymentType) {
                return sum + PAYMENT_RATES[payment.paymentType];
            }
            return sum;
        }, 0);

        const managersShare = Math.round(totalRevenue * 0.4 * 100) / 100;
        const choreographerShare = Math.round(totalRevenue * 0.6 * 100) / 100;

        return { totalRevenue, managersShare, choreographerShare };
    };

    const getPresentDancers = () => {
        return payments
            .map((payment) => {
                const dancer = dancers.find((d) => d.id === payment.dancerId);
                return {
                    ...dancer,
                    paymentType: payment.paymentType,
                };
            })
            .filter(Boolean);
    };

    const getAbsentDancers = () => {
        const presentIds = payments.map((p) => p.dancerId);
        return dancers.filter((d) => !presentIds.includes(d.id));
    };

    const { totalRevenue, managersShare, choreographerShare } =
        calculateFinancials();
    const presentDancers = getPresentDancers();
    const absentDancers = getAbsentDancers();

    return (
        <>
            {dancers.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Dancers in Group</CardTitle>
                        <CardDescription>
                            Click payment buttons to track attendance and
                            payments
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Date and Time Selection */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                                <Label htmlFor="rehearsal-date">
                                    Rehearsal Date
                                </Label>
                                <Input
                                    id="rehearsal-date"
                                    type="date"
                                    value={rehearsalDate}
                                    onChange={(e) =>
                                        setRehearsalDate(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <Label htmlFor="rehearsal-time">
                                    Rehearsal Time
                                </Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="rehearsal-start-time"
                                        type="time"
                                        placeholder="--:--"
                                        value={rehearsalStartTime}
                                        onChange={(e) =>
                                            setRehearsalStartTime(
                                                e.target.value
                                            )
                                        }
                                        min="00:00"
                                        max="23:59"
                                    />
                                    <span>to</span>
                                    <Input
                                        id="rehearsal-end-time"
                                        type="time"
                                        placeholder="--:--"
                                        value={rehearsalEndTime}
                                        onChange={(e) =>
                                            setRehearsalEndTime(e.target.value)
                                        }
                                        min="00:00"
                                        max="23:59"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Added At</TableHead>
                                        <TableHead className="text-center">
                                            Cash/Card (10lv)
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Sport Cards (8lv)
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Monthly/Presence
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dancers.map((d) => (
                                        <TableRow key={d.id}>
                                            <TableCell>{d.id}</TableCell>
                                            <TableCell>{d.name}</TableCell>
                                            <TableCell>
                                                {new Date(
                                                    d.created_at
                                                ).toLocaleString()}
                                            </TableCell>

                                            {/* Group 1: Cash & Card Payments */}
                                            <TableCell>
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant={getButtonVariant(
                                                            d.id,
                                                            "cash"
                                                        )}
                                                        className="h-8 w-8 p-0"
                                                        onClick={() =>
                                                            handlePaymentClick(
                                                                d.id,
                                                                "cash"
                                                            )
                                                        }
                                                    >
                                                        <Banknote className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Cash Payment
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={getButtonVariant(
                                                            d.id,
                                                            "card"
                                                        )}
                                                        className="h-8 w-8 p-0"
                                                        onClick={() =>
                                                            handlePaymentClick(
                                                                d.id,
                                                                "card"
                                                            )
                                                        }
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Card Payment
                                                        </span>
                                                    </Button>
                                                </div>
                                            </TableCell>

                                            {/* Group 2: Sport Cards */}
                                            <TableCell>
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant={getButtonVariant(
                                                            d.id,
                                                            "multisport"
                                                        )}
                                                        className="h-8 w-8 p-0"
                                                        onClick={() =>
                                                            handlePaymentClick(
                                                                d.id,
                                                                "multisport"
                                                            )
                                                        }
                                                    >
                                                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm"></div>
                                                        <span className="sr-only">
                                                            Multisport Card
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={getButtonVariant(
                                                            d.id,
                                                            "coolsport"
                                                        )}
                                                        className="h-8 w-8 p-0"
                                                        onClick={() =>
                                                            handlePaymentClick(
                                                                d.id,
                                                                "coolsport"
                                                            )
                                                        }
                                                    >
                                                        <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-sm"></div>
                                                        <span className="sr-only">
                                                            Coolsport Card
                                                        </span>
                                                    </Button>
                                                </div>
                                            </TableCell>

                                            {/* Group 3: Monthly & Attendance */}
                                            <TableCell>
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant={getButtonVariant(
                                                            d.id,
                                                            "monthly"
                                                        )}
                                                        className="h-8 w-8 p-0"
                                                        onClick={() =>
                                                            handlePaymentClick(
                                                                d.id,
                                                                "monthly"
                                                            )
                                                        }
                                                    >
                                                        <Calendar className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Monthly Payment
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={getButtonVariant(
                                                            d.id,
                                                            "presence"
                                                        )}
                                                        className="h-8 w-8 p-0"
                                                        onClick={() =>
                                                            handlePaymentClick(
                                                                d.id,
                                                                "presence"
                                                            )
                                                        }
                                                    >
                                                        <UserCheck className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Mark Presence
                                                        </span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Summary Button */}
                        <div className="flex justify-end pt-4">
                            <Dialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button className="gap-2">
                                        <Receipt className="h-4 w-4" />
                                        Generate Summary (
                                        {presentDancers.length} present)
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Rehearsal Summary - {groupName}
                                        </DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-6">
                                        {/* Rehearsal Info */}
                                        {(rehearsalDate ||
                                            rehearsalStartTime ||
                                            rehearsalEndTime) && (
                                            <div className="p-4 bg-muted/50 rounded-lg">
                                                <h3 className="font-semibold mb-2">
                                                    Rehearsal Details
                                                </h3>
                                                {rehearsalDate && (
                                                    <p>
                                                        Date:{" "}
                                                        {new Date(
                                                            rehearsalDate
                                                        ).toLocaleDateString()}
                                                    </p>
                                                )}
                                                {rehearsalStartTime &&
                                                    rehearsalEndTime && (
                                                        <p>
                                                            Time:{" "}
                                                            {rehearsalStartTime}{" "}
                                                            - {rehearsalEndTime}
                                                        </p>
                                                    )}
                                            </div>
                                        )}

                                        {/* Present Dancers */}
                                        <div>
                                            <h3 className="font-semibold mb-3">
                                                Present Dancers (
                                                {presentDancers.length})
                                            </h3>
                                            <div className="space-y-2">
                                                {presentDancers.map(
                                                    (dancer) => (
                                                        <div
                                                            key={dancer.id}
                                                            className="flex justify-between items-center p-2 bg-green-50 rounded"
                                                        >
                                                            <span>
                                                                {dancer.name}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-muted-foreground">
                                                                    {dancer.paymentType
                                                                        ? PAYMENT_LABELS[
                                                                              dancer
                                                                                  .paymentType
                                                                          ]
                                                                        : "No payment"}
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {dancer.paymentType
                                                                        ? `${
                                                                              PAYMENT_RATES[
                                                                                  dancer
                                                                                      .paymentType
                                                                              ]
                                                                          }lv`
                                                                        : "0lv"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Absent Dancers */}
                                        {absentDancers.length > 0 && (
                                            <div>
                                                <h3 className="font-semibold mb-3">
                                                    Absent Dancers (
                                                    {absentDancers.length})
                                                </h3>
                                                <div className="space-y-2">
                                                    {absentDancers.map(
                                                        (dancer) => (
                                                            <div
                                                                key={dancer.id}
                                                                className="flex justify-between items-center p-2 bg-red-50 rounded"
                                                            >
                                                                <span>
                                                                    {
                                                                        dancer.name
                                                                    }
                                                                </span>
                                                                <span className="text-sm text-muted-foreground">
                                                                    Absent
                                                                </span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <Separator />

                                        {/* Financial Summary */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold">
                                                Financial Summary
                                            </h3>

                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div className="p-4 bg-blue-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {totalRevenue}lv
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Total Revenue
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-orange-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-orange-600">
                                                        {managersShare}lv
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Managers (40%)
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-green-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {choreographerShare}lv
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Choreographer (60%)
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="py-8">
                        <p className="text-center text-muted-foreground">
                            No dancers yet in this group.
                        </p>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
