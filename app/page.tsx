"use client";

import GreetingsCard from "@/components/GreetingsCard";
import QuickActions from "@/components/QuickActions";
import { TodaySalesList } from "@/components/TodaySalesList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <GreetingsCard />
      <QuickActions />
      <div className="mb-24">
        <div className="flex justify-between items-center mt-6 mb-4">
          <h2 className="text-lg font-serif font-semibold ">
            Recent Sales
          </h2>
          <div className="flex justify-end">
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/sales">View All</Link>
            </Button>
          </div>
        </div>
        <TodaySalesList />
      </div>
    </>
  );
}
