import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getProductBySlug,
  getStrapiImageUrl,
} from "@/lib/strapi";
import Container from "@/components/ui/Container";
import ProductGallery from "@/components/products/ProductGallery";
import ProductSpecifications from "@/components/products/ProductSpecifications";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale).catch(() => null);

  if (!product) return { title: "Product Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: product.seo?.metaTitle || product.name,
    description: product.seo?.metaDescription || product.shortDescription,
    alternates: {
      canonical: product.seo?.canonicalUrl || `${siteUrl}/${locale}/products/${slug}`,
      languages: {
        en: `${siteUrl}/en/products/${slug}`,
        ja: `${siteUrl}/ja/products/${slug}`,
        es: `${siteUrl}/es/products/${slug}`,
      },
    },
    openGraph: {
      title: product.seo?.metaTitle || product.name,
      description: product.seo?.metaDescription || product.shortDescription || "",
      images: product.seo?.ogImage
        ? [{ url: getStrapiImageUrl(product.seo.ogImage.url) }]
        : product.featuredImage
          ? [{ url: getStrapiImageUrl(product.featuredImage.url) }]
          : [],
    },
  };
}

function ProductJsonLd({ product, locale }: { product: Product; locale: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    sku: product.sku,
    mpn: product.modelNumber,
    image: product.featuredImage
      ? `${strapiUrl}${product.featuredImage.url}`
      : undefined,
    url: `${siteUrl}/${locale}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "A&D Company",
    },
    manufacturer: {
      "@type": "Organization",
      name: "A&D Company, Ltd.",
    },
    category: product.category?.name,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  let product: Product | null = null;
  try {
    product = await getProductBySlug(slug, locale);
  } catch {
    // Strapi may not be available
  }

  if (!product) {
    notFound();
  }

  const images = [
    ...(product.featuredImage ? [product.featuredImage] : []),
    ...(product.gallery || []),
  ];

  // Group specifications by group name
  const specGroups: Record<string, typeof product.specifications> = {};
  for (const spec of product.specifications || []) {
    const group = spec.group || "General";
    if (!specGroups[group]) specGroups[group] = [];
    specGroups[group]!.push(spec);
  }

  return (
    <>
      <ProductJsonLd product={product} locale={locale} />
      <section className="py-12">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-500">
            <a href={`/${locale}`} className="hover:text-brand-blue">
              {locale === "ja" ? "ホーム" : locale === "es" ? "Inicio" : "Home"}
            </a>
            <span className="mx-2">/</span>
            <a href={`/${locale}/products`} className="hover:text-brand-blue">
              {t("title")}
            </a>
            {product.category && (
              <>
                <span className="mx-2">/</span>
                <a
                  href={`/${locale}/products?category=${product.category.slug}`}
                  className="hover:text-brand-blue"
                >
                  {product.category.name}
                </a>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <ProductGallery images={images} productName={product.name} />

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              {product.modelNumber && (
                <p className="text-gray-500 mb-2">
                  <span className="font-medium">{t("modelNumber")}:</span>{" "}
                  {product.modelNumber}
                </p>
              )}
              {product.sku && (
                <p className="text-gray-500 mb-4">
                  <span className="font-medium">{t("sku")}:</span> {product.sku}
                </p>
              )}

              {product.shortDescription && (
                <p className="text-lg text-gray-700 mb-6">
                  {product.shortDescription}
                </p>
              )}

              {product.description && (
                <div
                  className="prose prose-gray max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>
          </div>

          {/* Specifications */}
          {Object.keys(specGroups).length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">{t("specifications")}</h2>
              <ProductSpecifications specGroups={specGroups} />
            </div>
          )}

          {/* Downloads */}
          {product.documents && product.documents.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">{t("downloads")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={
                      doc.file
                        ? getStrapiImageUrl(doc.file.url)
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-blue-light text-brand-blue rounded flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doc.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{doc.type}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
