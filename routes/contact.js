const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const validator = require("validator");
const { sendContactEmail, getEmailTemplateData } = require("../config/emailConfig");

// Rate limiting
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 25,
    message: "Too many requests. Please try again later."
});

const defaultFormData = {
    name: "",
    email: "",
    message: ""
};

const emailPreviewImageMap = {
    apple: "/images/apple.jpg",
    carrot: "/images/carrots.jpg"
};

function mapProductsForPreview(products = []) {
    return products.map(product => {
        if (product.image && product.image.startsWith("cid:")) {
            const key = product.image.replace("cid:", "");
            return {
                ...product,
                image: emailPreviewImageMap[key] || "/images/apple.jpg"
            };
        }
        return product;
    });
}

router.get("/", (req, res) => {
    res.render("contact", { 
        currentPage: 'contact',
        formData: defaultFormData,
        emailTemplatePreviewUrl: "/contact/preview",
        success: null,
        error: null 
    });
});

router.post("/", contactLimiter, async (req, res) => {
    const { name, email, message } = req.body;

    // Sanitize inputs
    const trimmedData = {
        name: name?.trim() || "",
        email: email?.trim() || "",
        message: message?.trim() || ""
    };

    const cleanName = validator.stripLow(trimmedData.name);
    const cleanEmail = validator.normalizeEmail(trimmedData.email);
    const cleanMessage = validator.stripLow(trimmedData.message, true);

    // Validate
    if (!cleanEmail || !validator.isEmail(cleanEmail)) {
        return res.render("contact", {
            currentPage: 'contact',
            formData: trimmedData,
            emailTemplatePreviewUrl: "/contact/preview",
            error: "Invalid email address.",
            success: null
        });
    }

    if (cleanName.length < 2 || cleanMessage.length < 5) {
        return res.render("contact", {
            currentPage: 'contact',
            formData: trimmedData,
            emailTemplatePreviewUrl: "/contact/preview",
            error: "Please provide valid name and message.",
            success: null
        });
    }

    try {
        await sendContactEmail(cleanName, cleanEmail, cleanMessage);
        res.render("contact", {
            currentPage: 'contact',
            formData: defaultFormData,
            emailTemplatePreviewUrl: "/contact/preview",
            success: "Message sent successfully! We'll get back to you soon.",
            error: null
        });
    } catch (err) {
        console.error(err);
        res.render("contact", {
            currentPage: 'contact',
            formData: trimmedData,
            emailTemplatePreviewUrl: "/contact/preview",
            error: "Server error. Please try again later.",
            success: null
        });
    }
});

router.get("/preview", (req, res) => {
    const previewData = getEmailTemplateData({
        name: "Ava Sharma",
        email: "ava@example.com",
        message: "Hi team,\nI'd love to stock my café with your greens next week.\nCan you share availability?"
    });

    res.render("contactEmail", {
        ...previewData,
        products: mapProductsForPreview(previewData.products)
    });
});

module.exports = router;