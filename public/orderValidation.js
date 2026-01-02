const form = document.getElementById("orderForm");
const feedback = document.getElementById("orderFeedback");

form.addEventListener("submit", e => {
    e.preventDefault();
    feedback.textContent = "";

    const quantity = Number(document.getElementById("quantity").value);

    if (!Number.isInteger(quantity) || quantity <= 0) {
        return feedback.textContent = "Quantity must be a positive whole number.";
    }

    form.submit();
});