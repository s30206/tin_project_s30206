const personForm = document.getElementById("updatePersonForm");
const personFeedback = document.getElementById("personFeedback");

const pwdForm = document.getElementById("changePasswordForm");
const passwordFeedback = document.getElementById("passwordFeedback");

function showFeedback(el, msg) {
    el.textContent = msg;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);

}

function validatePhone(phone) {
    const re = /^[0-9+\-\s]{6,20}$/;
    return re.test(phone);
}

personForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    showFeedback(personFeedback, "");

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    let msg = "";

    if (firstName.length < 2) msg = "First name must be at least 2 characters.";
    else if (lastName.length < 2) msg = "Last name must be at least 2 characters.";
    else if (!validateEmail(email)) msg = "Email address format is invalid.";
    else if (!validatePhone(phone)) msg = "Phone number format is invalid.";

    if (msg !== "") {
        showFeedback(personFeedback, msg);
        return;
    }

    personForm.submit();
});

pwdForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    showFeedback(passwordFeedback, "");

    const newPassword = document.getElementById("newPassword").value;

    let msg = "";

    if (newPassword.length < 6) msg = "Password must be at least 6 characters long.";

    if (msg !== "") {
        showFeedback(passwordFeedback, msg);
        return;
    }

    pwdForm.submit();
});
