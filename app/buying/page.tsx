"use client";

import { AddEntryForm } from "@/components/AddForm";
import { DayTotal } from "@/components/DayTotal";
import { EntriesTable } from "@/components/EntriesTable";

export default function Page() {

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 pb-20">
        <DayTotal />
        <AddEntryForm />
        <EntriesTable />
      </div>
    </>
  );
}
