"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type MainTab = "all" | "customers" | "hotels";
type StatusTab = "all" | "paid" | "pending";

export function IndividualSalesList() {
  const sales = useQuery(api.sales.getTodaySales) ?? [];
  const hotels = useQuery(api.hotels.getHotels) ?? [];
  const deleteSale = useMutation(api.sales.deleteSale);
  const markPaid = useMutation(api.sales.markSalePaid);

  const [mainTab, setMainTab] = useState<MainTab>("all");
  const [statusTab, setStatusTab] = useState<StatusTab>("all");

  const isLoading = !sales.length && !hotels.length;

  const hotelMap = hotels.reduce<Record<string, { name: string }>>((acc, h) => {
    acc[h._id] = h;
    return acc;
  }, {});

  const filteredSales = sales.filter((sale) => {
    // Main tab filter
    if (mainTab === "customers" && sale.customerType !== "individual") return false;
    if (mainTab === "hotels" && sale.customerType !== "hotel") return false;

    // Status tab filter
    if (statusTab === "paid" && sale.paymentStatus !== "paid") return false;
    if (statusTab === "pending" && sale.paymentStatus !== "pending") return false;

    return true;
  });

  const renderSaleCard = (sale: typeof sales[number]) => {
    const highlightPending = sale.customerType === "individual" && sale.paymentStatus === "pending";

    return (
      <Card
        key={sale._id}
        className={cn(
          "border border-gray-200 shadow-sm cursor-pointer",
          highlightPending && "bg-red-50 hover:bg-red-100"
        )}
        onClick={async () => {
          if (highlightPending) await markPaid({ saleId: sale._id });
        }}
      >
        <CardHeader className="flex justify-between items-center">
          <CardTitle
            className={cn(
              "text-base font-medium font-serif",
              highlightPending ? "text-red-600" : ""
            )}
          >
            {sale.customerType === "hotel"
              ? hotelMap[sale.hotelId as string]?.name ?? "Hotel"
              : sale.customerName?.trim() === ""
              ? "Customer"
              : sale.customerName}
          </CardTitle>
          <span
            className={cn(
              "font-serif text-sm",
              highlightPending ? "text-red-600" : "text-gray-700"
            )}
          >
            {sale.totalAmount.toLocaleString()} KES
          </span>
        </CardHeader>

        <CardContent className="text-sm text-gray-600 flex justify-between items-center gap-2">
          <div>
            {sale.quantity} × {sale.unitPrice.toLocaleString()}
            {sale.notes && <div>Notes: {sale.notes}</div>}
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="text-red-500 hover:text-red-600 transition">
                <X size={16} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-serif">
                  Delete Sale?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Are you sure you want
                  to permanently delete this sale?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={async () => {
                    await deleteSale({ saleId: sale._id });
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="mt-6 w-full lg:max-w-md mx-auto">
      {/* Main Tabs */}
      <Tabs
        value={mainTab}
        onValueChange={(val: string) => setMainTab(val as MainTab)}
        className="mb-2"
      >
        <TabsList className="justify-center">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Status Tabs */}
      <Tabs
        value={statusTab}
        onValueChange={(val: string) => setStatusTab(val as StatusTab)}
        className="mb-4"
      >
        <TabsList className="justify-center">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-gray-200 shadow-sm">
              <CardHeader className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))
        ) : filteredSales.length ? (
          filteredSales.map(renderSaleCard)
        ) : (
          <Card className="border border-gray-200 shadow-sm p-4 text-center text-gray-500">
            No sales to show.
          </Card>
        )}
      </div>
    </div>
  );
}
