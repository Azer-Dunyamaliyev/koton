import express from "express";
import authMiddleware from "../middleware/auth.js";
import { deleteOrder, deleteSuccesOrder, getAllSuccessOrders, getSuccessOrdersByUserId, successOrders, updateOrderStatus, updateSuccesOrders } from "../controller/controller.js";

export const router = express.Router()

router.route('/:userId').get(authMiddleware,getSuccessOrdersByUserId)
router.route('/orders').get(getAllSuccessOrders).post(authMiddleware,successOrders)
router.route("/order/:orderId").put(authMiddleware,updateOrderStatus);
router.route("/order/:orderId").delete(authMiddleware,deleteOrder);
router.route('/update').put(updateSuccesOrders)
router.route('/:id').delete(deleteSuccesOrder)

export default router