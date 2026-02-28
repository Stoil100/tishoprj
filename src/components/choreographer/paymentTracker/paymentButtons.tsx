import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Banknote, Calendar, CreditCard, UserCheck } from "lucide-react";
import { PaymentType } from "./types";

export function getMonthlyStatus(monthlyPaidAt?: Date | null) {
    const now = new Date();
    const paidAt = monthlyPaidAt ?? null;

    let validUntil: Date | null = null;
    let isValid = false;

    if (paidAt) {
        validUntil = new Date(paidAt);
        validUntil.setDate(validUntil.getDate() + 30);
        isValid = validUntil.getTime() >= now.getTime();
    }

    const fmt = (d: Date) =>
        new Intl.DateTimeFormat("bg-BG", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(d);

    let tooltip = "Няма активен месечен абонамент.";

    if (paidAt && validUntil) {
        tooltip = isValid
            ? `Платено на: ${fmt(paidAt)} • Валидно до: ${fmt(validUntil)}`
            : `Платено на: ${fmt(paidAt)} • Изтекло на: ${fmt(validUntil)}`;
    }

    return { isValid, paidAt, validUntil, tooltip };
}

interface PaymentButtonsProps {
    dancerId: number;
    onPaymentClick: (dancerId: number, paymentType: PaymentType) => void;
    getButtonVariant: (
        dancerId: number,
        paymentType: PaymentType,
    ) => "default" | "outline";
    group: "cash-card" | "sport-cards" | "monthly-presence";

    // NEW (monthly window):
    monthlyPaidAt?: Date | null;
}

export function PaymentButtons({
    dancerId,
    onPaymentClick,
    getButtonVariant,
    group,
    monthlyPaidAt,
}: PaymentButtonsProps) {
    const monthly = getMonthlyStatus(monthlyPaidAt);
    const onlyPresenceAllowed = monthly.isValid;

    if (group === "cash-card") {
        return (
            <div className="flex gap-2 justify-center">
                <Button
                    size="sm"
                    variant={getButtonVariant(dancerId, "cash")}
                    className="h-8 w-8 p-0"
                    onClick={() => onPaymentClick(dancerId, "cash")}
                    aria-label="Плащане в брой"
                    disabled={onlyPresenceAllowed}
                    title={onlyPresenceAllowed ? monthly.tooltip : undefined}
                >
                    <Banknote className="h-4 w-4" />
                </Button>

                <Button
                    size="sm"
                    variant={getButtonVariant(dancerId, "card")}
                    className="h-8 w-8 p-0"
                    onClick={() => onPaymentClick(dancerId, "card")}
                    aria-label="Плащане с карта"
                    disabled={onlyPresenceAllowed}
                    title={onlyPresenceAllowed ? monthly.tooltip : undefined}
                >
                    <CreditCard className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    if (group === "sport-cards") {
        return (
            <div className="flex gap-2 justify-center">
                <Button
                    size="sm"
                    variant={getButtonVariant(dancerId, "multisport")}
                    className="h-8 w-8 p-0"
                    onClick={() => onPaymentClick(dancerId, "multisport")}
                    aria-label="Карта Multisport"
                    disabled={onlyPresenceAllowed}
                    title={onlyPresenceAllowed ? monthly.tooltip : undefined}
                >
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm" />
                </Button>

                <Button
                    size="sm"
                    variant={getButtonVariant(dancerId, "coolfit")}
                    className="h-8 w-8 p-0"
                    onClick={() => onPaymentClick(dancerId, "coolfit")}
                    aria-label="Карта Coolfit"
                    disabled={onlyPresenceAllowed}
                    title={onlyPresenceAllowed ? monthly.tooltip : undefined}
                >
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-sm" />
                </Button>
            </div>
        );
    }

    if (group === "monthly-presence") {
        const monthlyDisabled = onlyPresenceAllowed; // prevent paying again while active
        const presenceDisabled = !onlyPresenceAllowed; // only allowed when monthly valid

        return (
            <div className="flex gap-2 justify-center">
                <Button
                    size="sm"
                    variant={getButtonVariant(dancerId, "monthly")}
                    className="h-8 w-8 p-0"
                    onClick={() => onPaymentClick(dancerId, "monthly")}
                    aria-label="Месечно плащане"
                    disabled={monthlyDisabled}
                    title={
                        monthlyDisabled
                            ? monthly.tooltip
                            : "Отбележи месечно плащане"
                    }
                >
                    <Calendar className="h-4 w-4" />
                </Button>

                <TooltipProvider delayDuration={150}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                {/* wrapper keeps tooltip working when disabled */}
                                <Button
                                    size="sm"
                                    variant={getButtonVariant(
                                        dancerId,
                                        "presence",
                                    )}
                                    className="h-8 w-8 p-0"
                                    onClick={() =>
                                        onPaymentClick(dancerId, "presence")
                                    }
                                    aria-label="Отбележи присъствие"
                                    disabled={presenceDisabled}
                                >
                                    <UserCheck className="h-4 w-4" />
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{monthly.tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );
    }

    return null;
}
