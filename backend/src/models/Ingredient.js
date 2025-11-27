import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true }, // grams, kg, liters, pieces
  stock: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 10 }
}, { timestamps: true });

export default mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientSchema);
