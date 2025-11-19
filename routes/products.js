const express = require("express");
const router = express.Router();

// Sample product data
const products = [
    {
        id: 1,
        title: "Organic Apples",
        description: "Fresh red apples, 1kg",
        price: "Rs.150",
        image: "/images/apple.jpg"
    },
    {
        id: 2,
        title: "Fresh Carrots",
        description: "Organic carrots, 1kg",
        price: "Rs.80",
        image: "/images/carrots.jpg"
    },
    {
        id: 3,
        title: "Ripe Bananas",
        description: "Sweet yellow bananas, 1 dozen",
        price: "Rs.60",
        image: "/images/banana.jpg"
    },
    {
        id: 4,
        title: "Red Tomatoes",
        description: "Fresh vine tomatoes, 1kg",
        price: "Rs.70",
        image: "/images/tomato.jpg"
    }
];

router.get("/", (req, res) => {
    res.render("products", { 
        products,
        currentPage: 'products' 
    });
});

module.exports = router;