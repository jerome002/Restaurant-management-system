import Ingredient from "../models/Ingredient.js";

// Add ingredient
export const addIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json(ingredient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all ingredients
export const getIngredients = async (req, res) => {
  try {
    const list = await Ingredient.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update ingredient
export const updateIngredient = async (req, res) => {
  try {
    const updated = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete ingredient
export const deleteIngredient = async (req, res) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.id);
    res.json({ message: "Ingredient deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
