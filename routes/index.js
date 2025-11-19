const express = require("express");
const router = express.Router();

const products = [
    { title: 'Apple', description: 'Fresh red apple', price: '5.99', image: '/images/apple.jpg' },
    { title: 'Banana', description: 'Yellow banana', price: '2.99', image: '/images/banana.jpg' },
    { title: 'Orange', description: 'Juicy orange', price: '3.99', image: '/images/orange.jpg' }
];


router.get("/", (req, res) => {
    res.render("home", { currentPage: 'home' }, { products });
});

module.exports = router;