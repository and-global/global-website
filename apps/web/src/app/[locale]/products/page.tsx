import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getProducts, getProductCategories } from "@/lib/strapi";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import ProductGrid from "@/components/products/ProductGrid";
import SearchBar from "@/components/search/SearchBar";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return {
    title: t("title"),
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, page } = await searchParams;
  const t = await getTranslations({ locale, namespace: "products" });

  let products: Awaited<ReturnType<typeof getProducts>>["data"] = [];
  let categories: Awaited<ReturnType<typeof getProductCategories>>["data"] = [];
  let pagination = { page: 1, pageSize: 25, pageCount: 1, total: 0 };

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      getProducts(locale, {
        category: category || undefined,
        page: page ? parseInt(page) : 1,
      }),
      getProductCategories(locale),
    ]);
    products = productsRes.data || [];
    categories = categoriesRes.data || [];
    if (productsRes.meta.pagination) {
      pagination = productsRes.meta.pagination;
    }
  } catch {
    // Strapi may not be available during build
  }

  return (
    <section className="py-12">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">{t("title")}</h1>
          <SearchBar locale={locale} />
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href={`/${locale}/products`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? "bg-brand-blue text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t("allCategories")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/products?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.slug
                    ? "bg-brand-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {products.length > 0 ? (
          <>
            <ProductGrid>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </ProductGrid>

            {/* Pagination */}
            {pagination.pageCount > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={`/${locale}/products?${category ? `category=${category}&` : ""}page=${p}`}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        p === pagination.page
                          ? "bg-brand-blue text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center py-12">{t("noProducts")}</p>
        )}
      </Container>
    </section>
  );
}
