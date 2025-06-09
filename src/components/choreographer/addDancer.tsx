"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    name: z
        .string()
        .min(1, "Dancer name is required")
        .max(100, "Name must be less than 100 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddDancerFormProps {
    groupId: number;
}

export default function AddDancerForm({ groupId }: AddDancerFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: "success" | "error" | null;
        message: string;
    }>({ type: null, message: "" });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const router = useRouter();

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: "" });

        try {
            const res = await fetch(`/api/groups/${groupId}/add-dancer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setSubmitStatus({
                    type: "success",
                    message: "Dancer added successfully!",
                });
                form.reset();
                router.refresh();
            } else {
                const errorText = await res.text();
                let errorMessage = "Failed to add dancer";

                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorMessage;
                } catch {
                    // If response isn't JSON, use the text or default message
                    errorMessage = errorText || errorMessage;
                }

                setSubmitStatus({
                    type: "error",
                    message: errorMessage,
                });
            }
        } catch (error) {
            setSubmitStatus({
                type: "error",
                message: "Network error. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dancer Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. Alice Smith"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding Dancer...
                            </>
                        ) : (
                            "Add Dancer"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
