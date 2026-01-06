require("dotenv").config({quiet: true});

const express = require("express");
const session = require("express-session");
const path = require("path");

const authRouter = require("./routers/authRouter.js");
const productRouter = require("./routers/productRouter.js");
const accountRouter = require("./routers/accountRouter.js");
const peopleRouter = require("./routers/peopleRouter.js");
const orderRouter = require("./routers/orderRouter.js");

const { authenticate } = require("./middleware/authMiddleware.js");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 5 * 60 * 1000
    }
}));

app.use(authRouter);
app.use(productRouter);
app.use(accountRouter);
app.use(peopleRouter);
app.use(orderRouter);

app.get("/dashboard", authenticate, (req, res) => {
    res.render("dashboard", { user: req.session.user });
});

app.get("/", (req, res) => {
    if (!req.session.user)
        res.redirect("/login");
    else
        res.redirect("/dashboard");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});