import Link from "next/link";
import Image from "next/image";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { Product } from "@/lib/types";

type Props = {
  product: Product;
  locale: string;
};

export default function ProductCard({ product, locale }: Props) {
  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      {product.featuredImage && (
        <div className="relative h-48 bg-gray-50">
          <Image
            src={getStrapiImageUrl(product.featuredImage.url)}
            alt={product.featuredImage.alternativeText || product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        {product.category && (
          <span className="text-xs font-medium text-brand-blue uppercase tracking-wide">
            {product.category.name}
          </span>
        )}
        <h3 className="text-lg font-semibold mt-1 group-hover:text-brand-blue transition-colors">
          {product.name}
        </h3>
        {product.modelNumber && (
          <p className="text-sm text-gray-500 mt-1">{product.modelNumber}</p>
        )}
        {product.shortDescription && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {product.shortDescription}
          </p>
        )}
      </div>
    </Link>
  );
}
