import mongoose from "mongoose";

// Schema for individual items in an order
const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["queued", "preparing", "ready", "served"], default: "queued" }
});

// Main order schema
const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  tableNumber: { type: Number, required: true },
  orderType: { type: String, enum: ["dine-in", "takeaway", "delivery"], default: "dine-in" },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
