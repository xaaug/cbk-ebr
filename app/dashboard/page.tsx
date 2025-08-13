'use client'

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function Example() {
  const totals = useQuery(api.entries.getTodayTotals, {});
  const addEntry = useMutation(api.entries.addEntry);

  return (
    <div>
      <p>Total Spent: {totals?.totalSpent ?? 0} KES</p>
      <Button onClick={() => addEntry({ qty: 5, price: 550, paid: false })}>
        Add 5 at 550
      </Button>
    </div>
  );
}
