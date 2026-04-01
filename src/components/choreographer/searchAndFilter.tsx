"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const COLORS = [
    { value: "gray", label: "Сив" },
    { value: "blue", label: "Син" },
    { value: "green", label: "Зелен" },
    { value: "yellow", label: "Жълт" },
    { value: "red", label: "Червен" },
    { value: "purple", label: "Лилав" },
] as const;

const COLOR_SWATCHES = {
    gray: "bg-slate-300",
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    yellow: "bg-amber-400",
    red: "bg-rose-500",
    purple: "bg-violet-500",
} as const;

const ALL_COLORS_VALUE = "all";

interface SearchAndFilterGroupsProps {
    currentSearch?: string;
    currentColor?: string;
}

export function SearchAndFilterGroups({
    currentSearch = "",
    currentColor = "",
}: SearchAndFilterGroupsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(currentSearch);

    useEffect(() => {
        setSearch(currentSearch);
    }, [currentSearch]);

    const updateParams = (nextSearch: string, nextColor: string) => {
        const params = new URLSearchParams(searchParams.toString());

        const trimmedSearch = nextSearch.trim();

        if (trimmedSearch) {
            params.set("search", trimmedSearch);
        } else {
            params.delete("search");
        }

        if (nextColor) {
            params.set("color", nextColor);
        } else {
            params.delete("color");
        }

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        updateParams(value, currentColor);
    };

    const handleColorFilter = (value: string) => {
        const nextColor = value === ALL_COLORS_VALUE ? "" : value;
        updateParams(search, nextColor);
    };

    const handleClearFilters = () => {
        setSearch("");
        router.replace(pathname);
    };

    const hasActiveFilters = Boolean(search.trim() || currentColor);

    return (
        <div className="mb-8 space-y-4">
            <div className="flex items-end gap-3">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        placeholder="Търсете по име..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full"
                    />
                </div>

                <Select
                    value={currentColor || ALL_COLORS_VALUE}
                    onValueChange={handleColorFilter}
                >
                    <SelectTrigger className="w-44">
                        <SelectValue placeholder="Филтър по цвят" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL_COLORS_VALUE}>
                            Всички цветове
                        </SelectItem>

                        {COLORS.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            "h-3 w-3 rounded-full border border-gray-300",
                                            COLOR_SWATCHES[color.value],
                                        )}
                                    />
                                    <span>{color.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                    >
                        <X className="mr-1 h-4 w-4" />
                        Изчисти
                    </Button>
                )}
            </div>

            {hasActiveFilters && (
                <p className="text-sm text-gray-600">
                    {search.trim() && currentColor
                        ? `Показани групи: "${search.trim()}" с цвят ${COLORS.find((c) => c.value === currentColor)?.label}`
                        : search.trim()
                          ? `Показани групи: "${search.trim()}"`
                          : `Показани групи с цвят: ${COLORS.find((c) => c.value === currentColor)?.label}`}
                </p>
            )}
        </div>
    );
}
