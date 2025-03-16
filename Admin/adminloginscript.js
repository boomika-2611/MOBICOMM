const adminBackendUrl = "http://localhost:8083/auth/admin"; 

// Handle Admin Login
document.getElementById("adminLoginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let username = document.getElementById("adminUsername").value.trim();
    let password = document.getElementById("adminPassword").value.trim();

    if (!username || !password) {
        showToast("Please enter both username and password", "danger");
        return;
    }

    try {
        let response = await fetch(`${adminBackendUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        let result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Login failed");
        }

        showToast("Admin Login Successful! Redirecting...");
        setTimeout(() => {
            window.location.href = "adminDashboard.html";
        }, 2000);
    } catch (error) {
        showToast(error.message, "danger");
    }
});

// Show toast messages
function showToast(message, type = "success") {
    let toastElement = document.getElementById("toastMessage");
    let toastBody = document.getElementById("toastBody");

    toastBody.textContent = message;
    toastElement.classList.remove("bg-success", "bg-danger");
    toastElement.classList.add(type === "success" ? "bg-success" : "bg-danger");

    let toast = new bootstrap.Toast(toastElement);
    toast.show();
}
