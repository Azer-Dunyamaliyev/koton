import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    orders: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        selectedColor: { type: String, default: "" },
        selectedSize: { type: String, default: "" },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Shipped", "Delivered", "Cancelled"],
          default: "Pending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const ordersModel = mongoose.model("orders", ordersSchema);

export default ordersModel;
