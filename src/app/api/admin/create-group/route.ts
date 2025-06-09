// app/api/groups/route.ts
import { db } from "@/app/db";
import { groups } from "@/app/db/schema";
import { formSchema as bodySchema } from "@/components/schemas/group";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const json = await req.json();
    const { name, choreographer_id } = bodySchema.parse(json);

    const [created] = await db
        .insert(groups)
        .values({ name, choreographer_id })
        .returning();

    return NextResponse.json(created, { status: 201 });
}
