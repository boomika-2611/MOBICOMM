const backendUrl = "http://localhost:8083/api/user";

// Store token in sessionStorage
function setToken(token) {
    sessionStorage.setItem("userToken", token);
}

// Get token from sessionStorage
function getToken() {
    return sessionStorage.getItem("userToken");
}

// Remove token on logout
function logout() {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userMobile");
    window.location.href = "login.html";
}


document.getElementById("mobileNumber").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10); // Only allow numbers, max 10 digits
});

// Handle OTP request
document.getElementById("getOtpBtn").addEventListener("click", async function () {
    let mobileInput = document.getElementById("mobileNumber");
    let phoneNumber = mobileInput.value.trim();

    if (phoneNumber.length !== 10) {
        mobileInput.classList.add("is-invalid");
        return;
    } else {
        mobileInput.classList.remove("is-invalid");
    }

    try {
        let response = await fetch(`${backendUrl}/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber })
        });

        let data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to get OTP");

        alert("OTP sent successfully!");
        document.getElementById("getOtpBtn").style.display = "none";
        document.getElementById("enterOtpText").style.display = "block";
        document.getElementById("otpContainer").style.display = "flex";
        document.getElementById("verifyOtpBtn").style.display = "block";
        document.getElementById("resendOTP").style.display = "block";
    } catch (error) {
        showToast(error.message);
    }
});

// Handle Resend OTP
document.getElementById("resendOTP").addEventListener("click", function () {
    document.getElementById("getOtpBtn").click();
});

// Handle OTP input movement automatically
const otpInputs = document.querySelectorAll(".otp-input");

otpInputs.forEach((input, index) => {
    input.addEventListener("input", function (event) {
        let value = event.target.value;
        if (value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "Backspace" && this.value === "" && index > 0) {
            otpInputs[index - 1].focus();
        }
    });

    input.addEventListener("paste", function (event) {
        event.preventDefault();
        let pasteData = (event.clipboardData || window.clipboardData).getData("text");
        if (/^\d{4}$/.test(pasteData)) {
            otpInputs.forEach((inp, i) => {
                inp.value = pasteData[i] || "";
            });
            otpInputs[3].focus();
        }
    });
});

// Handle OTP verification with backend
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    let phoneNumber = document.getElementById("mobileNumber").value.trim();
    let enteredOTP = Array.from(document.querySelectorAll(".otp-input")).map(i => i.value).join("");

    if (phoneNumber.length !== 10 || enteredOTP.length !== 4) {
        showToast("Please enter a valid mobile number and OTP.");
        return;
    }

    try {
        let response = await fetch(`${backendUrl}/validate-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber, otp: enteredOTP }) // Send only 10 digits
        });

        let result = await response.json();
        if (!response.ok) throw new Error(result.error || "Invalid OTP");

        setToken(result.token);
        sessionStorage.setItem("userMobile", phoneNumber);

        showToast("Login Successful! Redirecting...");
        setTimeout(() => window.location.href = "customerDashboard.html", 2000);
    } catch (error) {
        showToast(error.message);
    }
});

// Show toast messages
function showToast(message) {
    let toastBody = document.querySelector("#toastMessage .toast-body");
    if (!toastBody) {
        const toastContainer = document.createElement("div");
        toastContainer.innerHTML = `
            <div id="toastMessage" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-body"></div>
            </div>
        `;
        document.body.appendChild(toastContainer);
        toastBody = document.querySelector("#toastMessage .toast-body");
    }
    toastBody.textContent = message;
    let toast = new bootstrap.Toast(document.getElementById("toastMessage"));
    toast.show();
}

