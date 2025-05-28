const express = require("express");
const cors = require("cors");
const { connectDB, isConnected } = require("./config");
const User = require("./user");
const Product = require("./product");
const Jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "Ayesha";

// Initialize database connection
const initializeServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start the server only after successful database connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Database connection status:', isConnected() ? 'Connected' : 'Disconnected');
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
};

// Middleware to check database connection
const checkDatabaseConnection = (req, res, next) => {
  if (!isConnected()) {
    console.error('Database connection check failed');
    return res.status(503).json({
      message: "Database connection not ready. Please try again later."
    });
  }
  next();
};

// Apply database connection check to all routes
app.use(checkDatabaseConnection);

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  const tokenValue = token.split(" ")[1];
  Jwt.verify(tokenValue, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded.user;
    next();
  });
};

app.post("/register", async (req, res) => {
  try {
    const data = new User(req.body);
    const result = await data.save();
    const userData = result.toObject();
    delete userData.password;
    res.status(201).json(userData);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      password: password 
    }).select('fullname email');

    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    Jwt.sign(
      { user }, 
      JWT_SECRET, 
      { expiresIn: "2h" }, 
      (err, token) => {
        if (err) {
          console.error("Token generation error:", err);
          return res.status(500).json({ 
            message: "Error generating authentication token" 
          });
        }
        res.json({ 
          user, 
          token,
          message: "Login successful" 
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Internal server error. Please try again later." 
    });
  }
});

// Protected routes
app.use(verifyToken);

app.post("/create", async (req, res) => {
  try {
    const data = new Product(req.body);
    const result = await data.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Error creating product" });
  }
});

app.get("/product", async (req, res) => {
  try {
    const result = await Product.find();
    res.json(result);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const result = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.json(result);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

app.get("/search/:key", async (req, res) => {
  try {
    const result = await Product.find({
      "$or": [
        { name: { $regex: `^${req.params.key}`, $options: 'i' } },
        { price: { $regex: `^${req.params.key}`, $options: 'i' } },
        { company: { $regex: `^${req.params.key}`, $options: 'i' } },
        { category: { $regex: `^${req.params.key}`, $options: 'i' } },
      ]
    }).limit(20);
    res.json(result);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching products" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const result = await Product.findOne({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(result);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    res.json(result);
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

// Initialize the server
initializeServer();