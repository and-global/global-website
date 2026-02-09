import qs from "qs";
import type {
  Product,
  ProductCategory,
  Page,
  Navigation,
  SiteSetting,
  StrapiResponse,
} from "./types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || "";

async function fetchStrapi<T>(
  path: string,
  query?: Record<string, unknown>,
  options?: { revalidate?: number }
): Promise<StrapiResponse<T>> {
  const queryString = query ? `?${qs.stringify(query, { encodeValuesOnly: true })}` : "";
  const url = `${STRAPI_URL}/api${path}${queryString}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    next: {
      revalidate: options?.revalidate ?? Number(process.env.NEXT_REVALIDATE_SECONDS || 60),
    },
  });

  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status} ${res.statusText} - ${url}`);
  }

  return res.json();
}

// Products

export async function getProducts(
  locale: string,
  params?: {
    category?: string;
    featured?: boolean;
    page?: number;
    pageSize?: number;
  }
): Promise<StrapiResponse<Product[]>> {
  const filters: Record<string, unknown> = {};
  if (params?.category) {
    filters.category = { slug: { $eq: params.category } };
  }
  if (params?.featured) {
    filters.isFeatured = { $eq: true };
  }

  return fetchStrapi<Product[]>("/products", {
    locale,
    filters,
    populate: {
      featuredImage: { fields: ["url", "alternativeText", "width", "height"] },
      category: { fields: ["name", "slug"] },
      seo: { populate: "*" },
    },
    sort: ["sortOrder:asc", "name:asc"],
    pagination: {
      page: params?.page || 1,
      pageSize: params?.pageSize || 25,
    },
  });
}

export async function getProductBySlug(
  slug: string,
  locale: string
): Promise<Product | null> {
  const res = await fetchStrapi<Product[]>("/products", {
    locale,
    filters: { slug: { $eq: slug } },
    populate: {
      featuredImage: { fields: ["url", "alternativeText", "width", "height", "formats"] },
      gallery: { fields: ["url", "alternativeText", "width", "height", "formats"] },
      category: { fields: ["name", "slug"] },
      specifications: true,
      documents: { populate: { file: { fields: ["url", "name", "size", "mime"] } } },
      seo: { populate: { ogImage: { fields: ["url", "width", "height"] } } },
    },
  });

  return res.data?.[0] || null;
}

export async function getAllProductSlugs(): Promise<
  { slug: string; locale: string }[]
> {
  const slugs: { slug: string; locale: string }[] = [];

  for (const locale of ["en", "ja"]) {
    const res = await fetchStrapi<Product[]>("/products", {
      locale,
      fields: ["slug"],
      pagination: { pageSize: 100 },
    });
    for (const product of res.data || []) {
      slugs.push({ slug: product.slug, locale });
    }
  }

  return slugs;
}

// Product Categories

export async function getProductCategories(
  locale: string
): Promise<StrapiResponse<ProductCategory[]>> {
  return fetchStrapi<ProductCategory[]>("/product-categories", {
    locale,
    populate: {
      image: { fields: ["url", "alternativeText", "width", "height"] },
    },
    sort: ["sortOrder:asc", "name:asc"],
  });
}

// Pages

export async function getPageBySlug(
  slug: string,
  locale: string
): Promise<Page | null> {
  const res = await fetchStrapi<Page[]>("/pages", {
    locale,
    filters: { slug: { $eq: slug } },
    populate: {
      heroImage: { fields: ["url", "alternativeText", "width", "height"] },
      seo: { populate: { ogImage: { fields: ["url", "width", "height"] } } },
    },
  });

  return res.data?.[0] || null;
}

// Navigation

export async function getNavigation(
  locale: string
): Promise<Navigation | null> {
  const res = await fetchStrapi<Navigation>("/navigation", {
    locale,
  });

  return res.data || null;
}

// Site Settings

export async function getSiteSettings(
  locale: string
): Promise<SiteSetting | null> {
  const res = await fetchStrapi<SiteSetting>("/site-setting", {
    locale,
    populate: {
      logo: { fields: ["url", "alternativeText", "width", "height"] },
      favicon: { fields: ["url"] },
    },
  });

  return res.data || null;
}

// Helper to get full image URL
export function getStrapiImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}
