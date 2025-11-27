import express from "express";
import Ingredient from "../models/Ingredient.js";

const router = express.Router();

/**
 * @route   GET /api/ingredients
 * @desc    Fetch all ingredients
 */
router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    res.json({ success: true, data: ingredients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   POST /api/ingredients
 * @desc    Add new ingredient
 */
router.post("/", async (req, res) => {
  try {
    const ingredient = new Ingredient(req.body);
    const saved = await ingredient.save();

    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @route   PUT /api/ingredients/:id
 * @desc    Update ingredient
 */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * @route   DELETE /api/ingredients/:id
 * @desc    Delete ingredient
 */
router.delete("/:id", async (req, res) => {
  try {
    const removed = await Ingredient.findByIdAndDelete(req.params.id);

    res.json({ success: true, data: removed });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
