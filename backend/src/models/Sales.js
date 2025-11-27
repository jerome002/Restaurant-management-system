import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  amount: Number,
  paymentMethod: String,
}, { timestamps: true });

export default mongoose.model("Sales", salesSchema);
