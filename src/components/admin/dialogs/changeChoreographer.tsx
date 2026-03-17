"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, UserPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ChangeChoreographerDialog({
    groupId,
    choreographers,
}: {
    groupId: number;
    choreographers: { id: string; username: string }[];
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        await fetch(`/api/admin/groups/${groupId}/change-choreographer`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ choreographer_id: selectedId }),
        });
        router.refresh();
        setIsSaving(false);
        setDialogOpen(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <UserPen className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Смяна на хореограф</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={popoverOpen}
                                className={cn(
                                    "w-full justify-between",
                                    !selectedId && "text-muted-foreground",
                                )}
                            >
                                {choreographers.find((c) => c.id === selectedId)
                                    ?.username ?? "Изберете..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Търсене на хореографи..." />
                                <CommandList>
                                    <CommandEmpty>
                                        Не е намерен хореограф.
                                    </CommandEmpty>

                                    <CommandGroup>
                                        {choreographers.map((c) => (
                                            <CommandItem
                                                key={c.id}
                                                onSelect={() => {
                                                    setSelectedId(c.id);
                                                    setPopoverOpen(false); // затваря само combobox
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedId === c.id
                                                            ? "opacity-100"
                                                            : "opacity-0",
                                                    )}
                                                />
                                                {c.username}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    <Button
                        onClick={handleSave}
                        disabled={!selectedId || isSaving}
                        className="w-full bg-gradient-to-r from-[#E1473F] to-[#D62828] hover:from-[#F35C55] hover:to-[#C22525] text-white transition-all duration-200 cursor-pointer"
                    >
                        {isSaving ? "Запазване..." : "Запази"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
