const express = require("express");
const path = require("path");
const fs = require("fs");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/CatchAsynErrors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { m } = require("framer-motion");
require("dotenv").config();


router.post("/create-user", upload.single("file"), catchAsyncErrors(async (req, res, next) => {
    console.log("Creating user...");
    const { name, email, password } = req.body;

    const userEmail = await User.findOne({ email });
    if (userEmail) {
        if (req.file) {
            const filepath = path.join(__dirname, "../uploads", req.file.filename);
            try {
                fs.unlinkSync(filepath);
            } catch (err) {
                console.log("Error removing file:", err);
                return res.status(500).json({ message: "Error removing file" });
            }
        }
        return next(new ErrorHandler("User already exists", 400));
    }

    let fileUrl = "";
    if (req.file) {
        fileUrl = path.join("uploads", req.file.filename);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("At Create ", "Password: ", password, "Hash: ", hashedPassword);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar: {
            public_id: req.file?.filename || "",
            url: fileUrl,
        },
    });
    console.log(user)
    res.status(201).json({ success: true, user });
}));

router.post("/login", catchAsyncErrors(async (req, res, next) => {
    console.log("Logging in user...");
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    console.log("At Auth", "Password: ", password, "Hash: ", user.password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    try {
        const token = jwt.sign({ id: user._id  , email: user.email}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME,
        });

        res.cookie("token", token, {   
            httpOnly: true,
            expires: new Date(Date.now() + process.env.JWT_EXPIRES_TIME * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", 
            maxAge: process.env.JWT_EXPIRES_TIME * 24 * 60 * 60 * 1000,
        });
        user.password = undefined;
        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
    }

));

router.get("/profile", catchAsyncErrors(async (req, res, next) => {
    const { email } = req.query;
    if (!email) {
        return next(new ErrorHandler("Please provide an email", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user: {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatar.url
        },
        addresses: user.addresses,

        // {
        //     "success": true,
        //     "user": {
        //         "name": "a",
        //         "email":"a@example.com",
        //         "phoneNumber": "1234567890",
        //         "avatarUrl": "https://example.com/avatar.jpg"
        //     },
        //     "addresses": ["Address 1", "Address 2"]
        // }

        
    });
    console.log(user.avatarUrl)
}));

router.post("/add-address", catchAsyncErrors(async (req, res, next) => {
    const { country, city, address1, address2, zipCode, addressType, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const newAddress = {
        country,
        city,
        address1,
        address2,
        zipCode,
        addressType,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
        success: true,
        addresses: user.addresses,
    });
}));

router.get("/addresses", catchAsyncErrors(async (req, res, next) => {
    const { email } = req.query;
    if (!email) {
        return next(new ErrorHandler("Please provide an email", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        success: true,
        addresses: user.addresses,
    });
}
));
module.exports = router;