"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Building2 } from "lucide-react";
import CardButton from "./CardButton";
import { Skeleton } from "@/components/ui/skeleton";

export default function HotelGrid() {
  const hotels = useQuery(api.hotels.getHotels);

  if (hotels === undefined) {
    // Render skeletons instead of plain text
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-md bg-gray-200" />
        ))}
      </div>
    );
  }

  if (hotels.length === 0) {
    return <p className="text-muted-foreground mt-4">No hotels yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {hotels.map((hotel) => (
        <div key={hotel._id}>
          <CardButton
            label={hotel.name}
            icon={Building2}
            href={`/hotels/${hotel._id}`}
          />
        </div>
      ))}
    </div>
  );
}
