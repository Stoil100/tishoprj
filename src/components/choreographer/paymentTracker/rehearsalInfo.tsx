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
    const timeToMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    const handleDateChange = (date: string) => {
        onRehearsalInfoChange({ ...rehearsalInfo, date });
    };

    const handleStartTimeChange = (startTime: string) => {
        let newEndTime = rehearsalInfo.endTime;

        if (
            newEndTime &&
            timeToMinutes(newEndTime) <= timeToMinutes(startTime)
        ) {
            newEndTime = "";
        }

        onRehearsalInfoChange({
            ...rehearsalInfo,
            startTime,
            endTime: newEndTime,
        });
    };

    const handleEndTimeChange = (endTime: string) => {
        let newStartTime = rehearsalInfo.startTime;

        if (
            newStartTime &&
            timeToMinutes(newStartTime) >= timeToMinutes(endTime)
        ) {
            newStartTime = "";
        }

        onRehearsalInfoChange({
            ...rehearsalInfo,
            endTime,
            startTime: newStartTime,
        });
    };

    // Generate half-hour slots
    // Generate half-hour slots INCLUDING 24:00
    const allTimes = Array.from({ length: 49 }, (_, i) => {
        const totalMinutes = i * 30;
        const hour = Math.floor(totalMinutes / 60)
            .toString()
            .padStart(2, "0");
        const minutes = totalMinutes % 60 === 0 ? "00" : "30";
        return `${hour}:${minutes}`;
    });

    const selectedStart = rehearsalInfo.startTime
        ? timeToMinutes(rehearsalInfo.startTime)
        : null;

    const selectedEnd = rehearsalInfo.endTime
        ? timeToMinutes(rehearsalInfo.endTime)
        : null;

    const startTimes =
        selectedEnd !== null
            ? allTimes.filter(
                  (t) => t !== "24:00" && timeToMinutes(t) < selectedEnd,
              )
            : allTimes.filter((t) => t !== "24:00");

    const endTimes =
        selectedStart !== null
            ? allTimes.filter((t) => timeToMinutes(t) > selectedStart)
            : allTimes;

    return (
        <div className="p-6 bg-gradient-to-br from-background to-muted/30 rounded-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date */}
                <div className="space-y-2">
                    <Label className="text-base font-semibold">Дата</Label>
                    <Input
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
                            {startTimes.map((time) => (
                                <SelectItem key={time} value={time}>
                                    {time}
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
                            {endTimes.map((time) => (
                                <SelectItem key={time} value={time}>
                                    {time}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
