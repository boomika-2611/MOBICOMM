

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

function showTooltip(input, message) {
    input.setAttribute("title", message);
    input.setAttribute("data-bs-original-title", message);
    bootstrap.Tooltip.getInstance(input)?.dispose();
    new bootstrap.Tooltip(input);
    input.classList.add("is-invalid");
}

function hideTooltip(input) {
    input.setAttribute("title", "");
    input.setAttribute("data-bs-original-title", "");
    bootstrap.Tooltip.getInstance(input)?.dispose();
    input.classList.remove("is-invalid");
}

document.getElementById("adminUsername").addEventListener("blur", function () {
    if (this.value.trim() === "") {
        showTooltip(this, "This field is required");
    } else {
        hideTooltip(this);
    }
});

document.getElementById("adminPassword").addEventListener("blur", function () {
    if (this.value.trim() === "") {
        showTooltip(this, "This field is required");
    } else {
        hideTooltip(this);
    }
});

function showToast(message, type = "success") {
    let toastElement = document.getElementById("toastMessage");
    let toastBody = document.getElementById("toastBody");

    // Set message and class based on type
    toastBody.textContent = message;
    toastElement.classList.remove("bg-success", "bg-danger");
    toastElement.classList.add(type === "success" ? "bg-success" : "bg-danger");

    let toast = new bootstrap.Toast(toastElement);
    toast.show();
}

document.getElementById("adminLoginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    var username = document.getElementById("adminUsername");
    var password = document.getElementById("adminPassword");

    if (username.value.trim() === "") {
        showTooltip(username, "This field is required");
        return;
    }

    if (password.value.trim() === "") {
        showTooltip(password, "This field is required");
        return;
    }

    // Dummy credentials for admin login
    if (username.value === "admin" && password.value === "admin123") {
        showToast("Login Successful! Redirecting to Admin Dashboard...", "success");
        setTimeout(() => {
            window.location.href = "adminDashboard.html";
        }, 1000);
    } else {
        showToast("Invalid Credentials! Please try again.", "danger");
    }
});

