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
    const [open, setOpen] = useState(false);
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
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <UserPen className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Choreographer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-full justify-between",
                                    !selectedId && "text-muted-foreground"
                                )}
                            >
                                {choreographers.find((c) => c.id === selectedId)
                                    ?.username ?? "Select..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Search choreographers..." />
                                <CommandList>
                                    <CommandEmpty>
                                        No choreographer found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {choreographers.map((c) => (
                                            <CommandItem
                                                key={c.id}
                                                onSelect={() =>
                                                    setSelectedId(c.id)
                                                }
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedId === c.id
                                                            ? "opacity-100"
                                                            : "opacity-0"
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
                        className="w-full"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
