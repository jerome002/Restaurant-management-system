import React, { useEffect, useState } from "react";
import api from "../services/api";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: 0,
    category: "",
    ingredients: [{ ingredientId: "", quantityRequired: 0 }],
    available: true
  });

  const [editingId, setEditingId] = useState(null);

  // FETCH MENU ITEMS
  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenuItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH INGREDIENTS FOR DROPDOWN
  const fetchIngredients = async () => {
    try {
      const res = await api.get("/ingredients");  
      setAllIngredients(res.data);               // store all ingredients in state
    } catch (err) {
      console.error("Error fetching ingredients:", err);
    }
  };

  // Load everything on first render
  useEffect(() => {
    fetchMenu();
    fetchIngredients();
  }, []);

  // FORM INPUT HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // INGREDIENT SUB-FIELD HANDLER
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...form.ingredients];
    updatedIngredients[index][field] = value;
    setForm({ ...form, ingredients: updatedIngredients });
  };

  // ADD NEW INGREDIENT INPUT ROW
  const addIngredient = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, { ingredientId: "", quantityRequired: 0 }]
    });
  };

  // REMOVE INGREDIENT ROW
  const removeIngredient = (index) => {
    const updatedIngredients = [...form.ingredients];
    updatedIngredients.splice(index, 1);
    setForm({ ...form, ingredients: updatedIngredients });
  };

  // SUBMIT - CREATE OR UPDATE MENU ITEM
  const submitForm = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/menu/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("/menu", form);
      }

      // Reset form
      setForm({
        name: "",
        price: 0,
        category: "",
        ingredients: [{ ingredientId: "", quantityRequired: 0 }],
        available: true
      });

      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT ITEM
  const editItem = (item) => {
    setEditingId(item._id);

    setForm({
      name: item.name,
      price: item.price,
      category: item.category,
      ingredients: item.ingredients.map(ing => ({
        ingredientId: ing.ingredientId._id,
        quantityRequired: ing.quantityRequired
      })),
      available: item.available
    });
  };

  // DELETE ITEM
  const deleteItem = async (id) => {
    try {
      await api.delete(`/menu/${id}`);
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Menu Management</h2>

      {/* FORM */}
      <form onSubmit={submitForm} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <h4>Ingredients</h4>

        {form.ingredients.map((ing, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>

            {/* INGREDIENT DROPDOWN */}
            <select
              value={ing.ingredientId}
              onChange={(e) =>
                handleIngredientChange(index, "ingredientId", e.target.value)
              }
              required
            >
              <option value="">Select Ingredient</option>
              {allIngredients.map((ingredient) => (
                <option key={ingredient._id} value={ingredient._id}>
                  {ingredient.name} ({ingredient.unit})
                </option>
              ))}
            </select>

            {/* QUANTITY */}
            <input
              type="number"
              placeholder="Quantity Required"
              value={ing.quantityRequired}
              onChange={(e) =>
                handleIngredientChange(index, "quantityRequired", parseFloat(e.target.value))
              }
              required
            />

            <button type="button" onClick={() => removeIngredient(index)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addIngredient}>Add Ingredient</button>

        <br /><br />
        <button type="submit">{editingId ? "Update Item" : "Add Item"}</button>
      </form>

      {/* MENU LIST */}
      <h3>Menu Items</h3>
      <ul>
        {menuItems.map(item => (
          <li key={item._id}>
            <strong>{item.name}</strong> - ${item.price} ({item.category})
            <button onClick={() => editItem(item)}>Edit</button>
            <button onClick={() => deleteItem(item._id)}>Delete</button>

            <ul>
              {item.ingredients.map(ing => (
                <li key={ing.ingredientId._id}>
                  {ing.ingredientId.name} — {ing.quantityRequired} {ing.ingredientId.unit}
                </li>
              ))}
            </ul>

          </li>
        ))}
      </ul>

    </div>
  );
};

export default Menu;
