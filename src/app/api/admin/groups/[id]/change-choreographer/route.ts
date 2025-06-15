import { db } from "@/app/db";
import { groups } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const groupId = Number(context.params.id);
    const { choreographer_id } = await req.json();

    await db
        .update(groups)
        .set({ choreographer_id })
        .where(eq(groups.id, groupId));

    return NextResponse.json({ success: true });
}
