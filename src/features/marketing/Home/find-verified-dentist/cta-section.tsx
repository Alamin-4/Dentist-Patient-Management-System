"use client";

import SearchBar from "../Hero/search-bar";
import SearchTags from "./search-tags";

export default function CtaSearchSection() {
  return (
    <section style={{ backgroundImage: `url('/images/cta.png')`, backgroundPosition: "center", backgroundSize: "cover" }} className="relative w-full py-10 sm:py-16 md:py-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-320 w-11/12 mx-auto flex flex-col items-center text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#F2C467] bg-[#CDA555]/32 backdrop-blur-md mb-4 sm:mb-6">
          <div className="flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded-full bg-[#17B26A]">
            <span className="text-[10px] text-white italic">✓</span>
          </div>
          <span className="text-white text-xs sm:text-sm font-medium">
            Trusted by Dentists Worldwide
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-bold text-white mb-6 sm:mb-8 tracking-tight">
          Find Verified Dentist
        </h2>

        <div className="w-full max-w-3xl mx-auto">
          <SearchBar />
        </div>

        <SearchTags />
      </div>
    </section>
  );
}
