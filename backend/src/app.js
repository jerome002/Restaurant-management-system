import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import orderRoutes from "./routes/order.routes.js";
import menuRoutes from "./routes/menuRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Sample route
app.get("/", (req, res) => res.send("RMS Backend Running"));
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/ingredients", ingredientRoutes);

// Register modules here later
// app.use("/api/menu-items", menuRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/inventory", inventoryRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
