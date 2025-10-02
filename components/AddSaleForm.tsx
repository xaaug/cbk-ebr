"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const commonQuantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const commonPrices = [450, 500, 550, 600, 650, 700, 750, 800, 900, 1000, 1100];

export function AddSaleForm() {
  const addQuickSale = useMutation(api.sales.addQuickSale);

  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [paid, setPaid] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!qty || qty < 1) {
      toast.error("Invalid Quantity", { description: "Quantity must be at least 1." });
      return;
    }
    if (price < 150) {
      toast.error("Invalid Price", { description: "Price cannot be below 150." });
      return;
    }

    setLoading(true);
    try {
      await addQuickSale({ qty, price, paid });
      toast.success("Sale added", {
        description: `${qty} kuku${qty > 1 ? "s" : ""} at ${price} KES each`,
      });
      setQty(1);
      setPrice(0);
      setPaid(true);
    } catch (err: unknown) {
      console.error("Add sale error:", err);

      if (err instanceof Error) {
        toast.error("Error", { description: err.message });
      } else {
        toast.error("Error", { description: "Unknown error occurred." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full lg:max-w-md mx-auto mt-6 border border-gray-200 shadow-sm rounded-xl bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-serif font-semibold tracking-tight text-gray-900">
          Add New Sale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Total</span>
          <span className="text-lg font-bold font-serif text-gray-900">
            {qty && price ? (qty * price).toLocaleString() + " KES" : "—"}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Quantity */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Quantity</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonQuantities.map((q) => (
                <Button
                  key={q}
                  type="button"
                  variant={qty === q ? "default" : "outline"}
                  onClick={() => setQty(q)}
                  className={`rounded-full px-4 py-1 text-sm transition font-sans ${
                    qty === q
                      ? "bg-[#40E0D0] text-white hover:bg-[#3AC9BA]"
                      : "hover:border-[#40E0D0] hover:text-[#40E0D0]"
                  }`}
                >
                  {q}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="mt-3"
              min={1}
            />
          </div>

          {/* Price */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Price per Kuku</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonPrices.map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant={price === p ? "default" : "outline"}
                  onClick={() => setPrice(p)}
                  className={`rounded-full px-4 py-1 text-sm transition font-sans ${
                    price === p
                      ? "bg-[#40E0D0] text-white hover:bg-[#3AC9BA]"
                      : "hover:border-[#40E0D0] hover:text-[#40E0D0]"
                  }`}
                >
                  {p}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-3"
              min={0}
            />
          </div>

          {/* Paid toggle */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Payment Status</Label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant={paid ? "default" : "outline"}
                onClick={() => setPaid(true)}
                className={paid ? "bg-[#40E0D0] text-foreground" : ""}
              >
                Paid
              </Button>
              <Button
                type="button"
                variant={!paid ? "default" : "outline"}
                onClick={() => setPaid(false)}
                className={!paid ? "bg-red-500 text-foreground hover:bg-red-600" : ""}
              >
                Unpaid
              </Button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#40E0D0] hover:bg-[#3AC9BA] text-foreground font-medium rounded-lg"
          >
            {loading ? "Adding..." : "Add Sale"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
