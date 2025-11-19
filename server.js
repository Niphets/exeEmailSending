require("dotenv").config();
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const productsData = require("./data/products");

const app = express();

// MUST be first
app.set("trust proxy", 1);

// Middleware
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
app.use("/", require("./routes/index"));
app.use("/products", require("./routes/products"));
app.use("/contact", require("./routes/contact"));

// 404 catch
app.use((req, res) => {
    res.status(404).render("home", { 
        error: "Page not found",
        currentPage: 'home',
        heroProducts: productsData.slice(0, 3)
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Pick Freshy server running: http://localhost:${PORT}`);
});
