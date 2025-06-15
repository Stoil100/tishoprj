// app/api/groups/[id]/dancers/route.ts
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/db";
import { dancers, groups } from "@/app/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

const bodySchema = z.object({
    name: z.string().min(1),
});

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId, sessionClaims } = getAuth(req);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
     const { id } = await params;
    const groupId = Number(id);
    const [group] = await db
        .select({ choreographer_id: groups.choreographer_id })
        .from(groups)
        .where(eq(groups.id, groupId));

    if (!group) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const role = sessionClaims.metadata.role;

    if (
        role !== "admin" &&
        !(role === "choreographer" && userId === group.choreographer_id)
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const json = await req.json();
    const { name } = bodySchema.parse(json);

    const [created] = await db
        .insert(dancers)
        .values({ name, group_id: groupId })
        .returning();

    return NextResponse.json(created, { status: 201 });
}
