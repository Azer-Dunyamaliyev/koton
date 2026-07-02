import express from "express";
import authMiddleware from "../middleware/auth.js";
import { addWishlist, deleteWishListItem, getWishList, wishlistStatus } from "../controller/controller.js";

export const router = express.Router()

router.route('/').get(authMiddleware,getWishList).post(authMiddleware,addWishlist)
router.route('/delete/:productId').delete(authMiddleware,deleteWishListItem)
router.route("/:productId").get(authMiddleware,wishlistStatus)
export default router