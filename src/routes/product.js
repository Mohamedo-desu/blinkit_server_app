import { getAllCategories } from "../controllers/product/category.js";
import { getProductsByCategoryId } from "../controllers/product/product.js";

export const categoryRoutes = async (fastify) => {
  fastify.get("/categories", getAllCategories);
};
export const productRoutes = async (fastify) => {
  fastify.get("/products/:categoryId", getProductsByCategoryId);
};
