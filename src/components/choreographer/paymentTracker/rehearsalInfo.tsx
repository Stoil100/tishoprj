"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { RehearsalInfo } from "./types";

interface RehearsalInfoProps {
    rehearsalInfo: RehearsalInfo;
    onRehearsalInfoChange: (info: RehearsalInfo) => void;
}

export function RehearsalInfoComponent({
    rehearsalInfo,
    onRehearsalInfoChange,
}: RehearsalInfoProps) {
    const handleDateChange = (date: string) => {
        onRehearsalInfoChange({ ...rehearsalInfo, date });
    };

    const handleStartTimeChange = (startTime: string) => {
        const startHour = parseInt(startTime.split(":")[0]);
        let newEndTime = rehearsalInfo.endTime;

        if (newEndTime) {
            const endHour = parseInt(newEndTime.split(":")[0]);
            if (endHour <= startHour) {
                newEndTime = "";
            }
        }

        onRehearsalInfoChange({
            ...rehearsalInfo,
            startTime,
            endTime: newEndTime,
        });
    };

    const handleEndTimeChange = (endTime: string) => {
        const endHour = parseInt(endTime.split(":")[0]);
        let newStartTime = rehearsalInfo.startTime;

        if (newStartTime) {
            const startHour = parseInt(newStartTime.split(":")[0]);
            if (startHour >= endHour) {
                newStartTime = "";
            }
        }

        onRehearsalInfoChange({
            ...rehearsalInfo,
            endTime,
            startTime: newStartTime,
        });
    };

    const allHours = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0"),
    );

    const selectedStartHour = rehearsalInfo.startTime
        ? parseInt(rehearsalInfo.startTime.split(":")[0])
        : null;

    const selectedEndHour = rehearsalInfo.endTime
        ? parseInt(rehearsalInfo.endTime.split(":")[0])
        : null;

    const startHours =
        selectedEndHour !== null
            ? allHours.slice(0, selectedEndHour)
            : allHours;

    const endHours =
        selectedStartHour !== null
            ? allHours.slice(selectedStartHour + 1)
            : allHours;

    return (
        <div className="p-6 bg-gradient-to-br from-background to-muted/30 rounded-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date */}
                <div className="space-y-2">
                    <Label
                        htmlFor="rehearsal-date"
                        className="text-base font-semibold"
                    >
                        Дата
                    </Label>
                    <Input
                        id="rehearsal-date"
                        type="date"
                        value={rehearsalInfo.date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="h-10 w-full"
                    />
                </div>

                {/* Start */}
                <div className="space-y-2">
                    <Label className="text-base font-semibold">Начало</Label>
                    <Select
                        value={rehearsalInfo.startTime}
                        onValueChange={handleStartTimeChange}
                    >
                        <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Час" />
                        </SelectTrigger>
                        <SelectContent className="z-9999">
                            {startHours.map((hour) => (
                                <SelectItem key={hour} value={`${hour}:00`}>
                                    {hour}:00
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* End */}
                <div className="space-y-2">
                    <Label className="text-base font-semibold">Край</Label>
                    <Select
                        value={rehearsalInfo.endTime}
                        onValueChange={handleEndTimeChange}
                    >
                        <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Час" />
                        </SelectTrigger>
                        <SelectContent className="z-9999">
                            {endHours.map((hour) => (
                                <SelectItem key={hour} value={`${hour}:00`}>
                                    {hour}:00
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
