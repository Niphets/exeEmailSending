const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Warn if env vars missing
if (!EMAIL || !EMAIL_PASSWORD) {
    console.warn("⚠️ EMAIL or EMAIL_PASSWORD env vars are missing. Emails will fail.");
}

// Email transporter
// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user: EMAIL,
//         pass: EMAIL_PASSWORD
//     },
//     tls: {
//         rejectUnauthorized: true
//     }
// });


// 🔥 Render-safe Gmail SMTP settings
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),   // MUST be 587 on Render
    secure: false,                                // ALWAYS false for port 587 (STARTTLS)
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === "true"
    },
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT || 15000),

    // Debugging (shows details in Render logs)
    logger: true,
    debug: true
});

// Featured products
const featuredProducts = [
    {
        title: "Organic Apples",
        description: "Fresh red apples, 1kg",
        price: "Rs.150",
        image: "cid:apple"
    },
    {
        title: "Farm Fresh Carrots",
        description: "Organic carrots, 1kg",
        price: "Rs.80",
        image: "cid:carrot"
    }
];

const templateDefaults = {
    company: "Pick Freshy",
    company_address: "123 Fresh Market Street, Green Valley, IN",
    facebook_url: "https://facebook.com/pickfreshy",
    twitter_url: "https://twitter.com/pickfreshy",
    linkedin_url: "https://linkedin.com/company/pickfreshy",
    instagram_url: "https://instagram.com/pickfreshy",
    products: featuredProducts
};

function getEmailTemplateData(overrides = {}) {
    return { ...templateDefaults, ...overrides };
}

async function renderContactEmail(templateValues) {
    const templatePath = path.join(__dirname, "../views/contactEmail.ejs");
    return ejs.renderFile(templatePath, templateValues);
}

async function sendContactEmail(name, email, message) {
    if (!EMAIL || !EMAIL_PASSWORD) {
        throw new Error("Email credentials are not configured.");
    }

    const htmlContent = await renderContactEmail(
        getEmailTemplateData({ name, email, message })
    );

    await transporter.sendMail({
        from: `"Pick Freshy Contact" <${EMAIL}>`,
        replyTo: email,
        to: EMAIL,
        subject: `New Contact Message from ${name}`,
        html: htmlContent,
        attachments: [
            {
                filename: "apple.jpg",
                path: path.join(__dirname, "../public/images/apple.jpg"),
                cid: "apple"
            },
            {
                filename: "carrots.jpg",
                path: path.join(__dirname, "../public/images/carrots.jpg"),
                cid: "carrot"
            }
        ]
    });
}

module.exports = {
    sendContactEmail,
    renderContactEmail,
    getEmailTemplateData
};
