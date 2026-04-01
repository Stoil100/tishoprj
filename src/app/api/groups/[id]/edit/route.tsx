import { db } from "@/app/db";
import { groups } from "@/app/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateGroupSchema = z.object({
    name: z
        .string()
        .min(1, "Име на групата е задължително")
        .min(2, "Име на групата трябва да е поне 2 символа"),
    color: z.enum(["gray", "blue", "green", "yellow", "red", "purple"]),
});

export async function PUT(
    request: Request,
    { params }: { params: { id: string } },
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json(
                { message: "Неоторизиран достъп" },
                { status: 401 },
            );
        }

        const groupId = Number(params.id);

        if (Number.isNaN(groupId)) {
            return Response.json(
                { message: "Невалиден ID на група" },
                { status: 400 },
            );
        }

        const body = await request.json();
        const validated = updateGroupSchema.parse(body);

        const [group] = await db
            .select({
                id: groups.id,
                choreographer_id: groups.choreographer_id,
            })
            .from(groups)
            .where(eq(groups.id, groupId));

        if (!group) {
            return Response.json(
                { message: "Групата не е намерена" },
                { status: 404 },
            );
        }

        if (group.choreographer_id !== userId) {
            return Response.json(
                { message: "Нямате достъп до тази група" },
                { status: 403 },
            );
        }

        await db
            .update(groups)
            .set({
                name: validated.name,
                color: validated.color,
            })
            .where(eq(groups.id, groupId));

        return Response.json({
            message: "Групата е успешно обновена",
            group: {
                id: groupId,
                name: validated.name,
                color: validated.color,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json(
                {
                    message: "Невалидни данни",
                    errors: error.issues,
                },
                { status: 400 },
            );
        }

        console.error("Error updating group:", error);

        return Response.json(
            { message: "Възникна грешка при обновяването на групата" },
            { status: 500 },
        );
    }
}
