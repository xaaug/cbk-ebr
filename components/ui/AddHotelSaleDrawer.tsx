"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CalendarIcon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Id } from "@/convex/_generated/dataModel";

function formatNumber(num: number) {
  return num.toLocaleString("en-KE");
}

const QUICK_QTYS = [1, 2, 3, 4, 5];

export function AddHotelSaleDrawer() {
  const [open, setOpen] = useState(false);

  // Convex
  const addSale = useMutation(api.sales.addSale);
  const hotels = useQuery(api.hotels.getHotels, {});

  // Form state
  const [hotelId, setHotelId] = useState<Id<"hotels"> | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending">(
    "pending",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Error handling
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleQtyChange = (qty: number) => {
    setQuantity(qty);
    setTotalAmount(qty * unitPrice);
  };

  // auto-set unit price when hotel is selected
  useEffect(() => {
    if (hotelId && hotels) {
      const selectedHotel = hotels.find((h) => h._id === hotelId);
      if (selectedHotel) {
        setUnitPrice(selectedHotel.chickenPrice);
        setTotalAmount(quantity * selectedHotel.chickenPrice);
      }
    }
  }, [hotelId, quantity, hotels]);

  const resetForm = () => {
    setHotelId(undefined);
    setQuantity(0);
    setUnitPrice(0);
    setTotalAmount(0);
    setPaymentStatus("pending");
    setNotes("");
    setDate(new Date());
    setIsSaving(false);
    setErrors({});
    setSubmitError(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!hotelId) {
      newErrors.hotelId = "Please select a hotel.";
    }
    if (!quantity || quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0.";
    }
    if (!date) {
      newErrors.date = "Date is required.";
    }
    return newErrors;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSaving(true);

      await addSale({
        customerType: "hotel",
        hotelId,
        item: "chicken",
        quantity,
        unitPrice,
        totalAmount,
        paymentStatus,
        notes,
        date: date?.toISOString().slice(0, 10) ?? "",
        createdAt: new Date().toISOString(),
      });

      resetForm();
      toast.success("Hotel sale added successfully!");
      setOpen(false);
    } catch (err) {
      setSubmitError("Failed to save sale. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="w-full flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Hotel Sale
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-0">
        <div className="max-h-[80vh] overflow-y-auto p-4">
          <DrawerHeader>
            <DrawerTitle className="font-serif">Add Hotel Sale</DrawerTitle>
          </DrawerHeader>

          <form
            onSubmit={handleSave}
            className="space-y-4 w-full max-w-lg mx-auto"
          >
            {/* Hotel Select */}
            <div>
              <Label>Hotel</Label>
              <Select
                onValueChange={(val) => setHotelId(val as Id<"hotels">)}
                value={hotelId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select hotel" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {hotels?.map((h) => (
                    <SelectItem key={h._id} value={h._id}>
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.hotelId && (
                <p className="text-sm text-red-600 mt-1">{errors.hotelId}</p>
              )}
            </div>

            {/* Show the rest only when a hotel is selected */}
            {hotelId && (
              <>
                {/* Total */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Total
                  </span>
                  <span className="text-lg font-bold font-serif text-gray-900">
                    {formatNumber(totalAmount)}
                  </span>
                </div>

                {/* Quantity */}
                <div>
                  <Label>Quantity</Label>
                  <div className="flex gap-2 mb-4">
                    {QUICK_QTYS.map((q) => (
                      <Button
                        key={q}
                        type="button"
                        size="sm"
                        variant={quantity === q ? "default" : "outline"}
                        className="rounded-full px-4 py-1 text-sm"
                        onClick={() => handleQtyChange(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQtyChange(Number(e.target.value))}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>
                  )}
                </div>

                {/* Payment Status */}
                <div className="w-full">
                  <Label>Payment Status</Label>
                  <Select
                    value={paymentStatus}
                    onValueChange={(val) =>
                      setPaymentStatus(val as "paid" | "pending")
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Picker */}
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm text-red-600 mt-1">{errors.date}</p>
                  )}
                </div>

                {submitError && (
                  <p className="text-sm text-red-600 text-center">
                    {submitError}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Add Sale"}
                </Button>
              </>
            )}
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
