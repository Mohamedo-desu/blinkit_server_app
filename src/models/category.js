import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    // Category name
    type: String,
    required: true,
  },
  image: {
    // Category image
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;
