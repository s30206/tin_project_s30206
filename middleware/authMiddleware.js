function authenticate(req, res, next) {
    if (!req.session.user) {
        return res.render("error",
            {
                message: "You are not logged in!",
                backUrl: "/login"
            });
    }
    next();
}

function authEmployee(req, res, next) {
    if (req.session.user.role !== "employee") {
        return res.render("error",
            {
                message: "This functionality is not accessible to users with this role! Required role: employee",
                backUrl: "/dashboard"
            });
    }
    next();
}

function authCustomer(req, res, next) {
    if (req.session.user.role !== "customer") {
        return res.render("error",
            {
                message: "This functionality is not accessible to users with this role! Required role: customer",
                backUrl: "/dashboard"
            });
    }
    next();
}

module.exports = {
    authenticate,
    authEmployee,
    authCustomer
}