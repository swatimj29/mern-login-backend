require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });


// Test route
app.get("/", (req, res) => {
    res.send("MERN Login Backend is running");
});


// Register User
app.post("/api/users", async (req, res) => {

    try {

        const { username, password } = req.body;

        const newUser = new User({
            username: username,
            password: password
        });

        await newUser.save();

        res.status(201).json({
            message: "User inserted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error inserting user"
        });

    }

});


// Login User
app.post("/api/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        // Find user in MongoDB
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        res.status(200).json({
            message: "Login successful"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// Start server
app.listen(PORT, "0.0.0.0", () => {

    console.log(`Server running on port ${PORT}`);

});