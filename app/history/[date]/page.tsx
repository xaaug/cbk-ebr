
"use client";

import { useParams } from "next/navigation";
import { EntriesHistory } from "@/components/(history)/EntriesHistory";
import  DateSummary from "@/components/(history)/DateSummary";

export default function HistoryDayPage() {
  const { date } = useParams(); 
  const decodedDate = decodeURIComponent(date as string);



  return (
    <>
    <DateSummary date={decodedDate} />
    <EntriesHistory date={decodedDate} /></>
  );
}
