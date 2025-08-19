"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export function EntriesHistory({ date }: { date?: string }) {
  const [sortMode, setSortMode] = useState<"default" | "price" | "qty">("default");

  const togglePaid = useMutation(api.entries.togglePaid);
  const deleteEntry = useMutation(api.entries.deleteEntry);

  const entries = useQuery(api.entries.getEntriesByDate, { date: date || new Date().toISOString() });

  const isLoading = entries === undefined;
  const isEmpty = entries?.length === 0;

  const sortedEntries = entries
    ? [...entries].sort((a, b) => {
        if (sortMode === "price") return b.price - a.price;
        if (sortMode === "qty") return b.qty - a.qty;
        return 0; // default = no sort
      })
    : [];

  const cycleSort = () => {
    setSortMode((prev) =>
      prev === "default" ? "price" : prev === "price" ? "qty" : "default"
    );
  };

  return (
    <Card className="mt-2">
      <CardContent>
        <div className="flex justify-end items-center mb-2">
          <Button variant="outline" size="sm" onClick={cycleSort}>
            Sort: {sortMode === "default" ? "Default" : sortMode === "price" ? "Price" : "Qty"}
          </Button>
        </div>
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
                    <Button variant="ghost" size="icon" disabled>
                      <X className="h-2 w-2 text-red-500" />
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
              sortedEntries.map((entry) => (
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <X className="h-2 w-2 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete entry?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The entry will be permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteEntry({ id: entry._id })}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>  
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
