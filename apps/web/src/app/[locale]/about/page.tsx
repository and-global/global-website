import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPageBySlug, getStrapiImageUrl } from "@/lib/strapi";
import Container from "@/components/ui/Container";
import Image from "next/image";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const page = await getPageBySlug("about", locale).catch(() => null);

  return {
    title: page?.seo?.metaTitle || t("title"),
    description: page?.seo?.metaDescription || undefined,
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  let page: Awaited<ReturnType<typeof getPageBySlug>> = null;
  try {
    page = await getPageBySlug("about", locale);
  } catch {
    // Strapi may not be available
  }

  return (
    <section className="py-12">
      {/* Hero */}
      {page?.heroImage && (
        <div className="relative h-64 md:h-96 mb-12">
          <Image
            src={getStrapiImageUrl(page.heroImage.url)}
            alt={page.heroImage.alternativeText || page.heroTitle || ""}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {page.heroTitle || t("title")}
              </h1>
              {page.heroSubtitle && (
                <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                  {page.heroSubtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Container>
        {!page?.heroImage && (
          <h1 className="text-3xl font-bold mb-8">{page?.title || t("title")}</h1>
        )}

        {page?.content ? (
          <div
            className="prose prose-lg prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <div className="prose prose-lg prose-gray max-w-none">
            <p>
              {locale === "ja"
                ? "株式会社エー・アンド・デイは、計測・計量機器、医療機器、自動車関連製品の開発・製造・販売を行うグローバル企業です。"
                : "A&D Company, Ltd. is a global manufacturer specializing in precision measuring instruments, medical devices, and automotive testing products."}
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
