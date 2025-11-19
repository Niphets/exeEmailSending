const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const validator = require("validator");
const { sendContactEmail } = require("../config/emailConfig");

// Rate limiting
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 25,
    message: "Too many requests. Please try again later."
});

router.get("/", (req, res) => {
    res.render("contact", { 
        currentPage: 'contact',
        success: null,
        error: null 
    });
});

router.post("/", contactLimiter, async (req, res) => {
    const { name, email, message } = req.body;

    // Sanitize inputs
    const cleanName = validator.escape(name.trim());
    const cleanEmail = validator.normalizeEmail(email.trim());
    const cleanMessage = validator.escape(message.trim());

    // Validate
    if (!validator.isEmail(cleanEmail)) {
        return res.render("contact", {
            currentPage: 'contact',
            error: "Invalid email address.",
            success: null
        });
    }

    if (cleanName.length < 2 || cleanMessage.length < 5) {
        return res.render("contact", {
            currentPage: 'contact',
            error: "Please provide valid name and message.",
            success: null
        });
    }

    try {
        await sendContactEmail(cleanName, cleanEmail, cleanMessage);
        res.render("contact", {
            currentPage: 'contact',
            success: "Message sent successfully! We'll get back to you soon.",
            error: null
        });
    } catch (err) {
        console.error(err);
        res.render("contact", {
            currentPage: 'contact',
            error: "Server error. Please try again later.",
            success: null
        });
    }
});

module.exports = router;