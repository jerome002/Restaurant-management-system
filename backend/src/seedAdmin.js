import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminExists = await User.findOne({ email: "admin@example.com" });
    
    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "Admin@123",
      role: "admin"
    });

    console.log("Admin user created successfully:", {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
