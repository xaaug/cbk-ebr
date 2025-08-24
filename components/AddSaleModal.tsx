"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";

function formatNumber(num: number) {
  return num.toLocaleString("en-KE");
}

const QUICK_QTYS = [1, 2, 3, 4, 5];
const QUICK_PRICES = [400, 450, 500, 800, 1000];

export function AddSaleModal() {
  const [open, setOpen] = useState(false);

  // Convex
  const addSale = useMutation(api.sales.addSale);
  const hotels = useQuery(api.hotels.getHotels, {});

  // Form state
  const [customerType, setCustomerType] = useState<"hotel" | "individual">(
    "hotel",
  );
  const [hotelId, setHotelId] = useState<Id<"hotels"> | undefined>(undefined);
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<
    "paid" | "pending" | "partial"
  >("paid");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Error handling
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleQtyPriceChange = (qty: number, price: number) => {
    setQuantity(qty);
    setUnitPrice(price);
    setTotalAmount(qty * price);
  };

  const resetForm = () => {
    setCustomerType("hotel");
    setHotelId(undefined);
    setCustomerName("");
    setQuantity(0);
    setUnitPrice(0);
    setTotalAmount(0);
    setPaymentStatus("paid");
    setNotes("");
    setDate(new Date());
    setErrors({});
    setSubmitError(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (customerType === "hotel" && !hotelId) {
      newErrors.hotelId = "Please select a hotel.";
    }
    if (!quantity || quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0.";
    }
    if (!unitPrice || unitPrice <= 450) {
      newErrors.unitPrice = "Unit price must be greater than 450.";
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
      await addSale({
        customerType,
        hotelId: customerType === "hotel" ? hotelId : undefined,
        customerName: customerType === "individual" ? customerName : undefined,
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
      setOpen(false);
    } catch (err) {
      setSubmitError("Failed to save sale. Please try again.");
      console.error(err);
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
          <Plus className="h-4 w-4" /> New Sale
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-0">
        <div className="max-h-[80vh] overflow-y-auto p-4">
          <DrawerHeader>
            <DrawerTitle className="font-serif">Add Sale</DrawerTitle>
          </DrawerHeader>

          <form
            onSubmit={handleSave}
            className="space-y-4 w-full max-w-lg mx-auto"
          >
            {/* Sale Type */}
            <div>
              <Label className="mb-2 block">Sale Type</Label>
              <RadioGroup
                value={customerType}
                onValueChange={(val: "hotel" | "individual") =>
                  setCustomerType(val)
                }
                className="flex gap-3"
              >
                <Label
                  htmlFor="hotel"
                  className={cn(
                    "flex cursor-pointer items-center rounded-md border px-4 py-2 text-sm font-medium transition",
                    customerType === "hotel"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary-foreground bg-background hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <RadioGroupItem value="hotel" id="hotel" className="sr-only" />
                  Hotel
                </Label>

                <Label
                  htmlFor="individual"
                  className={cn(
                    "flex cursor-pointer items-center rounded-md border px-4 py-2 text-sm font-medium transition",
                    customerType === "individual"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary-foreground bg-background hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <RadioGroupItem
                    value="individual"
                    id="individual"
                    className="sr-only"
                  />
                  Individual
                </Label>
              </RadioGroup>
            </div>

            {/* Hotel or Individual */}
            {customerType === "hotel" ? (
              <div>
                <Label>Hotel</Label>
                <Select onValueChange={(val) => setHotelId(val as Id<"hotels">)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hotel" />
                  </SelectTrigger>
                  <SelectContent>
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
            ) : (
              <div>
                <Label>Customer Name</Label>
                <Input
                  placeholder="Enter name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.customerName}
                  </p>
                )}
              </div>
            )}

            {/* Total */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total</span>
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
                    className="rounded-full px-4 py-1 text-sm transition border-primary-foreground font-sans"
                    onClick={() => handleQtyPriceChange(q, unitPrice)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                value={quantity}
                onChange={(e) =>
                  handleQtyPriceChange(Number(e.target.value), unitPrice)
                }
              />
              {errors.quantity && (
                <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>
              )}
            </div>

            {/* Unit Price */}
            <div>
              <Label>Unit Price (KES)</Label>
              <div className="flex gap-2 mb-4">
                {QUICK_PRICES.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    size="sm"
                    variant={unitPrice === p ? "default" : "outline"}
                    className="rounded-full px-4 py-1 text-sm transition font-sans border-primary-foreground"
                    onClick={() => handleQtyPriceChange(quantity, p)}
                  >
                    {formatNumber(p)}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                value={unitPrice}
                onChange={(e) =>
                  handleQtyPriceChange(quantity, Number(e.target.value))
                }
              />
              {errors.unitPrice && (
                <p className="text-sm text-red-600 mt-1">{errors.unitPrice}</p>
              )}
            </div>

            {/* Payment Status */}
            <div>
              <Label>Payment Status</Label>
              <Select
                value={paymentStatus}
                onValueChange={(val) =>
                  setPaymentStatus(val as "paid" | "pending" | "partial")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
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
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-red-600 mt-1">{errors.date}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Optional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {submitError && (
              <p className="text-sm text-red-600 text-center">{submitError}</p>
            )}

            <Button type="submit" className="w-full">
              Save Sale
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
