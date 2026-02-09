import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ProductSearchResult } from "@/lib/meilisearch";

type Props = {
  results: ProductSearchResult[];
  totalHits: number;
  query: string;
  locale: string;
  onClose: () => void;
};

export default function SearchResults({
  results,
  totalHits,
  query,
  locale,
  onClose,
}: Props) {
  const t = useTranslations("products");

  if (results.length === 0) {
    return (
      <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
        <p className="text-sm text-gray-500">
          {t("noSearchResults", { query })}
        </p>
      </div>
    );
  }

  return (
    <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-500">
        {t("searchResults", { count: totalHits })}
      </div>
      <ul>
        {results.map((result) => (
          <li key={result.id} className="border-b border-gray-100 last:border-0">
            <Link
              href={`/${locale}/products/${result.slug}`}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              <p className="text-sm font-medium text-gray-900">{result.name}</p>
              {result.modelNumber && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {result.modelNumber}
                </p>
              )}
              {result.category && (
                <span className="inline-block mt-1 text-xs text-brand-blue bg-brand-blue-light px-2 py-0.5 rounded-full">
                  {result.category}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {totalHits > results.length && (
        <Link
          href={`/${locale}/products?q=${encodeURIComponent(query)}`}
          className="block px-4 py-3 text-sm text-center text-brand-blue hover:bg-gray-50 border-t"
          onClick={onClose}
        >
          {locale === "ja" ? "すべての結果を見る" : "View all results"} &rarr;
        </Link>
      )}
    </div>
  );
}
