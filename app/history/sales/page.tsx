import SectionHeader from "@/components/SectionHeader";
import { SalesDatesList } from "./_components/SalesDatesList";

export default function SalesHistory() {
  return (
    <>
      <div className="flex flex-col gap-8">
        <SectionHeader title="Sales History" />
        <SalesDatesList />
      </div>
    </>
  );
}

// TODO: Show specific dates history
