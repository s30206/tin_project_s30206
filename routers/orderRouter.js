const express = require("express");
const router = express.Router();
const db = require("../db.js");
const { authenticate, authCustomer } = require("../middleware/authMiddleware.js");
const { orderValidation } = require("../middleware/validationMiddleware.js");

router.post("/orders/new", authenticate, authCustomer, orderValidation, (req, res) => {
    const { productId, quantity } = req.body;

    const userId = req.session.user.id;

    db.get(`SELECT Person_ID AS 'ID' FROM Account WHERE ID = ?`, [userId],
        (err, row) => {
            if (err) {
                return res.render("error", {
                    message: "Database error.",
                    backUrl: `/orders/${productId}`
                });
            }
            db.run(
                `INSERT INTO "Order" (Quantity, OrderAt, Person_ID, Product_ID)
                 VALUES (?, date('now'), ?, ?)`,
                [Number(quantity), row.ID, productId],
                err => {
                    if (err) {
                        return res.render("error", {
                            message: "Database error while placing order.",
                            backUrl: `/products/${productId}`
                        });
                    }

                    res.redirect("/orders");
                }
            );
    });
});

router.get("/orders", authenticate, (req, res) => {
    const user = req.session.user;

    const page = parseInt(req.query.page) || 1;
    const pageSize = 2;
    const offset = (page - 1) * pageSize;

    db.get(`
                SELECT P.ID
                FROM Person P
                JOIN Account A ON P.ID = A.Person_ID
                WHERE A.ID = ?
                `, [user.id],
        (err, row) => {
            if (err || !row) {
                return res.render("error", {
                    message: "Cannot find user data.",
                    backUrl: "/dashboard"
                });
            }

            let where = "";
            const params = [];

            if (user.role === "customer") {
                where = "WHERE o.Person_ID = ?";
                params.push(row.ID);
            }

            db.get(
                `
                    SELECT COUNT(*) AS count
                    FROM "Order" o
                    ${where}
                `, params,
                (err2, countRow) => {
                    if (err2) {
                        return res.render("error", {
                            message: "Database error while counting orders.",
                            backUrl: "/dashboard"
                        });
                    }

                    const totalItems = countRow.count;
                    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

                    db.all(
                        `
                            SELECT o.ID, o.Quantity, o.OrderAt,
                            p.Name AS ProductName, p.Price
                            FROM "Order" o
                            JOIN Product p ON p.ID = o.Product_ID
                            ${where}
                            LIMIT ? OFFSET ?
                        `,
                        [...params, pageSize, offset],
                        (err3, rows) => {
                            if (err3) {
                                return res.render("error", {
                                    message: "Database error while loading orders.",
                                    backUrl: "/dashboard"
                                });
                            }

                            res.render("orders", {
                                orders: rows,
                                user,
                                currentPage: page,
                                totalPages
                            });
                        }
                    );
                }
            );
        }
    );
});

router.get("/orders/:id", authenticate, (req, res) => {
    const id = req.params.id;

    db.get(
        `
            SELECT o.*, 
            p.Name AS ProductName, p.Description, p.Price,
            per.FirstName, per.LastName, per.Email
            FROM "Order" o
            JOIN Product p ON p.ID = o.Product_ID
            JOIN Person per ON per.ID = o.Person_ID
            WHERE o.ID = ?
        `,
        [id],
        (err, order) => {
            if (err) {
                return res.render("error", {
                    message: "Database error while loading order details.",
                    backUrl: "/orders"
                });
            }

            if (!order) {
                return res.render("error", {
                    message: "Order not found.",
                    backUrl: "/orders"
                });
            }

            const userId = req.session.user.id;

            db.get(`SELECT Person_ID AS 'ID' FROM Account WHERE ID = ?`, [userId],
                (err, row) => {
                    if (err) {
                        return res.render("error", {
                            message: "Database error.",
                            backUrl: `/orders`
                        });
                    }
                    if (
                        req.session.user.role === "customer" &&
                        order.Person_ID !== row.ID
                    ) {
                        return res.render("error", {
                            message: "You are not allowed to view this order.",
                            backUrl: "/orders"
                        });
                    }
                });
            res.render("orderDetails", { order, user: req.session.user });
        }
    );
});

router.post("/orders/:id/edit", authenticate, orderValidation, (req, res) => {
    const id = req.params.id;
    const { quantity } = req.body;

    db.get(
        `SELECT * FROM "Order" WHERE ID = ?`,
        [id],
        (err, order) => {
            if (err) {
                return res.render("error", {
                    message: "Database error while loading order.",
                    backUrl: "/orders"
                });
            }

            if (!order) {
                return res.render("error", {
                    message: "Order not found.",
                    backUrl: "/orders"
                });
            }

            const userId = req.session.user.id;

            db.get(`SELECT Person_ID AS 'ID' FROM Account WHERE ID = ?`, [userId],
                (err, row) => {
                    if (err) {
                        return res.render("error", {
                            message: "Database error.",
                            backUrl: `/orders/${productId}`
                        });
                    }
                    if (
                        req.session.user.role === "customer" &&
                        order.Person_ID !== row.ID
                    ) {
                        return res.render("error", {
                            message: "You are not allowed to modify this order.",
                            backUrl: `/orders/${id}`
                        });
                    }

                });

            db.run(
                `UPDATE "Order"
                 SET Quantity = ?
                 WHERE ID = ?`,
                [Number(quantity), id],
                err2 => {
                    if (err2) {
                        return res.render("error", {
                            message: "Database error while updating order.",
                            backUrl: `/orders/${id}`
                        });
                    }
                    res.redirect(`/orders/${id}`);
                }
            );
        }
    );
});

module.exports = router;
