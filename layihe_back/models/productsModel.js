import mongoose from "mongoose";

const productsSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    description: { type: String, required: true },
    defaultColor: { type: String, required: false },
    variants: [
      {
        color: { type: String },
        images: [String],
      },
    ],
    images: { type: [String], required: false },
    sizes: [{ type: String }],
    info: {type: String},
},{timestamps:true})

const productsModel = mongoose.model("products",productsSchema)

export default productsModel