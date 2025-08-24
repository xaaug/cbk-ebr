"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function DateSummary({ date }: { date?: string }) {
  const [visible, setVisible] = useState(true);

  const sales = useQuery(api.sales.getSalesByDate, {
    date: date || new Date().toISOString(),
  });

  const isLoading = sales === undefined;

  // Customer sales (exclude hotels) for earnings/unpaid
  const customerSales = sales?.filter((s) => s.customerType === "individual") || [];

  // Total Kukus: include everyone
  const totalKukus = sales?.reduce((sum, s) => sum + s.quantity, 0) || 0;

  const estimatedEarnings = customerSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const unpaidAmount = customerSales
    .filter((s) => s.paymentStatus === "pending")
    .reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <Card className="w-full lg:max-w-md mx-auto mt-2 border border-gray-200 shadow-sm rounded-xl bg-white font-sans">
      <CardContent className="space-y-4">
        {/* Toggle visibility */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 rounded-full"
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>

        {/* Total Kukus */}
        {isLoading ? (
          <Skeleton className="h-10 w-20" />
        ) : (
          <>
            <p className="text-3xl font-bold font-serif text-gray-900">
              {visible ? `${totalKukus}` : "****"}
            </p>
            <p className="text-sm text-gray-500 font-medium tracking-wide font-sans">
              Total Kukus
            </p>
          </>
        )}

        {/* Estimated Earnings */}
        <div className="pt-3 border-t border-gray-100">
          {isLoading ? (
            <Skeleton className="h-10 w-40" />
          ) : (
            <>
              <p className="text-2xl font-bold font-serif text-gray-900">
                {visible ? `${estimatedEarnings.toLocaleString()} KES` : "****"}
              </p>
              <p className="text-sm text-gray-500 font-medium tracking-wide font-sans">
                Estimated Earnings
              </p>
            </>
          )}
        </div>

        {/* Unpaid Amount */}
        <div className="pt-3 border-t border-gray-100">
          {isLoading ? (
            <Skeleton className="h-7 w-32" />
          ) : (
            <>
              <p className="text-xl font-bold text-red-500 font-serif">
                {visible ? `${unpaidAmount.toLocaleString()} KES` : "****"}
              </p>
              <p className="text-sm text-gray-500">Unpaid Amount</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
