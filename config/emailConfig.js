const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

// Email transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: true
    }
});

// Sample featured products for email
const featuredProducts = [
    {
        title: "Organic Apples",
        description: "Fresh red apples, 1kg",
        price: "Rs.150",
        image: "cid:apple"
    },
    {
        title: "Fresh Carrots",
        description: "Organic carrots, 1kg",
        price: "Rs.80",
        image: "cid:carrot"
    }
];

async function sendContactEmail(name, email, message) {
    const templatePath = path.join(__dirname, "../views/contactEmail.ejs");

    const htmlContent = await ejs.renderFile(templatePath, {
        name,
        email,
        message,
        company: "Pick Freshy",
        company_address: "123 Fresh Market Street, Green Valley, IN",
        facebook_url: "https://facebook.com/pickfreshy",
        twitter_url: "https://twitter.com/pickfreshy",
        linkedin_url: "https://linkedin.com/company/pickfreshy",
        instagram_url: "https://instagram.com/pickfreshy",
        products: featuredProducts
    });

    await transporter.sendMail({
        from: `"Pick Freshy Contact" <${process.env.EMAIL}>`,
        replyTo: email,
        to: process.env.EMAIL,
        subject: `New Contact Message from ${name}`,
        html: htmlContent,
        attachments: [
            { 
                filename: "apple.jpg", 
                path: path.join(__dirname, "../public/images/apple.jpg"), 
                cid: "apple" 
            },
            { 
                filename: "carrot.jpg", 
                path: path.join(__dirname, "../public/images/carrots.jpg"), 
                cid: "carrot" 
            }
        ]
    });
}

module.exports = { sendContactEmail };