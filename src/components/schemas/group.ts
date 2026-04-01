import { z } from "zod";

export const formSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(3, "Name must be at least 3 characters"),
    choreographer_id: z.string().min(1, "Please select a choreographer"),
    color: z.enum(["gray", "blue", "green", "yellow", "red", "purple"]),
});

export type GroupSchemaType = z.infer<typeof formSchema>;

export const editGroupSchema = z.object({
    name: z
        .string()
        .min(1, "Име на групата е задължително")
        .min(2, "Име на групата трябва да е поне 2 символа"),
    color: z.enum(["gray", "blue", "green", "yellow", "red", "purple"]),
});

export type EditGroupFormType = z.infer<typeof editGroupSchema>;
