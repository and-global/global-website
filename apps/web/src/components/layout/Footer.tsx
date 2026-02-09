import Link from "next/link";
import { useTranslations } from "next-intl";
import type { SiteSetting } from "@/lib/types";

type Props = {
  locale: string;
  siteSettings: SiteSetting | null;
};

export default function Footer({ locale, siteSettings }: Props) {
  const t = useTranslations("common");
  const year = new Date().getFullYear();

  const navItems = [
    { label: t("home"), href: `/${locale}` },
    { label: t("products"), href: `/${locale}/products` },
    { label: t("about"), href: `/${locale}/about` },
    { label: t("contact"), href: `/${locale}/contact` },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              {siteSettings?.siteName || (locale === "ja" ? "株式会社エー・アンド・デイ" : "A&D Company, Ltd.")}
            </h3>
            {siteSettings?.footerText && (
              <p className="text-sm">{siteSettings.footerText}</p>
            )}
            {siteSettings?.contactEmail && (
              <p className="text-sm mt-2">
                <a href={`mailto:${siteSettings.contactEmail}`} className="hover:text-white">
                  {siteSettings.contactEmail}
                </a>
              </p>
            )}
            {siteSettings?.contactPhone && (
              <p className="text-sm mt-1">{siteSettings.contactPhone}</p>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              {locale === "ja" ? "リンク" : "Links"}
            </h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          {siteSettings?.socialLinks && (
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                {locale === "ja" ? "ソーシャル" : "Social"}
              </h3>
              <div className="flex gap-4">
                {siteSettings.socialLinks.linkedin && (
                  <a
                    href={siteSettings.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    LinkedIn
                  </a>
                )}
                {siteSettings.socialLinks.twitter && (
                  <a
                    href={siteSettings.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    Twitter
                  </a>
                )}
                {siteSettings.socialLinks.youtube && (
                  <a
                    href={siteSettings.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label="YouTube"
                  >
                    YouTube
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center">
          {siteSettings?.copyright || t("copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
