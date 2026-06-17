import { Router } from "express";
import { createOrder, deleteOrder, getAllOrders, getOrder, updateOrder } from "../controllers/orderController.js";

const orderRouter = Router();

orderRouter.get("/", getAllOrders);
orderRouter.get("/:id", getOrder);
orderRouter.post("/create", createOrder);
orderRouter.delete("/:id", deleteOrder);
orderRouter.put("/:id", updateOrder);

export default orderRouter;
