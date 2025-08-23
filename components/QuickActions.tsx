"use client";

import { PlusCircle, Building2, ShoppingCart, FileText } from "lucide-react";

const actions = [
  { label: "Add Sale", icon: PlusCircle, href: "/sales/add" },
  { label: "Hotels", icon: Building2, href: "/hotels" },
  { label: "Purchase", icon: ShoppingCart, href: "/purchases/add" },
  { label: "Invoices", icon: FileText, href: "/invoices" },
];

export default function QuickActions() {
  return (
    <>
      <h2 className="text-lg font-serif font-semibold mb-4 mt-6">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        {actions.map(({ label, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-6 hover:shadow-md hover:border-gray-300 active:scale-95 transition"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition">
              <Icon className="w-6 h-6" />
            </div>
            <span className="mt-3 text-sm font-sans font-medium text-gray-700 group-hover:text-gray-900">
              {label}
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
