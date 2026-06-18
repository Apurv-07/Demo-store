"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleTopicClick = (topic: string) => {
    router.push(`/products?search=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
      <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-200 tracking-wide uppercase">
        <Sparkles size={14} className="text-amber-400" />
        <span>Introducing DummyJSON Premium Line</span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-white leading-tight">
        Crafted Elegance. <br />
        <span className="text-slate-400 font-medium">Engineered for perfection.</span>
      </h1>

      <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
        Discover a tailored ecosystem of curated lifestyle commodities, professional electronics, and sensory beauty. Seamless, real-time dispatch from state-of-the-art transit nodes.
      </p>

      {/* Search container */}
      <form onSubmit={handleSearchSubmit} className="w-full max-w-lg mt-4">
        <div className="relative flex items-center p-1.5 bg-white rounded-2xl shadow-lg border border-gray-100">
          <span className="pl-4 pr-2 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search thousands of handpicked physical goods..."
            className="w-full bg-transparent text-gray-900 border-none outline-none text-xs placeholder-gray-400 py-3 block focus:ring-0 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl tracking-wide transition-all cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {/* Trending suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
        <span className="text-xs text-slate-400 font-medium font-sans">Trending topics:</span>
        {["Fragrances", "Laptops", "Groceries", "Skincare"].map((item) => (
          <button
            key={item}
            onClick={() => handleTopicClick(item)}
            className="px-3.5 py-1.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700/40 transition-all cursor-pointer"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
