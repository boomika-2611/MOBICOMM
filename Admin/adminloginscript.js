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
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        let result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Login failed");
        }

        // Store the JWT token and username in sessionStorage
        sessionStorage.setItem("adminToken", result.token);
        sessionStorage.setItem("adminUsername", username);

        showToast(result.message || "Admin Login Successful! Redirecting...", "success");

        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = "adminDashboard.html";
        }, 2000);

    } catch (error) {
        showToast(error.message, "danger");
    }
});

// Utility function to get token from sessionStorage
function getAdminToken() {
    return sessionStorage.getItem("adminToken");
}

// Utility function to check if admin is logged in
function isAdminLoggedIn() {
    return !!sessionStorage.getItem("adminToken");
}

// Logout function
function adminLogout() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    window.location.href = "adminLogin.html";
}

// Function to make authenticated requests to protected endpoints
async function makeAuthenticatedRequest(url, method = "GET", data = null) {
    const token = getAdminToken();

    if (!token) {
        showToast("Please login first", "danger");
        setTimeout(() => window.location.href = "adminLogin.html", 1000);
        return;
    }

    try {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        const config = {
            method,
            headers,
            mode: 'cors', // Added for consistency with dashboard script
            ...(data && { body: JSON.stringify(data) })
        };

        const response = await fetch(url, config);
        if (!response.ok) {
            if (response.status === 401) {
                adminLogout();
                throw new Error("Session expired. Please login again.");
            }
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return await response.text();

    } catch (error) {
        console.error(`Error in ${method} ${url}:`, error);
        showToast(error.message, "danger");
        throw error;
    }
}

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
