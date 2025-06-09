"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        onRehearsalInfoChange({ ...rehearsalInfo, startTime });
    };

    const handleEndTimeChange = (endTime: string) => {
        onRehearsalInfoChange({ ...rehearsalInfo, endTime });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
                <Label htmlFor="rehearsal-date">Дата на репетицията</Label>
                <Input
                    id="rehearsal-date"
                    type="date"
                    value={rehearsalInfo.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                />
            </div>

            <div>
                <Label htmlFor="rehearsal-time">Час на репетицията</Label>
                <div className="flex items-center space-x-2">
                    <Input
                        id="rehearsal-start-time"
                        type="time"
                        placeholder="--:--"
                        value={rehearsalInfo.startTime}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                        min="00:00"
                        max="23:59"
                        aria-label="Начален час"
                    />
                    <span className="text-sm text-muted-foreground">до</span>
                    <Input
                        id="rehearsal-end-time"
                        type="time"
                        placeholder="--:--"
                        value={rehearsalInfo.endTime}
                        onChange={(e) => handleEndTimeChange(e.target.value)}
                        min="00:00"
                        max="23:59"
                        aria-label="Краен час"
                    />
                </div>
            </div>
        </div>
    );
}
