import DatesCard from "@/components/(history)/DatesCard";
import SectionHeader from "@/components/SectionHeader";

export default function PurchasesHistory() {
    return (
        <>
       <div className="flex flex-col gap-8">
       <SectionHeader title="Purchases History"/>
       <DatesCard /></div></>
    )
}

// TODO: Show specific dates history