"use client";

import { useState } from "react";
import Image from "next/image";
import { getStrapiImageUrl } from "@/lib/strapi";
import type { StrapiImage } from "@/lib/types";

type Props = {
  images: StrapiImage[];
  productName: string;
};

export default function ProductGallery({ images, productName }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center text-gray-400">
        No image available
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
        <Image
          src={getStrapiImageUrl(selectedImage.url)}
          alt={selectedImage.alternativeText || productName}
          fill
          className="object-contain p-6"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                index === selectedIndex
                  ? "border-blue-600"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={getStrapiImageUrl(image.url)}
                alt={image.alternativeText || `${productName} - ${index + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
