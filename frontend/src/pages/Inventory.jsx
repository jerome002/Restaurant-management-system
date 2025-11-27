import React, { useEffect, useState } from "react";
import api from "../services/api";

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    unit: "",
    stock: 0,
    lowStockThreshold: 10,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch Ingredients
  const fetchIngredients = async () => {
    try {
      const res = await api.get("/ingredients");
      setIngredients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Submit Add/Edit Ingredient
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/ingredients/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("/ingredients", form);
      }

      setForm({ name: "", unit: "", stock: 0, lowStockThreshold: 10 });
      fetchIngredients();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit ingredient
  const editIngredient = (ing) => {
    setEditingId(ing._id);
    setForm({
      name: ing.name,
      unit: ing.unit,
      stock: ing.stock,
      lowStockThreshold: ing.lowStockThreshold,
    });
  };

  // Delete
  const deleteIngredient = async (id) => {
    try {
      await api.delete(`/ingredients/${id}`);
      fetchIngredients();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Inventory Management</h2>

      <form onSubmit={submitForm} style={{ padding: "10px", border: "1px solid #ccc" }}>
        <input name="name" placeholder="Ingredient Name" value={form.name} onChange={handleChange} required />
        <input name="unit" placeholder="Unit (kg, g, ml...)" value={form.unit} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <input name="lowStockThreshold" type="number" placeholder="Low Stock Alert" value={form.lowStockThreshold} onChange={handleChange} />

        <button type="submit">{editingId ? "Update Ingredient" : "Add Ingredient"}</button>
      </form>

      <h3>Ingredients List</h3>
      <ul>
        {ingredients.map(i => (
          <li key={i._id}>
            <strong>{i.name}:</strong> {i.stock}{i.unit}  
            {i.stock <= i.lowStockThreshold && <span style={{ color: "red" }}> (Low Stock!)</span>}
            <button onClick={() => editIngredient(i)}>Edit</button>
            <button onClick={() => deleteIngredient(i._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;
