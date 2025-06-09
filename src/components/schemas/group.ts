import { z } from "zod";

export const formSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(3, "Name must be at least 3 characters"),
    choreographer_id: z.string().min(1, "Please select a choreographer"),
});

export type GroupSchemaType = z.infer<typeof formSchema>;
