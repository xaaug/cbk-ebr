import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

export function TodaySalesList() {
  const sales = useQuery(api.sales.getTodaySales);
  const deleteSale = useMutation(api.sales.deleteSale);
  const hotels = useQuery(api.hotels.getHotels) ?? [];

  const hotelMap = Object.fromEntries(hotels.map((h) => [h._id, h]));

  const isLoading = sales === undefined;

  return (
    <div className="mt-6 w-full lg:max-w-md mx-auto space-y-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border border-gray-200 shadow-sm">
              <CardHeader className="flex justify-between">
                <CardTitle className="text-base font-medium font-serif">
                  <Skeleton className="h-5 w-24" />
                </CardTitle>
                <Skeleton className="h-5 w-16" />
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))
        : sales.map((sale) => (
            <Card key={sale._id} className="border border-gray-200 shadow-sm">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-base font-medium font-serif">
                  {sale.customerType === "hotel"
                    ? (hotelMap[sale.hotelId as string]?.name ?? "Hotel")
                    : sale.customerName?.trim() === ""
                      ? "Customer"
                      : sale.customerName}
                </CardTitle>

                <span className="text-gray-700 font-serif text-sm">
                  {sale.totalAmount.toLocaleString()} KES
                </span>
              </CardHeader>

              <CardContent className="text-sm text-gray-600 flex justify-between">
                {sale.quantity} × {sale.unitPrice.toLocaleString()}
                {sale.notes && <div>Notes: {sale.notes}</div>}
                {/* Delete modal */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-red-500 hover:text-red-500 transition">
                      <X size={16} />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-serif">
                        Delete Sale?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Are you sure you want to
                        permanently delete this sale?
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
          ))}
    </div>
  );
}
