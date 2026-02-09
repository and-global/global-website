"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

type Props = {
  locale: string;
};

const localeLabels: Record<string, string> = {
  en: "English",
  ja: "日本語",
  es: "Español",
};

export default function LanguageSwitcher({ locale }: Props) {
  const pathname = usePathname();
  const t = useTranslations("common");

  const switchedPath = (targetLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = targetLocale;
    return segments.join("/");
  };

  const otherLocales = routing.locales.filter((l) => l !== locale);

  return (
    <div className="inline-flex items-center gap-1">
      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
        />
      </svg>
      {otherLocales.map((targetLocale) => (
        <Link
          key={targetLocale}
          href={switchedPath(targetLocale)}
          className="px-2 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          aria-label={`Switch to ${localeLabels[targetLocale]}`}
        >
          {localeLabels[targetLocale]}
        </Link>
      ))}
    </div>
  );
}
