import { db } from "@/app/db";
import { dancers, rehearsal_attendance, rehearsals } from "@/app/db/schema";
import { PaymentType } from "@/components/choreographer/paymentTracker/types";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
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
            presentDancers: {
                dancerId: number;
                paymentType: PaymentType;
            }[];
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

        // 2️⃣ Handle attendance & payments
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
                        {
                            success: false,
                            code: "DANCER_NOT_FOUND",
                            message: "Танцьорът не беше намерен.",
                        },
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
                                success: false,
                                code: "MONTHLY_ALREADY_ACTIVE",
                                message:
                                    "Месечният абонамент за този танцьор все още е активен.",
                            },
                            { status: 400 },
                        );
                    }
                }

                const rehearsalStart = new Date(
                    `${rehearsalInfo.date}T${rehearsalInfo.startTime}:00+02:00`,
                );

                await db
                    .update(dancers)
                    .set({ monthly_paid_at: rehearsalStart })
                    .where(eq(dancers.id, d.dancerId));
            }

            await db.insert(rehearsal_attendance).values({
                rehearsal_id: session.id,
                dancer_id: d.dancerId,
                payment_type: d.paymentType,
            });
        }

        return NextResponse.json(
            {
                success: true,
                code: "REHEARSAL_SAVED",
                message: "Репетицията беше успешно запазена.",
            },
            { status: 201 },
        );
    } catch (err) {
        console.error("Save rehearsal error:", err);

        return NextResponse.json(
            {
                success: false,
                code: "UNKNOWN_ERROR",
                message: "Грешка при запазването на репетицията.",
            },
            { status: 500 },
        );
    }
}
