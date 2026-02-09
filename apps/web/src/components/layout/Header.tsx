"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getStrapiImageUrl } from "@/lib/strapi";
import LanguageSwitcher from "./LanguageSwitcher";
import type { SiteSetting } from "@/lib/types";

type Props = {
  locale: string;
  siteSettings: SiteSetting | null;
};

export default function Header({ locale, siteSettings }: Props) {
  const t = useTranslations("common");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t("home"), href: `/${locale}` },
    { label: t("products"), href: `/${locale}/products` },
    { label: t("about"), href: `/${locale}/about` },
    { label: t("contact"), href: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            {siteSettings?.logo ? (
              <Image
                src={getStrapiImageUrl(siteSettings.logo.url)}
                alt={siteSettings.siteName || "A&D"}
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            ) : (
              <Image
                src="/logo-blue.png"
                alt="A&D Company"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-brand-blue transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} />

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-blue-light hover:text-brand-blue rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
