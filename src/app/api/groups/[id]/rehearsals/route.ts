import { db } from "@/app/db";
import { dancers, rehearsal_attendance, rehearsals } from "@/app/db/schema";
import { PaymentType } from "@/components/choreographer/paymentTracker/types";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const {
        paramsId,
        rehearsalInfo,
        presentDancers,
    }: {
        paramsId: number;
        rehearsalInfo: {
            date: string;
            startTime: string;
            endTime: string;
            choreographer_id: string;
        };
        presentDancers: { dancerId: number; paymentType: PaymentType }[];
    } = await req.json();

    // 1️⃣ Create rehearsal
    const [session] = await db
        .insert(rehearsals)
        .values({
            group_id: paramsId,
            date: rehearsalInfo.date,
            start_time: rehearsalInfo.startTime,
            end_time: rehearsalInfo.endTime,
            choreographer_id: rehearsalInfo.choreographer_id,
        })
        .returning({ id: rehearsals.id });

    // 2️⃣ Handle payments safely
    for (const d of presentDancers) {
        if (d.paymentType === "monthly") {
            const dancer = await db
                .select()
                .from(dancers)
                .where(eq(dancers.id, d.dancerId))
                .limit(1);

            const existing = dancer[0];

            if (!existing) {
                return NextResponse.json(
                    { error: "Dancer not found" },
                    { status: 400 },
                );
            }

            if (existing.monthly_paid_at) {
                const lastPaid = new Date(existing.monthly_paid_at);
                const nextAllowed = new Date(lastPaid);
                nextAllowed.setDate(nextAllowed.getDate() + 30);

                if (new Date() < nextAllowed) {
                    return NextResponse.json(
                        {
                            error: "Monthly subscription still active for this dancer.",
                        },
                        { status: 400 },
                    );
                }
            }

            const rehearsalStartDateTime = new Date(
                `${rehearsalInfo.date}T${rehearsalInfo.startTime}:00+02:00`,
            );

            await db
                .update(dancers)
                .set({ monthly_paid_at: rehearsalStartDateTime })
                .where(eq(dancers.id, d.dancerId));
        }

        await db.insert(rehearsal_attendance).values({
            rehearsal_id: session.id,
            dancer_id: d.dancerId,
            payment_type: d.paymentType,
        });
    }

    return NextResponse.json({ success: true });
}
