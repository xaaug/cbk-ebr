"use client";

import { useParams } from "next/navigation";
import { EntriesHistory } from "@/components/(history)/EntriesHistory";
import DateSummary from "@/components/(history)/DateSummary";
import SectionHeader from "@/components/SectionHeader";

export default function HistoryDayPage() {
  const { date } = useParams();
  const decodedDate = decodeURIComponent(date as string);

  return (
    <>
      <div className="pb-30">
        <SectionHeader title={decodedDate} />
        <DateSummary date={decodedDate} />
        <EntriesHistory date={decodedDate} />
      </div>
    </>
  );
}
