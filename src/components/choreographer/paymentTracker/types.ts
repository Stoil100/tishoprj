export type PaymentType =
    | "cash"
    | "card"
    | "multisport"
    | "coolfit"
    | "monthly"
    | "presence"
    | null;

export interface Dancer {
    id: number;
    name: string;
    created_at: Date;
    monthly_paid_at?: Date | null;
}

export interface DancerPayment {
    dancerId: number;
    paymentType: PaymentType;
}

export interface PaymentTrackerProps {
    dancers: Dancer[];
    groupName: string;
    paramsId: number;
    choreographerId: string;
    choreographerName: string;
}

export interface RehearsalInfo {
    date: string;
    startTime: string;
    endTime: string;
    choreographer_id: string;
}

export interface FinancialSummary {
    totalRevenue: number;
    managersShare: number;
    choreographerShare: number;
}

export const PAYMENT_RATES: Record<NonNullable<PaymentType>, number> = {
    cash: 10,
    card: 10,
    multisport: 8,
    coolfit: 8,
    monthly: 70,
    presence: 0,
};

export const PAYMENT_LABELS: Record<NonNullable<PaymentType>, string> = {
    cash: "В Брой",
    card: "С Карта",
    multisport: "Multisport Карта",
    coolfit: "Coolfit Карта",
    monthly: "Месечно плащане",
    presence: "Присъствие (Без плащане)",
};

export interface RehearsalSession {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
}

export interface AttendanceRecord {
    rehearsalId: number;
    dancerId: number;
    paymentType: PaymentType | null;
}

export interface RehearsalHistoryItem {
    session: RehearsalSession;
    attendees: { dancerId: number; paymentType: PaymentType | null }[];
}
