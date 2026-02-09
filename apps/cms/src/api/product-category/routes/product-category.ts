import { factories } from "@strapi/strapi";

export default factories.createCoreRouter(
  "api::product-category.product-category",
  {
    config: {
      find: {
        middlewares: [],
      },
      findOne: {
        middlewares: [],
      },
    },
  }
);
