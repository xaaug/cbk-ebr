"use client";

import { Card,  CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function DateSummary({ date }: { date?: string }) {
    const [visible, setVisible] = useState(true);
    
    const totals = useQuery(api.entries.getDateTotals, { date: date || new Date().toISOString() });
    const isLoading = totals === undefined;
    const totalSpent = totals?.totalSpent ?? 0;
    const totalQty = totals?.totalQty ?? 0;
    const average = ((totalSpent + 9000)/ totalQty).toFixed(2);


    
    return (
        <>
           <Card className="w-full lgmax-w-md mx-auto mt-2 border border-gray-200 shadow-sm rounded-xl bg-white font-sans">
        
              <CardContent className="space-y-2">
              <div className="flex flex-row justify-end items-end text-center pb-2">
              <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 rounded-full"
                  onClick={() => setVisible((v) => !v)}
                >
                  {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                </div>
                {/* Quantity */}
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <>
                    <p className="text-4xl font-bold font-serif text-gray-900">
                      {visible ? `${totalQty}` : "****"}
                    </p>
                    <p className="text-sm text-gray-500 font-medium tracking-wide font-sans">
                      Total Quantity
                    </p>
                  </>
                )}
        
                {/* Total Spent */}
                <div className="pt-3 border-t border-gray-100">
                  {isLoading ? (
                    <Skeleton className="h-7 w-28" />
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-gray-800 font-serif">
                        {visible ? `${totalSpent.toLocaleString()} KES` : "****"}
                      </p>
                      <p className="text-sm text-gray-500">Total Spent</p>
                    </>
                  )}
                </div>
        
          

              {/* Average */}
                <div className="pt-3 border-t border-gray-100">
                  {isLoading ? (
                    <Skeleton className="h-5 w-20" />
                  ) : (
                    <p className="text-base text-gray-700 font-bold font-serif">
                      {visible ? `${average.toLocaleString()} KES` : "****"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card></>
    )
}