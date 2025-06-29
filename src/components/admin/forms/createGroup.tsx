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

            if (res.ok) {
                router.refresh();
            } else {
                const errorText = await res.text();
                console.error("Failed to create group:", errorText);
                // You could add toast notification here
            }
        } catch (error) {
            console.error("Error creating group:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedChoreographer = choreographers.find(
        (c) => c.id === form.watch("choreographer_id")
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
                                                            "text-muted-foreground"
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
                                                                            choreographer.id
                                                                        );
                                                                        setOpen(
                                                                            false
                                                                        );
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value ===
                                                                                choreographer.id
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {
                                                                        choreographer.username
                                                                    }
                                                                </CommandItem>
                                                            )
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

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
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
