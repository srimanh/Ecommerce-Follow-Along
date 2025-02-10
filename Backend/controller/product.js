const express = require("express");
const path = require("path");
const fs = require("fs");
const Product = require("../model/Product");
const { upload } = require("../multer");
const router = express.Router();

// 📌 Create Product API (Image Uploads + Save to MongoDB)
router.post("/create", upload.array("images", 10), async (req, res) => {
    try {
        console.log("Request Body:", req.body); 

        const { name, description, price, stock, category, tags, email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required to associate the product with a user." });
        }

        if (!name || !description || !price || !stock || !category || !req.files) {
            return res.status(400).json({ message: "All fields, including images, are required." });
        }

        const imagePaths = req.files.map((file) => path.join("uploads", file.filename));

        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            tags: tags ? tags.split(",") : [],
            images: imagePaths,
            email,  
        });

        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        const formattedProducts = products.map(product => ({
            ...product._doc,
            images: product.images.map(img => img.replace(/\\/g, "/"))  
        }));

        res.status(200).json(formattedProducts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

router.get("/by-email/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const products = await Product.find({ email: { $regex: new RegExp(`^${email}$`, "i") } });

        if (!products.length) {
            return res.status(404).json({ message: "No products found for this email." });
        }

        const formattedProducts = products.map(product => ({
            ...product._doc,
            images: product.images.map(img => img.replace(/\\/g, "/"))
        }));

        res.status(200).json(formattedProducts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products by email" });
    }
});


module.exports = router;
