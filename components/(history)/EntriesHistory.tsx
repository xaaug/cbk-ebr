"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function EntriesHistory({ date }: { date?: string }) {
  const [sortMode, setSortMode] = useState<"default" | "price" | "qty">("default");

  const togglePaid = useMutation(api.entries.togglePaid);
  const deleteEntry = useMutation(api.entries.deleteEntry);

  const entries = useQuery(api.entries.getEntriesByDate, { date: date || new Date().toISOString() });
  console.log(entries)

  const isLoading = entries === undefined;
  // const isEmpty = entries?.length === 0;

  const sortedEntries = entries
    ? [...entries].sort((a, b) => {
        if (sortMode === "price") return b.price - a.price;
        if (sortMode === "qty") return b.qty - a.qty;
        return 0;
      })
    : [];

  const cycleSort = () => {
    setSortMode((prev) =>
      prev === "default" ? "price" : prev === "price" ? "qty" : "default"
    );
  };

  const filterEntries = (filter: "all" | "paid" | "notPaid") => {
    if (!sortedEntries) return [];
    if (filter === "paid") return sortedEntries.filter((e) => e.paid);
    if (filter === "notPaid") return sortedEntries.filter((e) => !e.paid);
    return sortedEntries;
  };

  const renderTable = (entriesToRender: typeof sortedEntries) => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
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
      ));
    }

    if (!entriesToRender.length) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground italic">
            No entries for this day 
          </TableCell>
        </TableRow>
      );
    }

    return entriesToRender.map((entry) => (
      <TableRow
        key={entry._id}
        className="group odd:bg-muted/40 hover:bg-muted/70 transition-colors"
      >
        <TableCell className="font-serif font-semibold">{entry.qty}</TableCell>
        <TableCell className="text-right font-serif">{entry.price}</TableCell>
        <TableCell className="text-center">
          <Button variant="ghost" size="icon" onClick={() => togglePaid({ id: entry._id })}>
            <span className={`inline-block h-3 w-3 rounded-full transition-colors ${entry.paid ? "bg-green-500" : "bg-red-500"}`} />
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
                <AlertDialogTitle>Delete entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The entry will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteEntry({ id: entry._id })}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>  
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Card className="mt-2">
      <CardContent>
        <div className="flex justify-end items-center mb-2">
          <Button variant="outline" size="sm" onClick={cycleSort}>
            Sort: {sortMode === "default" ? "Default" : sortMode === "price" ? "Price" : "Qty"}
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="notPaid">Not Paid</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold font-serif">Qty</TableHead>
                  <TableHead className="font-bold font-serif text-right">Price</TableHead>
                  <TableHead className="font-bold font-serif text-center">Paid</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTable(filterEntries("all"))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="paid">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold font-serif">Qty</TableHead>
                  <TableHead className="font-bold font-serif text-right">Price</TableHead>
                  <TableHead className="font-bold font-serif text-center">Paid</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTable(filterEntries("paid"))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="notPaid">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold font-serif">Qty</TableHead>
                  <TableHead className="font-bold font-serif text-right">Price</TableHead>
                  <TableHead className="font-bold font-serif text-center">Paid</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTable(filterEntries("notPaid"))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
