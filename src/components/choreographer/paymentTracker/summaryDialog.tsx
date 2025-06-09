"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FinancialSummaryComponent } from "./financialSummary";
import {
    type Dancer,
    type FinancialSummary,
    PAYMENT_LABELS,
    PAYMENT_RATES,
    type PaymentType,
    type RehearsalInfo,
} from "./types";

interface DancerWithPayment extends Dancer {
    paymentType: PaymentType;
}

interface SummaryDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    groupName: string;
    rehearsalInfo: RehearsalInfo;
    presentDancers: DancerWithPayment[];
    absentDancers: Dancer[];
    financialSummary: FinancialSummary;
    paramsId: number;
    choreographerName: string;
}

export function SummaryDialog({
    isOpen,
    onOpenChange,
    groupName,
    rehearsalInfo,
    presentDancers,
    absentDancers,
    financialSummary,
    paramsId,
    choreographerName,
}: SummaryDialogProps) {
    const hasRehearsalInfo =
        rehearsalInfo.date &&
        rehearsalInfo.startTime &&
        rehearsalInfo.endTime &&
        rehearsalInfo.choreographer_id;
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        if (!hasRehearsalInfo) return;

        setIsSaving(true);
        try {
            const res = await fetch(`/api/groups/${paramsId}/rehearsals`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    paramsId,
                    rehearsalInfo,
                    presentDancers: presentDancers.map((d) => ({
                        dancerId: d.id,
                        paymentType: d.paymentType,
                    })),
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                console.error("Save error:", error);
                alert("Грешка при запазването на репетицията.");
            } else {
                // close dialog & refresh data
                onOpenChange(false);
                router.refresh();
            }
        } catch (e) {
            console.error(e);
            alert("Грешка при изпращането на заявката.");
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2" disabled={!hasRehearsalInfo}>
                    <Receipt className="h-4 w-4" />
                    Създай отчет ({presentDancers.length} присъстващи)
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Обобщение на репетицията – {groupName}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Информация за репетицията */}
                    {hasRehearsalInfo && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h3 className="font-semibold mb-2">
                                Детайли за репетицията
                            </h3>
                            {rehearsalInfo.date && (
                                <p>
                                    Дата:{" "}
                                    {new Date(
                                        rehearsalInfo.date
                                    ).toLocaleDateString()}
                                </p>
                            )}
                            {rehearsalInfo.startTime &&
                                rehearsalInfo.endTime && (
                                    <p>
                                        Час: {rehearsalInfo.startTime} –{" "}
                                        {rehearsalInfo.endTime}
                                    </p>
                                )}
                            {rehearsalInfo.choreographer_id && (
                                <p>Хореограф: {choreographerName}</p>
                            )}
                        </div>
                    )}

                    {/* Присъстващи танцьори */}
                    <div>
                        <h3 className="font-semibold mb-3">
                            Присъстващи танцьори ({presentDancers.length})
                        </h3>
                        <div className="space-y-2">
                            {presentDancers.map((dancer) => (
                                <div
                                    key={dancer.id}
                                    className="flex justify-between items-center p-3 bg-green-50 rounded-lg border"
                                >
                                    <span className="font-medium">
                                        {dancer.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {dancer.paymentType
                                                ? PAYMENT_LABELS[
                                                      dancer.paymentType
                                                  ]
                                                : "Без плащане"}
                                        </span>
                                        <span className="font-semibold">
                                            {dancer.paymentType
                                                ? `${
                                                      PAYMENT_RATES[
                                                          dancer.paymentType
                                                      ]
                                                  } лв.`
                                                : "0 лв."}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Отсъстващи танцьори */}
                    {absentDancers.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-3">
                                Отсъстващи танцьори ({absentDancers.length})
                            </h3>
                            <div className="space-y-2">
                                {absentDancers.map((dancer) => (
                                    <div
                                        key={dancer.id}
                                        className="flex justify-between items-center p-3 bg-red-50 rounded-lg border"
                                    >
                                        <span className="font-medium">
                                            {dancer.name}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            Отсъстващ
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Финансово обобщение */}
                    <FinancialSummaryComponent summary={financialSummary} />

                    <Button
                        className="w-full"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Запазвам..." : "Запази"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
