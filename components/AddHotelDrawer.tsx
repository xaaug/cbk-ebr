"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function AddHotelDrawer() {
  const addHotel = useMutation(api.hotels.addHotel);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    chickenPrice: "",
    balance: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    price?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.name.trim()) {
      newErrors.name = "Hotel name is required.";
    }

    const phone = form.phone.trim();
    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^(7|1)\d{8}$/.test(phone)) {
      newErrors.phone =
        "Phone must start with 7 or 1 and be exactly 9 digits (e.g. 712345678).";
    }

    const price = parseFloat(form.chickenPrice);
    if (isNaN(price)) {
      newErrors.price = "Price must be a number.";
    } else if (price < 400) {
      newErrors.price = "Price cannot be less than 400.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValid = () => {
    return (
      form.name.trim() &&
      /^(7|1)\d{8}$/.test(form.phone.trim()) &&
      !isNaN(parseFloat(form.chickenPrice)) &&
      parseFloat(form.chickenPrice) >= 400
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await addHotel({
        name: form.name.trim(),
        phone: form.phone.trim(),
        chickenPrice: parseFloat(form.chickenPrice),
        balance: form.balance.trim()
          ? parseFloat(form.balance)
          : 0, 
      });

      toast.success("Hotel added successfully!");
      setForm({ name: "", phone: "", chickenPrice: "", balance: "" });
      setOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        // TODO: Clena the erreor
        const cleanMessage = err.message.replace(/^Uncaught Error:\s*/, "");
        toast.error("Error adding hotel", { description: cleanMessage });
      } else if (typeof err === "string") {
        toast.error("Error adding hotel", { description: err });
      } else {
        toast.error("Unexpected error");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="w-full flex items-center gap-2 mt-4"
        >
          <Plus className="h-4 w-4" /> New Hotel
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Hotel</DrawerTitle>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 p-4">
          <div className="grid ">
            <Label htmlFor="name">Hotel Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Sunrise Lodge"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid ">
            <Label htmlFor="phone">Phone</Label>
            <div className="flex">
              <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                +254
              </span>
              <Input
                id="phone"
                className="rounded-l-none"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="712345678"
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="grid ">
            <Label htmlFor="chickenPrice">Price</Label>
            <Input
              id="chickenPrice"
              type="number"
              value={form.chickenPrice}
              onChange={(e) =>
                setForm({ ...form, chickenPrice: e.target.value })
              }
              placeholder="450"
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          <div className="grid ">
            <Label htmlFor="balance">Balance</Label>
            <Input
              id="balance"
              type="number"
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: e.target.value })}
              placeholder="0"
            />
          </div>

          <DrawerFooter>
            <Button type="submit" disabled={!isValid() || loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
