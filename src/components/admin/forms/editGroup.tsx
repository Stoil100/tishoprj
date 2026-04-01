"use client";

import { EditGroupFormType, editGroupSchema } from "@/components/schemas/group";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Edit2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const PRESET_COLORS = [
    { id: "gray", label: "Сиво", bgClass: "bg-gray-400" },
    { id: "blue", label: "Синьо", bgClass: "bg-blue-500" },
    { id: "green", label: "Зелено", bgClass: "bg-green-500" },
    { id: "yellow", label: "Жълто", bgClass: "bg-yellow-400" },
    { id: "red", label: "Червено", bgClass: "bg-red-500" },
    { id: "purple", label: "Лилаво", bgClass: "bg-purple-500" },
] as const;

type GroupColor = (typeof PRESET_COLORS)[number]["id"];

interface EditGroupHeaderProps {
    groupId: number;
    groupName: string;
    currentColor?: GroupColor;
}

export default function EditGroupHeader({
    groupId,
    groupName,
    currentColor = "gray",
}: EditGroupHeaderProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<EditGroupFormType>({
        resolver: zodResolver(editGroupSchema),
        defaultValues: {
            name: groupName,
            color: currentColor,
        },
    });

    const onSubmit = async (values: EditGroupFormType) => {
        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/groups/${groupId}/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message ?? "Възникна грешка.");
                return;
            }

            toast.success(result.message);
            setOpen(false);
            window.location.reload();
        } catch {
            toast.error("Неочаквана грешка. Опитайте отново.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "h-12 w-12 rounded-lg",
                        PRESET_COLORS.find((c) => c.id === currentColor)
                            ?.bgClass || "bg-gray-400",
                    )}
                />
                <div>
                    <h1 className="text-2xl font-semibold">
                        Група: {groupName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Управление на танцовата група и участници
                    </p>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Edit2 className="h-4 w-4" />
                        Редактирай
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Редактирай група</DialogTitle>
                        <DialogDescription>
                            Обновете информацията за групата, включително
                            нейното име и цвят.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Име на групата</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="напр. Клуб Моряците"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Цвят на групата</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-wrap gap-3">
                                                {PRESET_COLORS.map((color) => (
                                                    <button
                                                        key={color.id}
                                                        type="button"
                                                        onClick={() =>
                                                            field.onChange(
                                                                color.id,
                                                            )
                                                        }
                                                        className={cn(
                                                            "relative flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-all duration-200",
                                                            field.value ===
                                                                color.id
                                                                ? "scale-110 border-foreground shadow-lg"
                                                                : "border-transparent hover:scale-105 hover:shadow-md",
                                                        )}
                                                        title={color.label}
                                                        aria-label={`Select ${color.label} color`}
                                                    >
                                                        <div
                                                            className={cn(
                                                                "h-10 w-10 rounded-md",
                                                                color.bgClass,
                                                            )}
                                                        />
                                                        {field.value ===
                                                            color.id && (
                                                            <Check className="absolute h-5 w-5 text-white drop-shadow-lg" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Изберете цвят за вашата група.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 cursor-pointer bg-gradient-to-r from-[#E1473F] to-[#D62828] text-white transition-all duration-200 hover:from-[#F35C55] hover:to-[#C22525]"
                                >
                                    {isSubmitting
                                        ? "Обновяване..."
                                        : "Запази промени"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setOpen(false)}
                                >
                                    Отмяна
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
