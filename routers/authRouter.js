const express = require("express");
const bcrypt = require("bcrypt");
const {
    registrationValidation,
    loginValidation
} = require("../middleware/validationMiddleware");

const router = express.Router();
const db = require("../db.js");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/login", (req, res) => {
    if (!req.session.user)
        res.render("login");
    else
        res.redirect("/dashboard");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post(
    "/register",
    registrationValidation,
    async (req, res) => {
        const { firstName, lastName, email, phone, username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `
                INSERT INTO Person (FirstName, LastName, Email, Phone)
                VALUES (?, ?, ?, ?)
                `,
            [firstName, lastName, email, phone],
            function (err) {
                if (err) {
                    return res.render("error", {
                        message: "Failed to create person record.",
                        backUrl: "/register"
                    });
                }

                const personId = this.lastID;

                db.run(
                    `INSERT INTO Account (Person_ID, Username, Password, AccountRole_ID)
                     VALUES (?, ?, ?, ?)`,
                    [personId, username, hashedPassword, role],
                    err => {
                        if (err) {
                            return res.render("error", {
                                message: "Database error.",
                                backUrl: "/register"
                            });
                        }
                        res.redirect("/login");
                    }
                );
            }
        );
    }
);

router.post(
    "/login",
    loginValidation,
    (req, res) => {
        const { username, password } = req.body;

        db.get(
            `SELECT Account.*, AccountRole.Name AS RoleName, Person_ID
             FROM Account
             JOIN AccountRole ON AccountRole.ID = Account.AccountRole_ID
             WHERE Username = ?`,
            [username],
            async (err, user) => {
                if (!user) {
                    return res.render("error", {
                        message: "No account exists with this username.",
                        backUrl: "/login"
                    });
                }

                const match = await bcrypt.compare(password, user.Password);
                if (!match) {
                    return res.render("error", {
                        message: "Password does not match the account.",
                        backUrl: "/login"
                    });
                }

                req.session.user = {
                    id: user.ID,
                    username: user.Username,
                    role: user.RoleName
                };

                res.redirect("/dashboard");
            }
        );
    }
);

router.get("/logout", authenticate, (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

router.post("/delete", authenticate, (req, res) => {
    const userId = req.session.user.id;

    db.get(`SELECT Person_ID AS 'ID' FROM Account WHERE ID = ?`, [userId],
        (err, row) => {
            if (err) {
                return res.render("error", {
                    message: "Database error.",
                    backUrl: `/dashboard`
                });
            }
        db.run(`
                    DELETE
                    FROM Person
                    WHERE ID = ?
                    `,
            [row.ID], err => {
            if (err) return res.render("error", {
                    message: "Database error.",
                    backUrl: "/dashboard"
                });

            req.session.destroy(() => {
                res.redirect("/login");
            });
        });
    });
});

module.exports = router;