import { getTranslations } from "next-intl/server";
import { getProducts, getProductCategories, getStrapiImageUrl } from "@/lib/strapi";
import Hero from "@/components/ui/Hero";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import Image from "next/image";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "common" });

  let categories: Awaited<ReturnType<typeof getProductCategories>>["data"] = [];
  let featuredProducts: Awaited<ReturnType<typeof getProducts>>["data"] = [];

  try {
    const [categoriesRes, productsRes] = await Promise.all([
      getProductCategories(locale),
      getProducts(locale, { featured: true, pageSize: 6 }),
    ]);
    categories = categoriesRes.data || [];
    featuredProducts = productsRes.data || [];
  } catch {
    // Strapi may not be available during build
  }

  return (
    <>
      <Hero title={t("heroTitle")} subtitle={t("heroSubtitle")} locale={locale} />

      {/* Product Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <Container>
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("categoriesTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${locale}/products?category=${category.slug}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {category.image && (
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={getStrapiImageUrl(category.image.url)}
                        alt={category.image.alternativeText || category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-blue transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold">{t("featuredTitle")}</h2>
              <Link
                href={`/${locale}/products`}
                className="text-brand-blue hover:text-brand-blue-dark font-medium"
              >
                {tc("viewAll")} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
