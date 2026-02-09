import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/strapi";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@/app/globals.css";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: {
      default: t("defaultTitle"),
      template: `%s | ${t("defaultTitle")}`,
    },
    description: t("defaultDescription"),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        ja: `${siteUrl}/ja`,
        es: `${siteUrl}/es`,
      },
    },
    openGraph: {
      siteName: locale === "ja" ? "株式会社エー・アンド・デイ" : "A&D Company, Ltd.",
      locale: locale === "ja" ? "ja_JP" : locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ja" | "es")) {
    notFound();
  }

  const messages = await getMessages();

  let siteSettings = null;
  try {
    siteSettings = await getSiteSettings(locale);
  } catch {
    // Strapi may not be available during build
  }

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col bg-white text-gray-900 antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} siteSettings={siteSettings} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} siteSettings={siteSettings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
