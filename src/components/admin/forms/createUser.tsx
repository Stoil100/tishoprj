"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// 1) Define your Zod schema exactly as before:
const formSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

export default function CreateUserForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    // 2) Initialize react-hook-form with zodResolver:
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    // 3) Updated onSubmit:
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message ?? "Възникна грешка.");
                return;
            }

            toast.success(result.message);
            router.refresh();
            form.reset();
        } catch (error) {
            console.error("Create User Error:", error);
            toast.error("Неочаквана грешка. Опитайте отново.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle className="text-2xl">
                        Създаване на профил
                    </CardTitle>
                </div>
                <CardDescription>
                    Въведете информация, за да създадете нов потребител с роля{" "}
                    <strong>хореограф</strong>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Потребителско име</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Въведете потребителско име"
                                            autoComplete="username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Уникално потребителско име за новия
                                        профил.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Имейл</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Въведете имейл"
                                            autoComplete="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Имейлът няма да бъде споделян с трети
                                        страни.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Парола</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="Въведете парола"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-1 top-[2px]"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                                <span className="sr-only">
                                                    {showPassword
                                                        ? "Скрий паролата"
                                                        : "Покажи паролата"}
                                                </span>
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Паролата трябва да съдържа поне 8
                                        символа.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#E1473F] to-[#D62828] hover:from-[#F35C55] hover:to-[#C22525] text-white transition-all duration-200 cursor-pointer"
                        >
                            {isSubmitting ? "Създаване…" : "Създай профил"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
