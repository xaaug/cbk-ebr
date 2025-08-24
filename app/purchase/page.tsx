"use client";

import { AddEntryForm } from "@/components/AddForm";
import { DayTotal } from "@/components/DayTotal";
import { EntriesTable } from "@/components/EntriesTable";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function formatDate(date: Date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function Page() {
  const today = formatDate(new Date());

  const totals = useQuery(api.entries.getDateTotals, {
    date: today,
  });


  const isLoading = totals === undefined;
  const totalSpent = totals?.totalSpent ?? 0;
  const totalQty = totals?.totalQty ?? 0;

  const average = totalQty > 0 ? (totalSpent + 9000) / totalQty : 0;

  return (
     <>
    <div className="flex justify-end mb-2">
  <Button asChild variant="outline" size="sm">
    <Link href="/history/purchases">
      View History
    </Link>
  </Button>
</div>

    <div className="flex flex-1 flex-col gap-4 pb-20">
      <DayTotal />
      <AddEntryForm />

     {average > 0 &&  <Card>
        <CardContent>
          <CardTitle className="text-lg font-serif font-semibold tracking-tight mb-2">Average</CardTitle>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <p className="text-lg font-sans font-semibold text-gray-800">
              {average.toLocaleString("en-KE", {
                style: "currency",
                currency: "KES",
                minimumFractionDigits: 2,
              })}
            </p>
          )}
        </CardContent>
      </Card>}

      <EntriesTable />
    </div></>
  );
}
