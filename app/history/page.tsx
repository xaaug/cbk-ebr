import CardButton from "@/components/CardButton";
import SectionHeader from "@/components/SectionHeader";
import { ReceiptText, ShoppingBag } from "lucide-react";

export default function HistoryPage() {
  return (
<>
<SectionHeader title="History" />
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
<CardButton label="Sales" icon={ReceiptText} href="/history/sales"/>
<CardButton label="Purchases" icon={ShoppingBag} href="/history/purchases"/>
</div >
</>
  )
}