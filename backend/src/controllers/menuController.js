import MenuItem from "../models/MenuItem.js";

// Create menu item
export const createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all menu items
export const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().populate("ingredients.ingredientId");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
