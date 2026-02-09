import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::page.page", {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
    },
  },
});
