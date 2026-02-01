"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    date?: Date;
    setDate: (date?: Date) => void;
    placeholder?: string;
}

export function DatePicker({ date, setDate, placeholder = "Pilih tanggal" }: DatePickerProps) {
    return (
        <div className="relative flex items-center w-full">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal h-9 bg-background pr-10",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>{placeholder}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border shadow-xl">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="bg-card text-foreground"
                    />
                </PopoverContent>
            </Popover>
            {date && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 h-7 w-7 p-0 text-muted-foreground hover:bg-muted"
                    onClick={() => setDate(undefined)}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
