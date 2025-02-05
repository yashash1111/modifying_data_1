require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem"); // Import MenuItem model

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request body

// Connect to MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));

// POST /menu - Add new menu item
app.post("/menu", async (req, res) => {
    try {
        const { name, description, price } = req.body;

        if (!name || price == null) {
            return res.status(400).json({ message: "Name and price are required." });
        }

        const newItem = new MenuItem({ name, description, price });
        await newItem.save();

        res.status(201).json({ message: "Menu item added successfully", item: newItem });
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

// GET /menu - Retrieve all menu items
app.get("/menu", async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
