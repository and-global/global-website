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

  // If Strapi has content for this page, render it
  if (page?.content) {
    return (
      <section className="py-12">
        {page.heroImage && (
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
          {!page.heroImage && (
            <h1 className="text-3xl font-bold mb-8">{page.title || t("title")}</h1>
          )}
          <div
            className="prose prose-lg prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </Container>
      </section>
    );
  }

  // Fallback: render company profile from translations
  return (
    <section className="py-12">
      {/* Page Header */}
      <div className="bg-brand-blue text-white py-16 mb-12">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold">{t("title")}</h1>
        </Container>
      </div>

      <Container>
        {/* Corporate Vision */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-blue mb-4">
            {t("corporateVision")}
          </h2>
          <div className="bg-gray-50 rounded-lg p-8 border-l-4 border-brand-blue">
            <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
              {t("vision")}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {t("visionDescription")}
            </p>
          </div>
        </div>

        {/* Company Profile Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-blue mb-6">
            {t("companyProfile")}
          </h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/4 align-top">
                    {t("companyNameLabel")}
                  </th>
                  <td className="px-6 py-4 text-gray-800">
                    <p className="font-medium">{t("companyName")}</p>
                    <p className="text-sm text-gray-500 mt-1">{t("companyNameOrigin")}</p>
                  </td>
                </tr>
                <tr>
                  <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/4 align-top">
                    {t("headquartersLabel")}
                  </th>
                  <td className="px-6 py-4 text-gray-800">
                    {t("headquarters")}
                  </td>
                </tr>
                <tr>
                  <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/4 align-top">
                    {t("representativeLabel")}
                  </th>
                  <td className="px-6 py-4 text-gray-800">
                    {t("representative")}
                  </td>
                </tr>
                <tr>
                  <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/4 align-top">
                    {t("businessLabel")}
                  </th>
                  <td className="px-6 py-4 text-gray-800">
                    {t("business")}
                  </td>
                </tr>
                <tr>
                  <th className="bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/4 align-top">
                    {t("qualityLabel")}
                  </th>
                  <td className="px-6 py-4 text-gray-800">
                    <ul className="space-y-1">
                      <li>{t("qualityISO9001")}</li>
                      <li>{t("qualityISO13485")}</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Presence */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-blue mb-4">
            {t("globalPresence")}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {t("globalDescription")}
          </p>
        </div>
      </Container>
    </section>
  );
}
