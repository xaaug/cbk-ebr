"use client";

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

export function EntriesTable() {
  const entries = useQuery(api.entries.getTodayEntries, {});
  const togglePaid = useMutation(api.entries.togglePaid);
  const deleteEntry = useMutation(api.entries.deleteEntry);

  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isLoading = entries === undefined;
  const isEmpty = entries?.length === 0;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="font-serif font-bold uppercase">
          {today}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold font-sans">Qty</TableHead>
              <TableHead className="font-bold font-sans">Price</TableHead>
              <TableHead className="font-bold font-sans">Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3 w-3 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  </TableRow>
                ))
              : isEmpty
              ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-6"
                  >
                    No entries found for today.
                  </TableCell>
                </TableRow>
              )
              : entries.map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell className="font-mono font-semibold">
                      {entry.qty}
                    </TableCell>
                    <TableCell className="font-mono">{entry.price}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePaid({ id: entry._id })}
                      >
                        <span
                          className={`inline-block h-3 w-3 rounded-full ${
                            entry.paid ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      </Button>
                    </TableCell>
                    <TableCell>
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
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
