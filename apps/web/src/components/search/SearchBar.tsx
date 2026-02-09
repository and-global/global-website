"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { searchProducts, type ProductSearchResult } from "@/lib/meilisearch";
import SearchResults from "./SearchResults";

type Props = {
  locale: string;
};

export default function SearchBar({ locale }: Props) {
  const t = useTranslations("common");
  const tp = useTranslations("products");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      try {
        const res = await searchProducts(query, locale, { limit: 8 });
        setResults(res.hits);
        setTotalHits(res.totalHits);
        setIsOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, locale]);

  return (
    <div ref={containerRef} className="relative w-full md:w-80">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {isOpen && (
        <SearchResults
          results={results}
          totalHits={totalHits}
          query={query}
          locale={locale}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
