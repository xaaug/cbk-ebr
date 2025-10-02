"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { InfoCard } from "@/components/InfoCard";

export function SalesDatesList() {
  const dates = useQuery(api.sales.getSaleDates);
  const isLoading = dates === undefined;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Filter dates based on selected date
  const filteredDates = selectedDate
    ? dates?.filter((d: string) => {
        const dDate = new Date(d);
        return (
          dDate.getFullYear() === selectedDate.getFullYear() &&
          dDate.getMonth() === selectedDate.getMonth() &&
          dDate.getDate() === selectedDate.getDate()
        );
      })
    : dates;

  return (
    <div className="w-full lg:max-w-md mx-auto space-y-3">
      {/* Date picker */}
      <div className="flex justify-end mb-4">
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

      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-24" />
              </CardTitle>
            </CardHeader>
          </Card>
        ))
      ) : filteredDates && filteredDates.length > 0 ? (
        filteredDates.map((date: string) => (
          <Link key={date} href={`/history/sales/${date}`}>
            <Card className="border border-gray-200 shadow-sm cursor-pointer hover:shadow-lg transition">
              <CardContent className="text-lg font-semibold font-serif text-gray-700">
                {new Date(date).toLocaleDateString()}
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <InfoCard title="No history found" message="There is no date to display" />
      )}
    </div>
  );
}
