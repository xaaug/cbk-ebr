// components/EntriesTable.tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash } from "lucide-react";

export function EntriesHistory({ date }: { date?: string }) {
  const togglePaid = useMutation(api.entries.togglePaid);

  // use correct query depending on prop
  const entries = useQuery(
    date ? api.entries.getEntriesByDate : api.entries.getTodayEntries,
    date ? { date } : {}
  );

  const isLoading = entries === undefined;
  const isEmpty = entries?.length === 0;

  const title = date
    ? date
    : new Date().toLocaleDateString("en-KE", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="font-serif text-xl">{title}</CardTitle>
        <CardDescription>
          {date ? `Entries for ${date}` : "Entries recorded today"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold font-sans">Qty</TableHead>
              <TableHead className="font-bold font-sans text-right">Price</TableHead>
              <TableHead className="font-bold font-sans text-center">Paid</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="odd:bg-muted/40">
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-3 w-3 rounded-full" /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="icon" disabled>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : isEmpty ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-sm text-muted-foreground italic"
                >
                  No entries for this day — add one above 👆
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow
                  key={entry._id}
                  className="group odd:bg-muted/40 hover:bg-muted/70 transition-colors"
                >
                  <TableCell className="font-serif font-semibold">{entry.qty}</TableCell>
                  <TableCell className="text-right font-mono">{entry.price}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePaid({ id: entry._id })}
                    >
                      <span
                        className={`inline-block h-3 w-3 rounded-full transition-colors ${
                          entry.paid ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
