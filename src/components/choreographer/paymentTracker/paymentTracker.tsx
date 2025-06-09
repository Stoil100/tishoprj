"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useCallback, useMemo, useState } from "react";
import { DancerTable } from "./dancerTable";
import { RehearsalInfoComponent } from "./rehearsalInfo";
import { SummaryDialog } from "./summaryDialog";
import {
    type DancerPayment,
    type PaymentTrackerProps,
    type PaymentType,
    type RehearsalInfo,
    Dancer,
    PAYMENT_RATES,
} from "./types";

interface DancerWithPayment extends Dancer {
    paymentType: PaymentType;
}

export default function PaymentTracker({
    dancers,
    groupName,
    paramsId,
    choreographerId,
    choreographerName,
}: PaymentTrackerProps) {
    const [payments, setPayments] = useState<DancerPayment[]>([]);
    const [rehearsalInfo, setRehearsalInfo] = useState<RehearsalInfo>({
        date: "",
        startTime: "",
        endTime: "",
        choreographer_id: choreographerId || "",
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handlePaymentClick = useCallback(
        (dancerId: number, paymentType: PaymentType) => {
            setPayments((prev) => {
                const existing = prev.find((p) => p.dancerId === dancerId);
                if (existing) {
                    if (existing.paymentType === paymentType) {
                        // Премахни плащането, ако е избрано същото отново
                        return prev.filter((p) => p.dancerId !== dancerId);
                    } else {
                        // Обнови типа на плащане
                        return prev.map((p) =>
                            p.dancerId === dancerId ? { ...p, paymentType } : p
                        );
                    }
                } else {
                    // Добави ново плащане
                    return [...prev, { dancerId, paymentType }];
                }
            });
        },
        []
    );

    const financialSummary = useMemo(() => {
        const totalRevenue = payments.reduce((sum, payment) => {
            if (payment.paymentType) {
                return sum + PAYMENT_RATES[payment.paymentType];
            }
            return sum;
        }, 0);

        const managersShare = Math.round(totalRevenue * 0.4 * 100) / 100;
        const choreographerShare = Math.round(totalRevenue * 0.6 * 100) / 100;

        return { totalRevenue, managersShare, choreographerShare };
    }, [payments]);

    const presentDancers = useMemo(() => {
        return payments
            .map((payment) => {
                const dancer = dancers.find((d) => d.id === payment.dancerId);
                return dancer
                    ? {
                          ...dancer,
                          paymentType: payment.paymentType,
                      }
                    : null;
            })
            .filter((dancer): dancer is DancerWithPayment => dancer !== null);
    }, [payments, dancers]);

    const absentDancers = useMemo(() => {
        const presentIds = payments.map((p) => p.dancerId);
        return dancers.filter((d) => !presentIds.includes(d.id));
    }, [payments, dancers]);

    if (dancers.length === 0) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">
                        Все още няма танцьори в тази група.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Танцьори в групата</CardTitle>
                <CardDescription>
                    Натиснете върху бутоните за плащане, за да отбележите
                    присъствие и вид плащане
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <RehearsalInfoComponent
                    rehearsalInfo={rehearsalInfo}
                    onRehearsalInfoChange={setRehearsalInfo}
                />

                <DancerTable
                    dancers={dancers}
                    payments={payments}
                    onPaymentClick={handlePaymentClick}
                    paramsId={paramsId}
                />

                <div className="flex justify-end pt-4">
                    <SummaryDialog
                        paramsId={paramsId}
                        isOpen={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        groupName={groupName}
                        rehearsalInfo={rehearsalInfo}
                        presentDancers={presentDancers!}
                        absentDancers={absentDancers}
                        financialSummary={financialSummary}
                        choreographerName={choreographerName}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
