"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Store, Clock } from "lucide-react"; // import icons

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Sales", href: "/sales", icon: ShoppingCart },
  { label: "Purchase", href: "/purchase", icon: Store },
  { label: "History", href: "/history", icon: Clock },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg m-3 rounded py-1">
      <ul className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center text-xs font-serif ${
                  active ? "text-primary font-semibold" : "text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
