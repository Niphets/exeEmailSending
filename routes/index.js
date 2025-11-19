const express = require("express");
const router = express.Router();

const products = require("../data/products");

router.get("/", (req, res) => {
    res.render("home", { 
        currentPage: "home",
        heroProducts: products.slice(0, 3)
    });
});

module.exports = router;