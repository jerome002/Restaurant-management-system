import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String }, // appetizer, main, dessert
  ingredients: [
    {
      ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
      quantityRequired: { type: Number, required: true } // per unit
    }
  ],
  available: { type: Boolean, default: true }
}, { timestamps: true });

// Avoid OverwriteModelError
export default mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);
