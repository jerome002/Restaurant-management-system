import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import Ingredient from "../models/Ingredient.js";

/**
 * CREATE ORDER
 * - Checks inventory but DOES NOT reduce stock yet
 * - Items start with status "queued"
 */
export const createOrder = async (req, res) => {
  try {
    const { items, tableNumber, orderType, createdBy } = req.body;
    let totalAmount = 0;
    const detailedItems = [];

    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId).populate("ingredients.ingredientId");
      if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

      let sufficientStock = true;

      // Check stock for all ingredients
      menuItem.ingredients.forEach(ing => {
        const stock = ing.ingredientId.stock;
        const required = ing.quantityRequired * item.quantity;
        if (stock < required) sufficientStock = false;
      });

      if (!sufficientStock) {
        return res.status(400).json({ message: `Insufficient stock for ${menuItem.name}` });
      }

      // Calculate price (base + modifiers)
      let modifiersTotal = 0;
      if (item.modifiers) {
        item.modifiers.forEach(mod => {
          modifiersTotal += mod.price || 0;
        });
      }
      const price = (menuItem.price + modifiersTotal) * item.quantity;
      totalAmount += price;

      detailedItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price,
        status: "queued",
        modifiers: item.modifiers || []
      });
    }

    const order = await Order.create({
      items: detailedItems,
      tableNumber,
      orderType,
      totalAmount,
      createdBy
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * COMPLETE ORDER
 * - Updates order.status to "completed"
 * - Reduces inventory for all items
 */
export const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("items.menuItemId");

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status === "completed") return res.status(400).json({ message: "Order already completed" });

    // Reduce stock
    for (const orderItem of order.items) {
      const menuItem = await MenuItem.findById(orderItem.menuItemId._id).populate("ingredients.ingredientId");

      for (const ing of menuItem.ingredients) {
        const ingredient = await Ingredient.findById(ing.ingredientId._id);
        const totalRequired = ing.quantityRequired * orderItem.quantity;

        if (ingredient.stock < totalRequired) {
          return res.status(400).json({ message: `Not enough stock for ${ingredient.name}` });
        }

        ingredient.stock -= totalRequired;
        await ingredient.save();
      }
    }

    // Mark order completed
    order.status = "completed";
    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET ORDERS
 */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.menuItemId")
      .populate("createdBy")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * UPDATE ORDER ITEM STATUS (queued → preparing → ready → served)
 */
export const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Order item not found" });

    item.status = status;
    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
