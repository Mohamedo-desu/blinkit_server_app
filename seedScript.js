import "dotenv/config";
import mongoose from "mongoose";
import { categories, products } from "./seedData.js";
import { Category, Product } from "./src/models/index.js";

async function populateDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");

    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoryDocs = await Category.insertMany(categories);

    const categoryMap = categoryDocs.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    const productWithCategoryIds = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    await Product.insertMany(productWithCategoryIds);

    console.log("DB populated ✅");
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.connection.close();
  }
}

populateDB();
