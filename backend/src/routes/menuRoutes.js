import express from "express";
import { createMenuItem, getMenuItems, updateMenuItem, deleteMenuItem } from "../controllers/menuController.js";

const router = express.Router();

router.post("/", createMenuItem);
router.get("/", getMenuItems);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
