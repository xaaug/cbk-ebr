"use client";

import { useParams } from "next/navigation";
import { EntriesHistory } from "@/components/(history)/EntriesHistory";
import DateSummary from "@/components/(history)/DateSummary";
import HotelHeader from "@/components/HotelHeader";

export default function HistoryDayPage() {
  const { date } = useParams();
  const decodedDate = decodeURIComponent(date as string);

  return (
    <>
      <div className="pb-30">
        <HotelHeader title={decodedDate} />
        <DateSummary date={decodedDate} />
        <EntriesHistory date={decodedDate} />
      </div>
    </>
  );
}
