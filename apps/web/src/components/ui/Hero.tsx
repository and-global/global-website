import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  locale: string;
};

export default function Hero({ title, subtitle, locale }: Props) {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-blue-100 mt-6 max-w-2xl">
            {subtitle}
          </p>
        )}
        <div className="mt-10 flex gap-4">
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            {locale === "ja" ? "製品を見る" : "View Products"}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            {locale === "ja" ? "お問い合わせ" : "Contact Us"}
          </Link>
        </div>
      </div>
    </section>
  );
}
