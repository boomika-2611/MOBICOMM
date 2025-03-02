
let allowedNumbers = ["9025159692", "9344863775", "9543530931"];
let generatedOTP = "";

document.getElementById("mobileNumber").addEventListener("input", function () {
    let mobileInput = document.getElementById("mobileNumber");
    let mobileNumber = mobileInput.value.trim();

    if (/^\d{10}$/.test(mobileNumber)) {
        mobileInput.classList.remove("is-invalid");
    }
});

document.getElementById("getOtpBtn").addEventListener("click", function () {
    let mobileInput = document.getElementById("mobileNumber");
    let mobileNumber = mobileInput.value.trim();

    if (!/^\d{10}$/.test(mobileNumber)) {
        mobileInput.classList.add("is-invalid");
        return;
    } else {
        mobileInput.classList.remove("is-invalid");
    }

    if (!allowedNumbers.includes(mobileNumber)) {
        showToast("This mobile number is not registered. Please purchase a new connection to access the platform.");
        return;
    }

    generateOTP();
    document.getElementById("getOtpBtn").style.display = "none";
    document.getElementById("enterOtpText").style.display = "block";
    document.getElementById("otpContainer").style.display = "flex";
    document.getElementById("verifyOtpBtn").style.display = "block";
    document.getElementById("resendOTP").style.display = "block";
});

function generateOTP() {
    generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    alert("Your OTP is: " + generatedOTP);
}

document.getElementById("resendOTP").addEventListener("click", function () {
    generateOTP();
});

const otpInputs = document.querySelectorAll(".otp-input");
otpInputs.forEach((input, index) => {
    input.addEventListener("input", function () {
        if (this.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "Backspace" && this.value === "" && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    let enteredOTP = otpInputs[0].value + otpInputs[1].value + otpInputs[2].value + otpInputs[3].value;

    if (enteredOTP === generatedOTP) {
        showToast("Login Successful! Redirecting to Subscribers Dashboard...");
        setTimeout(() => {
            window.location.href = "customerDashboard.html";
        }, 2000);
    } else {
        showToast("Invalid OTP! Please try again.");
    }
});

function showToast(message) {
    let toastBody = document.querySelector("#toastMessage .toast-body");
    toastBody.textContent = message;
    let toast = new bootstrap.Toast(document.getElementById("toastMessage"));
    toast.show();
}
