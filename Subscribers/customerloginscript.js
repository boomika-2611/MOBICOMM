const backendUrl = "http://localhost:8083/auth/user"; 
let generatedOTP = "";

// Ensure +91 is always present in the input field
document.getElementById("mobileNumber").addEventListener("focus", function () {
    if (!this.value.startsWith("+91")) {
        this.value = "+91";
    }
});

// Prevent user from deleting +91
document.getElementById("mobileNumber").addEventListener("input", function () {
    if (!this.value.startsWith("+91")) {
        this.value = "+91";
    }

    // Allow only 10 digits after +91
    let numericPart = this.value.slice(3).replace(/\D/g, ""); // Remove non-numeric chars
    if (numericPart.length > 10) {
        numericPart = numericPart.slice(0, 10); // Limit to 10 digits
    }
    this.value = "+91" + numericPart;

    if (numericPart.length === 10) {
        this.classList.remove("is-invalid");
    }
});

// Handle OTP request from backend
document.getElementById("getOtpBtn").addEventListener("click", async function () {
    let mobileInput = document.getElementById("mobileNumber");
    let mobileNumber = mobileInput.value.trim();

    if (mobileNumber.length !== 13) { 
        mobileInput.classList.add("is-invalid");
        return;
    } else {
        mobileInput.classList.remove("is-invalid");
    }

    try {
        let response = await fetch(`${backendUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber: mobileNumber })
        });

        let otpData = await response.json();
        if (!response.ok) {
            throw new Error(otpData.error || "Failed to get OTP");
        }

        generatedOTP = otpData.otp; 
        alert("Your OTP is: " + generatedOTP); 

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
    let mobileNumber = document.getElementById("mobileNumber").value.trim();
    let enteredOTP = Array.from(document.querySelectorAll(".otp-input")).map(i => i.value).join("");

    try {
        let response = await fetch(`${backendUrl}/validate-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber: mobileNumber, otp: enteredOTP })
        });

        let result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Invalid OTP");
        }

        showToast("Login Successful! Redirecting...");
        setTimeout(() => {
            window.location.href = "customerDashboard.html";
        }, 2000);
    } catch (error) {
        showToast(error.message);
    }
});

// Show toast messages
function showToast(message) {
    let toastBody = document.querySelector("#toastMessage .toast-body");
    toastBody.textContent = message;
    let toast = new bootstrap.Toast(document.getElementById("toastMessage"));
    toast.show();
}
