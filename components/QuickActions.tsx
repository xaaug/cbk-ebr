"use client";

import { PlusCircle, Building2, ShoppingCart, FileText } from "lucide-react";

const actions = [
  { label: "Add Sale", icon: PlusCircle, href: "/sales" },
  { label: "Hotels", icon: Building2, href: "/hotels" },
  { label: "Purchase", icon: ShoppingCart, href: "/purchase" },
  { label: "Invoices", icon: FileText, href: "/invoices" },
];

export default function QuickActions() {
  return (
   <>
   <h2 className=" font-serif font-semibold mb-4 mt-6">Quick Actions</h2>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
      {actions.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          className="group flex  items-center justify- rounded border border-gray-200 shadow-sm p-6 bg-white hover:shadow-lg hover:border-gray-300 active:scale-95 transition gap-3"
        >
            <Icon className="w-5 h-5 text-primary" />
          <span className="text-sm font-serif font-semibold text-gray-700 group-hover:text-gray-900">
            {label}
          </span>
        </a>
      ))}
    </div></>
  );
}
