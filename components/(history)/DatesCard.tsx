"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DatesCard() {
  const days = useQuery(api.entries.getHistoryDays, {});
  

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

  if (days.length === 0) return <p>No history found.</p>;
  function formatDate(dateString: string) {
    // Try parsing, fallback to original string
    const parsed = new Date(dateString + "T00:00:00");
    return isNaN(parsed.getTime())
      ? dateString // fallback if invalid
      : parsed.toLocaleDateString("en-KE", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  }


  return (
    <div className="space-y-4 pb-30">
      {days.reverse().map((day) => (
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
                <span className="font-sns font-medium text-foreground">Total Qty:</span>{" "}
                {day.totalQty}
              </p>
              <p >
                <span className="font-display font-medium text-foreground">Total Price:</span>{" "}
                <span className="uppercase text-xs">kes</span> {day.totalPrice}
              </p>
             
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
