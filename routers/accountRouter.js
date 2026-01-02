const express = require("express");
const bcrypt = require("bcrypt");
const { authenticate } = require("../middleware/authMiddleware.js");
const {
    accountPersonUpdateValidation,
    accountPasswordChangeValidation
} = require("../middleware/validationMiddleware");

const router = express.Router();
const db = require("../db.js");

router.get("/account", authenticate, (req, res) => {
    const accountId = req.session.user.id;

    db.get(
        `
            SELECT 
                Account.ID,
                Account.Username,
                Person.FirstName,
                Person.LastName,
                Person.Email,
                Person.Phone,
                AccountRole.Name as 'Role'
            FROM Account
            JOIN Person ON Person.ID = Account.Person_ID
            JOIN AccountRole on AccountRole.ID = Account.AccountRole_ID
            WHERE Account.ID = ?
            `,
        [accountId],
        (err, data) => {
            if (!data) {
                return res.render("error", {
                    message: "Account not found.",
                    backUrl: "/dashboard"
                });
            }

            res.render("account", { data });
        }
    );
});

router.post("/account/update-person", authenticate, accountPersonUpdateValidation,
    (req, res) => {
    const { firstName, lastName, email, phone } = req.body;
    const accountId = req.session.user.id;

    db.run(
        `
            UPDATE Person SET
                FirstName = ?,
                LastName = ?,
                Email = ?,
                Phone = ?
            WHERE ID = (SELECT Person_ID FROM Account WHERE ID = ?)
            `,
        [firstName, lastName, email, phone, accountId],
        err => {
            if (err) {
                return res.render("error", {
                    message: "Failed to update personal data.",
                    backUrl: "/account"
                });
            }
            res.redirect("/account");
        }
    );
});

router.post("/account/change-password", authenticate, accountPasswordChangeValidation, async (req, res) => {
    const { newPassword } = req.body;
    const accountId = req.session.user.id;

    const hash = await bcrypt.hash(newPassword, 10);

    db.run(
        `
            UPDATE Account
            SET Password = ?
            WHERE ID = ?
            `, [hash, accountId], err => {
            if (err) {
                return res.render("error", {
                    message: "Failed to change password.",
                    backUrl: "/account"
                });
            }
            res.redirect("/logout");
        }
    );
});

module.exports = router;