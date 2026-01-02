const express = require("express");
const { authenticate, authEmployee } = require("../middleware/authMiddleware.js");
const { productValidation } = require("../middleware/validationMiddleware.js");

const router = express.Router();
const db = require("../db.js");

router.get("/products/new", authenticate, authEmployee, (req, res) => {
    res.render("newProduct");
});

router.post("/products/new", authenticate, authEmployee, productValidation, (req, res) => {
    const { name, description, price } = req.body;

    db.run(`
                INSERT INTO Product (Name, Description, Price)
                VALUES (?, ?, ?)
            `, [name.trim(), description.trim(), Number(price)],
        function (err) {
            if (err) {
                console.error(err);
                return res.render("error", {
                    message: "Database error while adding product.",
                    backUrl: "/products/new"
                });
            }

            res.redirect("/products");
        }
    );
});


router.get("/products", authenticate, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 2;
    const offset = (page - 1) * pageSize;

    db.all(
        `SELECT COUNT(*) AS count FROM Product`,
        (err, countRows) => {
            if (err) return res.send("DB error");

            const totalItems = countRows[0].count;
            const totalPages = Math.ceil(totalItems / pageSize);

            db.all(
                "SELECT ID, Name, Price FROM Product LIMIT ? OFFSET ?",
                [pageSize, offset],
                (err, rows) => {
                    if (err) return res.send("DB error");

                    res.render("products", {
                        products: rows,
                        currentPage: page,
                        totalPages,
                        user: req.session.user
                    });
                }
            );
        }
    );
});

router.get("/products/:id", authenticate, (req, res) => {
    const productId = req.params.id;

    db.get(
        `SELECT * FROM Product WHERE ID = ?`,
        [productId],
        (err, product) => {
            if (!product) {
                return res.render("error", {
                    message: "Product not found.",
                    backUrl: "/products"
                });
            }

            res.render("productDetails", {
                product,
                user: req.session.user
            });
        }
    );
});

router.get("/products/:id/edit", authenticate, authEmployee, (req, res) => {
    const productId = req.params.id;

    db.get(
        `SELECT * FROM Product WHERE ID = ?`,
        [productId],
        (err, product) => {
            if (!product) {
                return res.render("error", {
                    message: "Product not found.",
                    backUrl: "/products"
                });
            }

            res.render("editProduct", { product });
        }
    );
});

router.post(
    "/products/:id/edit",
    authenticate,
    authEmployee,
    productValidation,
    (req, res) => {
        const productId = req.params.id;
        const { name, description, price } = req.body;

        db.run(
            `
            UPDATE Product
            SET Name = ?, Description = ?, Price = ?
            WHERE ID = ?
            `,
            [name.trim(), description.trim(), Number(price), productId],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.render("error", {
                        message: "Database error while updating product.",
                        backUrl: `/products/${productId}`
                    });
                }

                res.redirect(`/products/${productId}`);
            }
        );
    }
);

module.exports = router;