import React, { useEffect, useState } from "react";
import api from "../services/api";

const POS = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [orders, setOrders] = useState([]);

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu"); // Make sure this matches backend
        setMenuItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMenu();
    fetchOrders();
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      // Populate menu item names if backend didn't populate
      const ordersWithNames = res.data.map(order => ({
        ...order,
        items: order.items.map(item => {
          const menuItem = menuItems.find(mi => mi._id === item.menuItemId) || {};
          return { ...item, menuItemName: menuItem.name || item.menuItemId };
        })
      }));
      setOrders(ordersWithNames);
    } catch (err) {
      console.error(err);
    }
  };

  // Add item to current order
  const addToOrder = (item) => {
    const existing = orderItems.find(oi => oi.menuItemId === item._id);
    if (existing) {
      setOrderItems(orderItems.map(oi =>
        oi.menuItemId === item._id ? { ...oi, quantity: oi.quantity + 1 } : oi
      ));
    } else {
      setOrderItems([...orderItems, { menuItemId: item._id, quantity: 1 }]);
    }
  };

  // Place new order
  const placeOrder = async () => {
    if (!tableNumber) return alert("Please enter table number");

    const user = JSON.parse(localStorage.getItem("user")) || {};
    try {
      await api.post("/orders", {
        items: orderItems,
        tableNumber,
        orderType: "dine-in",
        createdBy: user.id
      });
      setOrderItems([]);
      fetchOrders(); // refresh orders list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error placing order");
    }
  };

  // Complete order and reduce stock
  const completeOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/complete`);
      fetchOrders(); // refresh orders list
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Error completing order");
    }
  };

  return (
    <div>
      <h1>POS</h1>

      {/* Table Number */}
      <input
        type="text"
        placeholder="Table Number"
        value={tableNumber}
        onChange={e => setTableNumber(e.target.value)}
      />

      {/* Menu Items */}
      <h2>Menu</h2>
      {menuItems.length === 0 && <p>Loading menu...</p>}
      {menuItems.map(item => (
        <div key={item._id} style={{ marginBottom: "10px" }}>
          <span>{item.name} - ${item.price}</span>
          <button onClick={() => addToOrder(item)}>Add</button>
        </div>
      ))}

      {/* Current Order Items */}
      <h2>Order Items</h2>
      {orderItems.length === 0 && <p>No items in current order</p>}
      {orderItems.map(oi => {
        const menuItem = menuItems.find(mi => mi._id === oi.menuItemId);
        return (
          <div key={oi.menuItemId}>
            {menuItem?.name || oi.menuItemId} x {oi.quantity}
          </div>
        );
      })}
      <button onClick={placeOrder} disabled={orderItems.length === 0}>Place Order</button>

      {/* Existing Orders */}
      <h2>Orders</h2>
      {orders.length === 0 && <p>No orders yet</p>}
      {orders.map(order => (
        <div key={order._id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "5px" }}>
          <p>
            Table {order.tableNumber} - Total: ${order.totalAmount} - Status: {order.status}
          </p>

          {/* List items */}
          <ul>
            {order.items.map(item => (
              <li key={item._id}>
                {item.menuItemName} x {item.quantity} ({item.status})
              </li>
            ))}
          </ul>

          {/* Complete Order Button */}
          {order.status !== "completed" && (
            <button onClick={() => completeOrder(order._id)}>Mark as Completed</button>
          )}
          {order.status === "completed" && <span>✅ Completed</span>}
        </div>
      ))}
    </div>
  );
};

export default POS;

