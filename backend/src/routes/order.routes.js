import express from "express";
import { createOrder, completeOrder, getOrders, updateOrderItemStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.put("/:orderId/complete", completeOrder);
router.put("/:orderId/items/:itemId/status", updateOrderItemStatus);

export default router;
