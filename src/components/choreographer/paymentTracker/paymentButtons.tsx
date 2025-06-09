import { Button } from "@/components/ui/button";
import { Banknote, Calendar, CreditCard, UserCheck } from "lucide-react";
import { PaymentType } from "./types";

interface PaymentButtonsProps {
    dancerId: number;
    onPaymentClick: (dancerId: number, paymentType: PaymentType) => void;
    getButtonVariant: (
        dancerId: number,
        paymentType: PaymentType
    ) => "default" | "outline";
    group: "cash-card" | "sport-cards" | "monthly-presence";
}

export function PaymentButtons({
    dancerId,
    onPaymentClick,
    getButtonVariant,
    group,
}: PaymentButtonsProps) {
    if (group === "cash-card") {
        return (
            <div className="flex gap-2 justify-center">
                <Button
                    size="sm"
                    variant={getButtonVariant(dancerId, "cash")}
                    className="h-8 w-8 p-0"
                    onClick={() => onPaymentClick(dancerId, "cash")}
                    aria-label="Плащане в брой"
                >
                    <Banknote className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant={getButtonVariant(dancerId, "card")}
                    className="h-8 w-8 p-0"
                    onClick={() => onPaymentClick(dancerId, "card")}
                    aria-label="Плащане с карта"
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
                >
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm"></div>
                </Button>
                <Button
                    size="sm"
                    variant={getButtonVariant(dancerId, "coolfit")}
                    className="h-8 w-8 p-0"
                    onClick={() => onPaymentClick(dancerId, "coolfit")}
                    aria-label="Карта Coolfit"
                >
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-sm"></div>
                </Button>
            </div>
        );
    }

    if (group === "monthly-presence") {
        return (
            <div className="flex gap-2 justify-center">
                <Button
                    size="sm"
                    variant={getButtonVariant(dancerId, "monthly")}
                    className="h-8 w-8 p-0"
                    onClick={() => onPaymentClick(dancerId, "monthly")}
                    aria-label="Месечно плащане"
                >
                    <Calendar className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant={getButtonVariant(dancerId, "presence")}
                    className="h-8 w-8 p-0"
                    onClick={() => onPaymentClick(dancerId, "presence")}
                    aria-label="Отбележи присъствие"
                >
                    <UserCheck className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return null;
}
