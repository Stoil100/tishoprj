import { db } from "@/app/db";
import { groups } from "@/app/db/schema";
import { formSchema as bodySchema } from "@/components/schemas/group";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const { name, choreographer_id, color } = bodySchema.parse(json);

        const [created] = await db
            .insert(groups)
            .values({ name, choreographer_id, color })
            .returning();

        return NextResponse.json(
            {
                success: true,
                message: "Групата беше създадена успешно.",
                data: created,
            },
            { status: 201 },
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Неуспешно създаване на група.",
            },
            { status: 400 },
        );
    }
}
