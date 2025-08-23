"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold font-display text-primary-foreground tracking-wider">
          Chicken Barrons
        </Link>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          {showSearch ? <X size={18} className="text-gray-800"/> : <Search size={18} className="text-gray-800" />}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          showSearch ? "max-h-20" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-3 mt-2">
          <Input
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>
    </header>
  );
}
