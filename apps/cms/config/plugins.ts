export default ({ env }) => ({
  i18n: {
    enabled: true,
    config: {
      defaultLocale: "en",
      locales: ["en", "ja"],
    },
  },
  meilisearch: {
    enabled: true,
    config: {
      host: env("MEILI_HOST", "http://127.0.0.1:7700"),
      apiKey: env("MEILI_MASTER_KEY", ""),
      product: {
        indexName: "product",
        transformEntry({ entry }) {
          return {
            id: entry.id,
            name: entry.name,
            slug: entry.slug,
            shortDescription: entry.shortDescription,
            description: entry.description,
            modelNumber: entry.modelNumber,
            sku: entry.sku,
            isFeatured: entry.isFeatured,
            locale: entry.locale,
            category: entry.category?.name || null,
            categorySlug: entry.category?.slug || null,
          };
        },
        settings: {
          searchableAttributes: [
            "name",
            "shortDescription",
            "description",
            "modelNumber",
            "sku",
          ],
          filterableAttributes: ["category", "categorySlug", "locale", "isFeatured"],
          sortableAttributes: ["name", "sortOrder"],
        },
      },
    },
  },
  upload: {
    config: {
      sizeLimit: 50 * 1024 * 1024, // 50MB
    },
  },
});
