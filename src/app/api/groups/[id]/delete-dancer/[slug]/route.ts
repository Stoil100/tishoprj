import { db } from "@/app/db";
import { dancers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
    { params }: { params: { slug: string } }
) {
    const dancerId = parseInt(params.slug);
    if (isNaN(dancerId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        await db.delete(dancers).where(eq(dancers.id, dancerId));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete dancer" },
            { status: 500 }
        );
    }
}
