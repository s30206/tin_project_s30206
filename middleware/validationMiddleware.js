const db = require("../db.js");

function usernameExists(username) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT ID FROM Account WHERE Username = ?",
            [username],
            (err, row) => {
                if (err) reject(err);
                resolve(!!row);
            }
        );
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9+\-\s]{6,20}$/;
    return re.test(phone);
}

async function registrationValidation(req, res, next) {
    const { firstName, lastName, email, phone, username, password, role } = req.body;

    if (!firstName || firstName.trim().length < 2) {
        return res.render("error", {
            message: "First name must be at least 2 characters long.",
            backUrl: "/register"
        });
    }

    if (!lastName || lastName.trim().length < 2) {
        return res.render("error", {
            message: "Last name must be at least 2 characters long.",
            backUrl: "/register"
        });
    }

    if (!validateEmail(email)) {
        return res.render("error", {
            message: "Email address format is invalid.",
            backUrl: "/register"
        });
    }

    if (!validatePhone(phone)) {
        return res.render("error", {
            message: "Phone number format is invalid.",
            backUrl: "/register"
        });
    }

    if (!username || username.length < 4) {
        return res.render("error", {
            message: "Username must be at least 4 characters long.",
            backUrl: "/register"
        });
    }

    if (await usernameExists(username)) {
        return res.render("error", {
            message: "Username already exists.",
            backUrl: "/register"
        });
    }

    if (!password || password.length < 6) {
        return res.render("error", {
            message: "Password must be at least 6 characters long.",
            backUrl: "/register"
        });
    }

    if (!role) {
        return res.render("error", {
            message: "Account role must be selected.",
            backUrl: "/register"
        });
    }

    next();
}

function loginValidation(req, res, next) {
    const { username, password } = req.body;

    if (!username) {
        return res.render("error", {
            message: "Username is required.",
            backUrl: "/login"
        });
    }

    if (!password) {
        return res.render("error", {
            message: "Password is required.",
            backUrl: "/login"
        });
    }

    next();
}

function accountPersonUpdateValidation(req, res, next) {
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || firstName.trim().length < 2) {
        return res.render("error", {
            message: "First name must be at least 2 characters long.",
            backUrl: "/account"
        });
    }

    if (!lastName || lastName.trim().length < 2) {
        return res.render("error", {
            message: "Last name must be at least 2 characters long.",
            backUrl: "/account"
        });
    }

    if (!validateEmail(email)) {
        return res.render("error", {
            message: "Email address format is invalid.",
            backUrl: "/account"
        });
    }

    if (!validatePhone(phone)) {
        return res.render("error", {
            message: "Phone number format is invalid.",
            backUrl: "/account"
        });
    }

    next();
}

function accountPasswordChangeValidation(req, res, next) {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.render("error", {
            message: "New password must be at least 6 characters long.",
            backUrl: "/account"
        });
    }

    next();
}

function productValidation(req, res, next) {
    const { name, description, price } = req.body;

    if (!name || name.trim().length < 2) {
        return res.render("error", {
            message: "Product name must be at least 2 characters.",
            backUrl: `/products/${req.params.id}`
        });
    }

    if (!description || description.trim().length < 5) {
        return res.render("error", {
            message: "Description must be at least 5 characters.",
            backUrl: `/products/${req.params.id}`
        });
    }

    const p = Number(price);
    if (!Number.isFinite(p) || p <= 0) {
        return res.render("error", {
            message: "Price must be a number greater than 0.",
            backUrl: `/products/${req.params.id}`
        });
    }

    next();
}

function orderValidation(req, res, next) {
    const { quantity } = req.body;

    const q = Number(quantity);

    if (!Number.isInteger(q) || q <= 0) {
        return res.render("error", {
            message: "Quantity must be a number greater than 0.",
            backUrl: "/orders"
        })
    }

    next();
}

module.exports = {
    registrationValidation,
    loginValidation,
    accountPersonUpdateValidation,
    accountPasswordChangeValidation,
    productValidation,
    orderValidation
};