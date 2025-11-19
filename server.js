require("dotenv").config();
const express = require("express");
const app = express();          // 1️⃣ create app FIRST

app.set("trust proxy", 1);      // 2️⃣ MUST be here FOR RENDER (IMPORTANT)

const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const productsData = require("./data/products");

// Import routes
const indexRoutes = require("./routes/index");
const productsRoutes = require("./routes/products");
const contactRoutes = require("./routes/contact");

// Middleware (all below trust proxy)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:4000",
    methods: ["GET", "POST"]
}));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRoutes);
app.use("/products", productsRoutes);
app.use("/contact", contactRoutes);

// 404
app.use((req, res) => {
    res.status(404).render("home", { 
        error: "Page not found",
        currentPage: 'home',
        heroProducts: productsData.slice(0, 3)
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Pick Freshy running: http://localhost:${PORT}`);
});
