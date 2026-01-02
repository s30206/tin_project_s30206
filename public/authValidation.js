const form = document.getElementById("registerForm");
const feedbackEl = document.getElementById("formFeedback");

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateUsername(username) {
    return username && username.length >= 4;
}

function validatePassword(password) {
    return password.length >= 6;
}

function validatePhone(phone) {
    const re = /^[0-9+\-\s]{6,20}$/;
    return re.test(phone);
}

function validateFormData(data) {
    const errors = {};

    if (!data.firstName || data.firstName.trim().length < 2)
        errors.firstName = "First name must be at least 2 characters.";

    if (!data.lastName || data.lastName.trim().length < 2)
        errors.lastName = "Last name must be at least 2 characters.";

    if (!validateEmail(data.email))
        errors.email = "Invalid email format.";

    if (!validatePhone(data.phone))
        errors.phone = "Invalid phone number.";

    if (!validateUsername(data.username))
        errors.username = "Username must be at least 4 characters.";

    if (!validatePassword(data.password))
        errors.password = "Password must be at least 6 characters.";

    if (!data.role)
        errors.role = "Please select a role.";

    return errors;
}

form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    feedbackEl.textContent = "";

    const data = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        role: document.getElementById("role").value
    };

    const errors = validateFormData(data);
    if (Object.keys(errors).length > 0) {
        feedbackEl.textContent = Object.values(errors)[0];
        return;
    }

    form.submit();
});
