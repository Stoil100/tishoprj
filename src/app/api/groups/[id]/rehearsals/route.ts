// src/app/api/rehearsals/route.ts
import { db } from "@/app/db";
import { rehearsal_attendance, rehearsals } from "@/app/db/schema";
import { PaymentType } from "@/components/choreographer/paymentTracker/types";
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

    // 1) insert session
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

    // 2) insert attendance rows
    await Promise.all(
        presentDancers.map((d) =>
            db.insert(rehearsal_attendance).values({
                rehearsal_id: session.id,
                dancer_id: d.dancerId,
                payment_type: d.paymentType,
            })
        )
    );

    return NextResponse.json({ success: true });
}
