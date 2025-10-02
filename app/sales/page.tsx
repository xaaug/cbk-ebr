"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { TodaySalesList } from "@/components/TodaySalesList";
import { AddSaleForm } from "@/components/AddSaleForm";
import { AddHotelSaleDrawer } from "@/components/ui/AddHotelSaleDrawer";

export default function SalesPage() {
  const totals = useQuery(api.sales.getTodayTotals, {}); 
  const [visible, setVisible] = useState(false);

  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isLoading = totals === undefined;
  const totalQty = totals?.totalQty ?? 0;
  const totalSales = totals?.totalSpent ?? 0;

  return (
    <>
      <div className="mb-24">
      <div className="flex justify-end mb-2">
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/history/sales">View History</Link>
        </Button>
      </div>

      {/* Today’s Summary Card */}
      <Card className="w-full lg:max-w-md mx-auto mt-6 border border-gray-200 shadow-sm rounded-xl bg-white font-sans">
        <CardHeader className="flex flex-row justify-between text-center pb-2">
          <div className="flex flex-col items-start text-left gap-1 ">
            <CardTitle className="text-lg font-semibold tracking-tight font-serif">
              Today&apos;s Summary
            </CardTitle>
            <p className="text-sm uppercase text-gray-500">{today}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 rounded-full"
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </CardHeader>

        <CardContent className="space-y-2">
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <>
              <p className="text-4xl font-bold font-serif text-gray-900">
                {visible ? `${totalQty}` : "**"}
              </p>
              <p className="text-sm text-gray-500 font-medium tracking-wide font-sans">
                Total Quantity
              </p>
            </>
          )}

          <div className="pt-3 border-t border-gray-100">
            {isLoading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-800 font-serif">
                  {visible ? `${totalSales.toLocaleString()} KES` : "****"}
                </p>
                <p className="text-sm text-gray-500">Total Sales</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

            <div className="mt-5">
              <AddHotelSaleDrawer />
            </div>

      <div className="w-full mt-5">
        <AddSaleForm />
      </div>


      <div>
      <h2 className="text-lg font-serif font-semibold mb-4 mt-6">Recent Sales</h2>
      <TodaySalesList />
      </div>
      </div>
    </>
  );
}
