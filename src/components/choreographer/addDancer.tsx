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
        .min(1, "Името на танцьора е задължително")
        .max(100, "Името трябва да е под 100 символа"),
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
                    message: "Танцьорът беше добавен успешно!",
                });
                form.reset();
                router.refresh();
            } else {
                const errorText = await res.text();
                let errorMessage = "Неуспешно добавяне на танцьор";

                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorMessage;
                } catch {
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
                message: "Мрежова грешка. Опитайте отново.",
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
                                <FormLabel>Име на танцьора</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="напр. Алиса Смит"
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
                                Добавяне...
                            </>
                        ) : (
                            "Добави танцьор"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
