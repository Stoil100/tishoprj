import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { PaymentButtons } from "./paymentButtons";
import type { Dancer, DancerPayment, PaymentType } from "./types";

interface DancerTableProps {
    dancers: Dancer[];
    payments: DancerPayment[];
    onPaymentClick: (dancerId: number, paymentType: PaymentType) => void;
    paramsId: number;
}

export function DancerTable({
    dancers,
    payments,
    onPaymentClick,
    paramsId,
}: DancerTableProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const getButtonVariant = (dancerId: number, paymentType: PaymentType) => {
        const payment = payments.find((p) => p.dancerId === dancerId);
        return payment?.paymentType === paymentType ? "default" : "outline";
    };

    const handleDelete = async (id: number) => {
        startTransition(async () => {
            await fetch(`/api/groups/${paramsId}/delete-dancer}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });
            router.refresh(); // Optionally use SWR/mutate instead for better UX
        });
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Име</TableHead>
                        <TableHead>Добавен на</TableHead>
                        <TableHead className="text-center">
                            В брой/С карта (10лв)
                        </TableHead>
                        <TableHead className="text-center">
                            Спортни карти (8лв)
                        </TableHead>
                        <TableHead className="text-center">
                            Месечно/Присъствие
                        </TableHead>
                        <TableHead className="text-center">Премахни</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dancers.map((dancer) => (
                        <TableRow key={dancer.id}>
                            <TableCell className="font-medium">
                                {dancer.name}
                            </TableCell>
                            <TableCell>
                                {new Date(dancer.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>
                                <PaymentButtons
                                    dancerId={dancer.id}
                                    onPaymentClick={onPaymentClick}
                                    getButtonVariant={getButtonVariant}
                                    group="cash-card"
                                />
                            </TableCell>
                            <TableCell>
                                <PaymentButtons
                                    dancerId={dancer.id}
                                    onPaymentClick={onPaymentClick}
                                    getButtonVariant={getButtonVariant}
                                    group="sport-cards"
                                />
                            </TableCell>
                            <TableCell>
                                <PaymentButtons
                                    dancerId={dancer.id}
                                    onPaymentClick={onPaymentClick}
                                    getButtonVariant={getButtonVariant}
                                    group="monthly-presence"
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDelete(dancer.id)}
                                    disabled={isPending}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
