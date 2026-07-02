import express from "express";
import {
  addProduct,
  deleteProducts,
  getAllNameProducts,
  getAllProducts,
  getProducts,
  updateProduct,
} from "../controller/controller.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(addProduct);
router.route("/:name").get(getAllNameProducts);
router.route("/:name/:category").get(getProducts);
router.route("/:name/:category/:subcategory").get(getProducts);
router.route("/:id").put(updateProduct);
router.route("/:id").delete(deleteProducts);
export default router;
