import { MeiliSearch } from "meilisearch";

const MEILI_HOST =
  process.env.NEXT_PUBLIC_MEILI_HOST || "http://localhost:7700";
const MEILI_SEARCH_KEY = process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY || "";

export const searchClient = new MeiliSearch({
  host: MEILI_HOST,
  apiKey: MEILI_SEARCH_KEY,
});

export interface ProductSearchResult {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  modelNumber?: string;
  category?: string;
  categorySlug?: string;
  locale: string;
}

export async function searchProducts(
  query: string,
  locale: string,
  options?: {
    limit?: number;
    offset?: number;
    category?: string;
  }
): Promise<{
  hits: ProductSearchResult[];
  totalHits: number;
  processingTimeMs: number;
}> {
  const filter: string[] = [`locale = "${locale}"`];
  if (options?.category) {
    filter.push(`categorySlug = "${options.category}"`);
  }

  const result = await searchClient.index("product").search<ProductSearchResult>(query, {
    limit: options?.limit || 20,
    offset: options?.offset || 0,
    filter,
    attributesToHighlight: ["name", "shortDescription"],
    highlightPreTag: "<mark>",
    highlightPostTag: "</mark>",
  });

  return {
    hits: result.hits,
    totalHits: result.estimatedTotalHits || 0,
    processingTimeMs: result.processingTimeMs,
  };
}
