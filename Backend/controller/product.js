const express = require("express");
const path = require("path");
const Product = require("../model/Product");
const { upload } = require("../multer");
const router = express.Router();

// 📌 Create Product API (Upload 10 Images)
router.post("/create", upload.array("images", 10), async (req, res) => {
    try {
        const { name, description, price, stock, category, tags } = req.body;

        if (!name || !description || !price || !stock || !category || !req.files || req.files.length === 0) {
            return res.status(400).json({ message: "All fields are required, including images." });
        }

        // Store up to 10 images
        const imagePaths = req.files.map((file) => path.join("uploads", file.filename));

        // Save to Database
        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            tags: tags ? tags.split(",") : [],
            images: imagePaths,
        });

        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 Get All Products API (Fix Image Path)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        // Convert image paths to frontend-friendly format
        const formattedProducts = products.map(product => ({
            ...product._doc,
            images: product.images.map(img => img.replace(/\\/g, "/"))  
        }));

        res.status(200).json(formattedProducts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

module.exports = router;
