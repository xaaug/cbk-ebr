"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DayTotal() {
  const totals = useQuery(api.entries.getTodayTotals, {});
  const [visible, setVisible] = useState(true);

  const totalSpent = totals?.totalSpent ?? 0;
  const totalQty = totals?.totalQty ?? 0;
  const unpaidTotal = totals?.unpaidTotal ?? 0;

  return (
    <Card className="w-full lgmax-w-md mx-auto mt-6 border border-gray-200 shadow-sm rounded-xl bg-white font-sans">
      <CardHeader className="flex flex-row justify-between text-center pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight font-serif">
          Today&apos;s Summary
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 rounded-full"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </CardHeader>

      <CardContent className="space-y-2 ">
        {/* Main: Quantity */}
        <p className="text-4xl font-bold font-serif text-gray-900">
          {visible ? `${totalQty}` : "••"}
        </p>
        <p className="text-sm text-gray-500 font-medium tracking-wide font-sans">
          Total Quantity
        </p>

        {/* Secondary: Spent */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-2xl font-bold text-gray-800 font-serif">
            {visible ? `${totalSpent.toLocaleString()} KES` : "••••"}
          </p>
          <p className="text-sm text-gray-500">Total Spent</p>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <p className="text-base text-red-700 font-bold font-serif">
            {visible ? `${unpaidTotal.toLocaleString()} KES` : "••••"}
          </p></div>
      </CardContent>
    </Card>
  );
}
