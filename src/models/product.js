import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    // product name
    type: String,
    required: true,
  },
  image: {
    // product image
    type: String,
    required: true,
  },
  price: {
    // product price
    type: Number,
    required: true,
  },
  discount: {
    // product discount
    type: Number,
  },
  quantity: {
    // product quantity
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
