"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SalesDatesList() {
  const dates = useQuery(api.sales.getSaleDates);
  const isLoading = dates === undefined;

  return (
    <div className="w-full lg:max-w-md mx-auto space-y-3">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-24" />
                </CardTitle>
              </CardHeader>
            </Card>
          ))
        : dates.map((date) => (
            <Link key={date} href={`/history/sales/${date}`}>
              <Card className="border border-gray-200 shadow-sm cursor-pointer hover:shadow-lg transition">
                <CardContent className="text-lg font-semibold font-serif text-gray-700">
                  {new Date(date).toLocaleDateString()}
                </CardContent>
              </Card>
            </Link>
          ))}
    </div>
  );
}
