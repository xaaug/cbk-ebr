"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { IndividualSalesList } from "../_components/IndividualSalesList";
import HotelHeader from "@/components/HotelHeader";
import DateSummary from "../_components/DateSummary";
import { Skeleton } from "@/components/ui/skeleton";

export default function SalesByDatePage() {
  const params = useParams();
  const date = params.date; 
  const queryDate =
    typeof date === "string" ? date : Array.isArray(date) ? date[0] : new Date().toISOString();

  const sales = useQuery(api.sales.getSalesByDate, { date: queryDate });

  if (!sales) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-48" /> 
        <Skeleton className="h-6 w-32" /> 
        <div className="space-y-3 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-gray-200 shadow-sm rounded p-3">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-24">
      <HotelHeader title={queryDate} />
      <DateSummary date={queryDate} />
      <IndividualSalesList />
      </div>
    </>
  );
}
