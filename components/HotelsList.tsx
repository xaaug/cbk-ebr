"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Building2 } from "lucide-react";
import CardButton from "./CardButton";

export default function HotelGrid() {
  const hotels = useQuery(api.hotels.getHotels);

  if (hotels === undefined) {
    return <p>Loading hotels...</p>;
  }

  if (hotels.length === 0) {
    return <p className="text-muted-foreground">No hotels yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {hotels.map((hotel) => (
        <div key={hotel._id}>
          <CardButton label={hotel.name} icon={Building2} href={`/hotels/${hotel._id}`} />
        </div>
      ))}
    </div>
  );
}
