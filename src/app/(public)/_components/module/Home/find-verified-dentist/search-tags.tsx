"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tags = ["Veneers", "Implants", "All-on-4", "Teeth Whitening", "Orthodontic Braces"];

export default function SearchTags() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/search?query=${tag}`}
          className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium hover:bg-white/30 transition-all border border-white/10"
        >
          {tag}
        </Link>
      ))}
      <Link 
        href="/procedures" 
        className="flex items-center gap-2 text-[#E3A32A] text-sm font-bold hover:underline ml-2"
      >
        View all <ArrowRight size={16} />
      </Link>
    </div>
  );
}