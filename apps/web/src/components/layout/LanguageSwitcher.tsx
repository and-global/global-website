"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Props = {
  locale: string;
};

export default function LanguageSwitcher({ locale }: Props) {
  const pathname = usePathname();
  const t = useTranslations("common");

  // Replace the current locale prefix in the path
  const switchedPath = (targetLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = targetLocale;
    return segments.join("/");
  };

  const otherLocale = locale === "en" ? "ja" : "en";
  const otherLabel = locale === "en" ? t("japanese") : t("english");

  return (
    <Link
      href={switchedPath(otherLocale)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      aria-label={`Switch to ${otherLabel}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
        />
      </svg>
      {otherLabel}
    </Link>
  );
}
