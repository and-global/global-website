// Strapi response types

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiFile {
  id: number;
  url: string;
  name: string;
  size: number;
  mime: string;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMeta {
  pagination?: StrapiPagination;
}

export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

// Components

export interface Specification {
  id: number;
  label: string;
  value: string;
  unit?: string;
  group?: string;
}

export interface ProductDocument {
  id: number;
  title: string;
  type: "manual" | "datasheet" | "brochure" | "certificate" | "other";
  file?: StrapiFile;
}

export interface SEO {
  id: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: StrapiImage;
  canonicalUrl?: string;
}

// Content types

export interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  modelNumber?: string;
  sku?: string;
  category?: ProductCategory;
  featuredImage?: StrapiImage;
  gallery?: StrapiImage[];
  specifications?: Specification[];
  documents?: ProductDocument[];
  seo?: SEO;
  isFeatured: boolean;
  sortOrder: number;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ProductCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  image?: StrapiImage;
  products?: Product[];
  sortOrder: number;
  locale: string;
}

export interface Page {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content?: string;
  heroImage?: StrapiImage;
  heroTitle?: string;
  heroSubtitle?: string;
  seo?: SEO;
  locale: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface Navigation {
  id: number;
  mainMenu: NavigationItem[];
  footerMenu: NavigationItem[];
  locale: string;
}

export interface SiteSetting {
  id: number;
  siteName: string;
  logo?: StrapiImage;
  favicon?: StrapiImage;
  footerText?: string;
  copyright?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    facebook?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  locale: string;
}
