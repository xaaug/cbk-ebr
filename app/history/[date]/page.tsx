// app/history/[date]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { EntriesHistory } from "@/components/(history)/EntriesHistory";

export default function HistoryDayPage() {
  const { date } = useParams(); // comes as string with encoding
  const decodedDate = decodeURIComponent(date as string);

  return <EntriesHistory date={decodedDate} />;
}
