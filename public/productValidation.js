const form = document.getElementById("productForm");
const feedback = document.getElementById("productFeedback");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    feedback.textContent = "";

    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = Number(document.getElementById("price").value);

    if (name.length < 2)
        feedback.textContent = "Name must be at least 2 characters long.";

    if (description.length < 5)
        feedback.textContent = "Description must be at least 5 characters long.";

    if (!Number.isFinite(price) || price <= 0)
        feedback.textContent = "Price must be a number greater than 0.";

    form.submit();
});
