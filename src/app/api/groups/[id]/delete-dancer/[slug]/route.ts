import { db } from "@/app/db";
import { dancers } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const dancerId = parseInt(slug);
    if (isNaN(dancerId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        await db.delete(dancers).where(eq(dancers.id, dancerId));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to delete dancer. Error: ${error}` },
            { status: 500 }
        );
    }
}
