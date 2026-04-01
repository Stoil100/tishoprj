"use client";

import {
    GroupSchemaType,
    formSchema as groupSchema,
} from "@/components/schemas/group";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Users } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function CreateGroupForm({
    choreographers,
}: {
    choreographers: { id: string; username: string }[];
}) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<GroupSchemaType>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: "",
            choreographer_id: "",
            color: "gray",
        },
    });

    const router = useRouter();

    const onSubmit = async (values: GroupSchemaType) => {
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/create-group", {
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
        } catch {
            toast.error("Неочаквана грешка. Опитайте отново.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedChoreographer = choreographers.find(
        (c) => c.id === form.watch("choreographer_id"),
    );

    return (
        <Card>
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-2xl">
                        Създаване на нова група
                    </CardTitle>
                </div>
                <CardDescription>
                    Създайте нова танцова група и назначете хореограф, който да
                    я ръководи.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Group Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-medium">
                                        Име на групата
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="напр. Клуб Моряците"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Изберете описателно име за вашата
                                        танцова група
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Choreographer Select with Search */}
                        <FormField
                            control={form.control}
                            name="choreographer_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-base font-medium">
                                        Хореограф
                                    </FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className={cn(
                                                        "h-11 justify-between",
                                                        !field.value &&
                                                            "text-muted-foreground",
                                                    )}
                                                >
                                                    {selectedChoreographer
                                                        ? selectedChoreographer.username
                                                        : "Изберете хореограф..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-full p-0"
                                            align="start"
                                        >
                                            <Command>
                                                <CommandInput
                                                    placeholder="Търсене на хореографи..."
                                                    className="h-9"
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        Няма намерени
                                                        хореографи.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {choreographers.map(
                                                            (choreographer) => (
                                                                <CommandItem
                                                                    key={
                                                                        choreographer.id
                                                                    }
                                                                    value={
                                                                        choreographer.username
                                                                    }
                                                                    onSelect={() => {
                                                                        field.onChange(
                                                                            choreographer.id,
                                                                        );
                                                                        setOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value ===
                                                                                choreographer.id
                                                                                ? "opacity-100"
                                                                                : "opacity-0",
                                                                        )}
                                                                    />
                                                                    {
                                                                        choreographer.username
                                                                    }
                                                                </CommandItem>
                                                            ),
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Потърсете и изберете хореограф, който ще
                                        ръководи групата
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Color Selection */}
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-medium">
                                        Цвят на групата
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex flex-wrap gap-3">
                                            {PRESET_COLORS.map((color) => (
                                                <button
                                                    key={color.id}
                                                    type="button"
                                                    onClick={() =>
                                                        field.onChange(color.id)
                                                    }
                                                    className={cn(
                                                        "relative flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-all duration-200",
                                                        field.value === color.id
                                                            ? "border-foreground shadow-lg scale-110"
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
                                        Изберете цвят за вашата група. Това
                                        поможе при организирането и
                                        филтрирането.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-[#E1473F] to-[#D62828] hover:from-[#F35C55] hover:to-[#C22525] text-white transition-all duration-200 cursor-pointer"
                            >
                                {isSubmitting ? "Създаване..." : "Създай група"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
