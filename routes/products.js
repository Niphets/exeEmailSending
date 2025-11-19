const express = require("express");
const router = express.Router();

const products = require("../data/products");

router.get("/", (req, res) => {
    res.render("products", { 
        products,
        currentPage: 'products' 
    });
});

module.exports = router;