import { db } from "@/app/db";
import { rehearsal_attendance, rehearsals, users } from "@/app/db/schema";
import { eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const PAYMENT_RATES: Record<string, number> = {
    cash: 10,
    card: 10,
    multisport: 8,
    coolfit: 8,
    monthly: 70,
    presence: 0,
};

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const groupId = Number(params.id);

    const rehearsalList = await db
        .select({
            id: rehearsals.id,
            date: rehearsals.date,
            start_time: rehearsals.start_time,
            end_time: rehearsals.end_time,
            choreographer_id: rehearsals.choreographer_id,
            choreographer_name: users.username,
        })
        .from(rehearsals)
        .innerJoin(users, eq(rehearsals.choreographer_id, users.id))
        .where(eq(rehearsals.group_id, groupId));

    const attendanceList = await db
        .select({
            rehearsal_id: rehearsal_attendance.rehearsal_id,
            payment_type: rehearsal_attendance.payment_type,
        })
        .from(rehearsal_attendance)
        .where(
            inArray(
                rehearsal_attendance.rehearsal_id,
                rehearsalList.map((r) => r.id)
            )
        );

    const result = rehearsalList.map((r) => {
        const relevant = attendanceList.filter((a) => a.rehearsal_id === r.id);
        const payments: Record<string, number> = {};

        let total = 0;
        for (const att of relevant) {
            const type = att.payment_type || "presence";
            payments[type] = (payments[type] || 0) + 1;
            total += PAYMENT_RATES[type] ?? 0;
        }

        return {
            id: r.id,
            date: r.date,
            start_time: r.start_time,
            end_time: r.end_time,
            choreographer_id: r.choreographer_id,
            choreographer_name: r.choreographer_name,
            attendanceCount: relevant.length,
            payments,
            revenue: total,
        };
    });

    return NextResponse.json(result);
}
