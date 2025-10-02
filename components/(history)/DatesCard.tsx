"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { InfoCard } from "../InfoCard";

export default function DatesCard() {
  const days = useQuery(api.entries.getHistoryDays, {});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  if (!days) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Filter days based on selected date
  let filteredDays = days;
  if (selectedDate) {
    filteredDays = days.filter((d) => {
      const [day, month, year] = d.date.split("/");
      const dayDate = new Date(Number(year), Number(month) - 1, Number(day));
      return (
        dayDate.getFullYear() === selectedDate.getFullYear() &&
        dayDate.getMonth() === selectedDate.getMonth() &&
        dayDate.getDate() === selectedDate.getDate()
      );
    });
  }
  

  function formatDate(dateString: string) {
    const parsed = new Date(dateString + "T00:00:00");
    return isNaN(parsed.getTime())
      ? dateString
      : parsed.toLocaleDateString("en-KE", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  }

  return (
    <div className="space-y-6 pb-30">
      {/* Date Picker */}
      <div className="flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[250px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
          </PopoverContent>
        </Popover>
      </div>

      {/* History List */}
      {filteredDays.length === 0 ? (
        <InfoCard title="No history found" message="There is no date to display" />
      ) : (
        filteredDays.reverse().map((day) => (
          <Link
            key={day.date}
            href={`/history/${encodeURIComponent(day.date)}`}
            className="block"
          >
            <Card className="hover:shadow-md hover:bg-muted/50 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="font-serif font-bold text-lg">
                  {formatDate(day.date)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground font-display">
                <p>
                  <span className="font-serif font-semibold text-foreground">Total Qty:</span>{" "}
                  <span className="font-serif text-lg font-semibold">{day.totalQty}</span>
                </p>
                <p>
                  <span className="font-serif font-semibold text-foreground">Total Price:</span>{" "}
                  <span className="uppercase text-sm">kes</span>{" "}
                  <span className="font-serif text-lg font-semibold">{day.totalPrice}</span>
                </p>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
