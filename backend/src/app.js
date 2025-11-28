import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";

// ROUTES
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/order.routes.js";
import menuRoutes from "./routes/menuRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";

// MODEL
import User from "./models/User.js";

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// ✅ Create Default Admin User with hashed password
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "super@example.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Super User",
        email: "super@example.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("✔ Default admin created:");
      console.log("▶ Email: admin@example.com");
      console.log("▶ Password: admin123");
      console.log("  Please change this password after first login!");
    } else {
      console.log("✔ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error.message);
  }
};

createDefaultAdmin();

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/ingredients", ingredientRoutes);

// Sample root route
app.get("/", (req, res) => res.send("RMS Backend Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

