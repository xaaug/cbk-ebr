"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

type Entry = {
  createdAt: string;
  date: string;
  paid: boolean;
  price: number;
  qty: number;
  total: number;
  _creationTime: number;
  _id: string;
};

type Props = {
  selectedDate?: string;
};

export function PurchasesByPrice({ selectedDate }: Props) {
  const entries = useQuery(api.entries.getEntriesByDate, {
    date: selectedDate || new Date().toISOString(),
  }) as Entry[] | undefined;

  if (!entries) {
    return (
      <Card className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      </Card>
    );
  }

  const grouped = entries.reduce<Record<string, { qty: number; total: number }>>(
    (acc, entry) => {
      const { price, qty, total } = entry;
      if (!acc[price]) {
        acc[price] = { qty: 0, total: 0 };
      }
      acc[price].qty += qty;
      acc[price].total += total;
      return acc;
    },
    {}
  );

  const rows = Object.entries(grouped)
    .map(([price, data]) => ({
      price: Number(price),
      qty: data.qty,
      total: data.total,
    }))
    .sort((a, b) => a.price - b.price);

  const totalChickens = rows.reduce((sum, row) => sum + row.qty, 0);
  const totalValue = rows.reduce((sum, row) => sum + row.total, 0);

  return (
    <Card className="p-4 mt-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price-breakdown">
          <AccordionTrigger className="text-base font-semibold">
            Purchases by Price
            <span className="ml-2 text-sm text-muted-foreground">
              ({rows.length} price points, {totalChickens} chickens)
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-4 text-sm font-medium text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                {totalChickens} chickens
              </span>{" "}
              •{" "}
              <span className="font-semibold text-foreground">
                {totalValue.toLocaleString()} KES
              </span>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Price (KES)</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total (KES)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.price}>
                      <TableCell className="font-medium">
                        {row.price}
                      </TableCell>
                      <TableCell>{row.qty}</TableCell>
                      <TableCell>{row.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
