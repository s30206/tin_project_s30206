const express = require("express");
const router = express.Router();
const {
    authenticate,
    authEmployee
} = require("../middleware/authMiddleware.js");
const db = require("../db.js");

router.get("/people", authenticate, authEmployee, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 2;
    const offset = (page - 1) * pageSize;

    db.all("SELECT COUNT(*) AS count FROM Person", [], (err, countRows) => {
        if (err) {
            return res.render("error", {
                message: "Database error.",
                backUrl: "/register"
            });
        }

        const totalItems = countRows[0].count;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

        if (page < 1 || page > totalPages) {
            return res.render("error", {
                message: "Page not found.",
                backUrl: "/people"
            });
        }

        db.all(
            `SELECT ID, FirstName, LastName, Email
             FROM Person
             LIMIT ? OFFSET ?`,
            [pageSize, offset],
            (err, rows) => {
                if (err) {
                    return res.render("error", {
                        message: "Database error.",
                        backUrl: "/register"
                    });
                }

                res.render("people", {
                    people: rows,
                    currentPage: page,
                    totalPages
                });
            }
        );
    });
});


router.get("/people/:id", authenticate, authEmployee, (req, res) => {
    db.get(`
            SELECT p.*, a.Username, AR.Name AS Role
            FROM Person p
            JOIN Account a ON p.ID = a.Person_ID
            JOIN AccountRole AR ON AR.ID = a.AccountRole_ID
            WHERE p.ID = ?`,
        [req.params.id],
        (err, row) => {
            if (err) {
                return res.render("error", {
                    message: "Database error.",
                    backUrl: "/register"
                });
            }

            if (!row) {
                return res.render("error", {
                    message: "Person not found.",
                    backUrl: "/people"
                });
            }

            res.render("personDetails", { person: row });
        }
    );
});

module.exports = router;