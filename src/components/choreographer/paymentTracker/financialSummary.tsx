import type { FinancialSummary } from "./types";

interface FinancialSummaryProps {
    summary: FinancialSummary;
}

export function FinancialSummaryComponent({ summary }: FinancialSummaryProps) {
    const { totalRevenue, managersShare, choreographerShare } = summary;

    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Обобщен отчет</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">
                        {totalRevenue}lv
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Обща печалба
                    </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border">
                    <div className="text-2xl font-bold text-orange-600">
                        {managersShare}lv
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Такси (40%)
                    </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">
                        {choreographerShare}lv
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Хореограф (60%)
                    </div>
                </div>
            </div>
        </div>
    );
}
