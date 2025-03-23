
function scrollToSection(event, sectionId) {
    event.preventDefault();
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

function scrollPlans(scrollValue) {
    const planScroll = document.getElementById("planScroll");
    planScroll.scrollLeft += scrollValue;
}

function showHelpSection() {
    // Hide other sections
    document.getElementById("heroCarousel").style.display = "none";
    document.getElementById("quickpay").style.display = "none";
    document.querySelector(".recommended-section").style.display = "none";
    document.getElementById("buyNewConnectionPage").style.display = "none";


    // Show the Help Section
    document.getElementById("helpSection").style.display = "block";
}



// Function to show the recharge modal
function showRechargeModal() {
    var myModal = new bootstrap.Modal(document.getElementById('rechargeModal'), {
        keyboard: false
    });
    myModal.show();
}

// Function to handle QuickPay button click 
// function useQuickPay() {
//     // For now, just show an alert
//     alert("Redirecting to QuickPay for instant recharge.");

// }

// Scroll functionality for the recommended plans section
function scrollPlans(scrollValue) {
    const planScroll = document.getElementById("planScroll");
    planScroll.scrollLeft += scrollValue;
}


function goHome() {
    // Hide transaction section completely 

    // Hide Buy New Connection & Help sections
    document.getElementById("buyNewConnectionPage").style.display = "none";
    document.getElementById("helpSection").style.display = "none";
    document.getElementById("payment").style.display = "none";
    document.getElementById("plans").style.display = "none";

    // Show main sections
    document.getElementById("heroCarousel").style.display = "block";
    document.getElementById("quickpay").style.display = "block";
    document.querySelector(".recommended-section").style.display = "block";

    // Clear QuickPay input (without affecting Buy New Connection)
    document.getElementById("customerMobile").value = '';
}

const BASE_URL = 'http://localhost:8083';

// Function to show the "Buy New Connection" page and hide other sections
function goToBuyNewConnection() {
    document.getElementById("heroCarousel").style.display = "none";
    document.getElementById("quickpay").style.display = "none";
    document.querySelector(".recommended-section").style.display = "none";
    document.getElementById("helpSection").style.display = "none";
    document.getElementById("buyNewConnectionPage").style.display = "block";
}

// Toast Notification Function (Bootstrap-based)
function showToast(message, title = "Notification", type = "info") {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.error("Toast container not found in DOM");
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast bg-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    toastContainer.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

// Validation for Customer Name
document.getElementById("customerName").addEventListener("blur", function () {
    const name = this.value.trim();
    const errorElement = document.getElementById("nameError");

    if (!name) {
        errorElement.textContent = "This field is required";
        this.classList.add("is-invalid");
    } else if (!/^[a-zA-Z0-9 ]{3,}$/.test(name)) {
        errorElement.textContent = "Enter at least 3 alphanumeric characters";
        this.classList.add("is-invalid");
    } else {
        errorElement.textContent = "";
        this.classList.remove("is-invalid");
    }
});

// Validation for Mobile Number
document.getElementById("mobileNumber").addEventListener("blur", function () {
    const mobile = this.value.trim();
    const errorElement = document.getElementById("mobileError");

    if (!mobile) {
        errorElement.textContent = "This field is required";
        this.classList.add("is-invalid");
    } else if (!/^\d{10}$/.test(mobile)) {
        errorElement.textContent = "Please enter a valid 10-digit mobile number!";
        this.classList.add("is-invalid");
    } else {
        errorElement.textContent = "";
        this.classList.remove("is-invalid");
    }
});

// Validation for Email (Mandatory)
document.getElementById("email").addEventListener("blur", function () {
    const email = this.value.trim();
    const errorElement = document.getElementById("emailError");

    if (!email) {
        errorElement.textContent = "This field is required";
        this.classList.add("is-invalid");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorElement.textContent = "Please enter a valid email address!";
        this.classList.add("is-invalid");
    } else {
        errorElement.textContent = "";
        this.classList.remove("is-invalid");
    }
});

// Validation for Password
document.getElementById("password").addEventListener("blur", function () {
    const password = this.value.trim();
    const errorElement = document.getElementById("passwordError");

    if (!password) {
        errorElement.textContent = "This field is required";
        this.classList.add("is-invalid");
    } else if (password.length < 6) {
        errorElement.textContent = "Password must be at least 6 characters long!";
        this.classList.add("is-invalid");
    } else {
        errorElement.textContent = "";
        this.classList.remove("is-invalid");
    }
});

// Validation and Preview for Aadhaar Upload
document.getElementById("aadhaarUpload").addEventListener("change", function () {
    const errorElement = document.getElementById("aadhaarError");
    const preview = document.getElementById("aadhaarPreview");
    const file = this.files[0];

    if (!file) {
        errorElement.textContent = "Please upload your Aadhaar card!";
        this.classList.add("is-invalid");
        preview.src = "";
        preview.style.display = "none";
    } else {
        errorElement.textContent = "";
        this.classList.remove("is-invalid");
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result; // Show preview
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

// Handle Form Submission
document.getElementById("newConnectionForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const customerName = document.getElementById("customerName").value.trim();
    const mobileNumber = document.getElementById("mobileNumber").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const aadhaarFile = document.getElementById("aadhaarUpload").files[0];

    // Client-side validation
    if (!customerName || !/^[a-zA-Z0-9 ]{3,}$/.test(customerName)) {
        showToast("Please enter a valid name with at least 3 alphanumeric characters!", "Error", "danger");
        return;
    }

    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
        showToast("Please enter a valid 10-digit mobile number!", "Error", "danger");
        return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email address!", "Error", "danger");
        return;
    }

    if (!password || password.length < 6) {
        showToast("Please enter a password with at least 6 characters!", "Error", "danger");
        return;
    }

    if (!aadhaarFile) {
        showToast("Please upload your Aadhaar card!", "Error", "danger");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
        const aadhaarData = event.target.result; // Base64 string
        const kycRequest = {
            mobileNumber,
            customerName,
            aadharDocument: aadhaarData,
            password,
            email, // Email is now mandatory
            status: "Pending"
        };

        try {
            const response = await fetch(`${BASE_URL}/customer/kyc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(kycRequest)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            showToast(result.message, "Success", "success");

            // Store in sessionStorage
            sessionStorage.setItem("lastSubmittedKYCRequest", JSON.stringify(kycRequest));
            console.log("Stored Last Submitted KYC Request:", kycRequest);

            // Reset form and clear preview
            document.getElementById("newConnectionForm").reset();
            document.getElementById("aadhaarPreview").src = "";
            document.getElementById("aadhaarPreview").style.display = "none";
            document.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
            document.getElementById("nameError").textContent = "";
            document.getElementById("mobileError").textContent = "";
            document.getElementById("emailError").textContent = "";
            document.getElementById("passwordError").textContent = "";
            document.getElementById("aadhaarError").textContent = "";
        } catch (error) {
            console.error("Error submitting KYC request:", error);
            showToast(`Failed to submit KYC request: ${error.message}`, "Error", "danger");
        }
    };
    reader.readAsDataURL(aadhaarFile);
});

// View Latest KYC Request (Show only locally stored request)
function viewRequest() {
    try {
        // Get stored request from sessionStorage
        const storedRequest = JSON.parse(sessionStorage.getItem("lastSubmittedKYCRequest"));
        if (!storedRequest) {
            showToast("No KYC request has been submitted yet in this session.", "Info", "info");
            return;
        }

        // Display the stored request details
        const statusClass = "status-" + storedRequest.status.toLowerCase();
        const toastMessage = `
            <strong>Name:</strong> ${storedRequest.customerName}<br>
            <strong>Mobile:</strong> ${storedRequest.mobileNumber}<br>
            <strong>Email:</strong> ${storedRequest.email}<br>
            <strong>Status:</strong> <span class="${statusClass}">${storedRequest.status}</span><br>
            <img src="${storedRequest.aadharDocument}" alt="Aadhaar Preview" style="max-width: 120px; margin-top: 10px;" />
        `;
        showToast(toastMessage, "KYC Request", "info");
    } catch (error) {
        console.error("Error displaying KYC request:", error);
        showToast(`Failed to display KYC request: ${error.message}`, "Error", "danger");
    }
}

function showToast(message) {
    let toastContainer = document.createElement("div");
    toastContainer.className = "toast-message";
    toastContainer.innerHTML = message;
    document.body.appendChild(toastContainer);

    setTimeout(() => {
        toastContainer.classList.add("show");
    }, 100);

    setTimeout(() => {
        toastContainer.classList.remove("show");
        setTimeout(() => document.body.removeChild(toastContainer), 300);
    }, 3000);
}

// CSS for toast message
const toastStyles = document.createElement("style");
toastStyles.innerHTML = `
    .toast-message {
        position: fixed;
        bottom:100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    .toast-message.show {
        opacity: 1;
    }
`;
document.head.appendChild(toastStyles);


const QuickPay_URL = 'http://localhost:8083';
const plansData = [
    { amount: 199, benefits: "1GB/day, 28 days validity" },
    { amount: 299, benefits: "1.5GB/day, 56 days validity" },
    { amount: 399, benefits: "2GB/day, 84 days validity" },
    { amount: 499, benefits: "2GB/day, 90 days validity" },
    { amount: 599, benefits: "2GB/day, 110 days validity" },
    { amount: 799, benefits: "3GB/day, 85 days validity" },
    { amount: 899, benefits: "2GB/day, 84 days validity" },
    { amount: 699, benefits: "4GB/day, 100 days validity" },
    { amount: 999, benefits: "3GB/day, 150 days validity" }
];

// Variable to store registered mobile numbers
let registeredNumbers = [];

// Fetch registered mobile numbers from the backend on page load
async function fetchRegisteredNumbers() {
    try {
        const response = await fetch(`${QuickPay_URL}/public/registered-numbers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        registeredNumbers = await response.json();
        console.log("Registered mobile numbers:", registeredNumbers);
    } catch (error) {
        console.error("Error fetching registered mobile numbers:", error);
        showToast("Failed to fetch registered numbers. Please try again later.", "Error", "danger");
    }
}

// Call fetchRegisteredNumbers when the page loads
document.addEventListener('DOMContentLoaded', fetchRegisteredNumbers);

function handleRecharge() {
    let mobileNumber = document.getElementById("customerMobile").value.trim();
    let errorMessage = document.getElementById("errorMessage");

    if (mobileNumber === "") {
        errorMessage.textContent = "This field is required!";
        errorMessage.style.display = "block";
        return;
    }

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
        errorMessage.textContent = "Please enter a valid 10-digit mobile number!";
        errorMessage.style.display = "block";
        return;
    }

    errorMessage.style.display = "none"; // Hide error if input is valid

    // Check if mobile number is registered
    if (!registeredNumbers.includes(mobileNumber)) {
        showToast("This number is not a MobiComm registered number. Kindly buy a new connection and make a recharge.", "Error", "danger");
        return;
    }

    document.getElementById("quickpay").style.display = "none";
    document.getElementById("plans").style.display = "block";
    displayPlans();
}

// Function to clear the error message when user starts typing
document.getElementById("customerMobile").addEventListener("input", function () {
    document.getElementById("errorMessage").style.display = "none";
});

function displayPlans() {
    let container = document.getElementById("planContainer");
    container.innerHTML = "";

    plansData.forEach(plan => {
        container.innerHTML += `
            <div class="col-md-4">
                <div class="card p-3 text-center shadow-sm">
                    <h5 class="fw-bold text-danger">₹${plan.amount} Plan</h5>
                    <p>${plan.benefits}</p>
                    <button class="btn btn-danger w-100 mt-2" onclick="moveToPayment(${plan.amount}, '${plan.benefits}')">Recharge Now</button>
                </div>
            </div>`;
    });
}

function goBackToQuickPay() {
    document.getElementById("plans").style.display = "none";
    document.getElementById("quickpay").style.display = "block";
}

// Function to show toast message
function showToast(message, title = "Notification", type = "info") {
    let toastContainer = document.createElement("div");
    toastContainer.className = "toast align-items-center show position-fixed bottom-0 end-0 p-3";
    toastContainer.style.zIndex = "1050";
    toastContainer.style.backgroundColor = type === "danger" ? "rgba(26, 18, 18, 0.84)" : "rgba(0, 0, 0, 0.8)";
    toastContainer.style.color = "white";
    toastContainer.style.borderRadius = "8px";

    toastContainer.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    document.body.appendChild(toastContainer);

    setTimeout(() => {
        toastContainer.remove();
    }, 8000); 
}

function moveToPayment(amount, benefits) {
    document.getElementById("selectedPlan").innerText = `₹${amount}`;
    document.getElementById("selectedBenefits").innerText = benefits;
    document.getElementById("plans").style.display = "none";
    document.getElementById("payment").style.display = "block";
}

function goBackToPlans() {
    document.getElementById("payment").style.display = "none";
    document.getElementById("plans").style.display = "block";
}

function processPayment() {
    let paymentButton = document.querySelector(".btn-success");
    paymentButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Processing...';
    paymentButton.disabled = true;

    setTimeout(() => {
        let mobileNumber = document.getElementById("customerMobile").value;
        let selectedPlan = document.getElementById("selectedPlan").innerText;
        let paymentMethod = document.getElementById("paymentMethod").value;

        showToast("Payment successful using " + paymentMethod + "!", "Success", "success");
        generateInvoice(mobileNumber, selectedPlan, paymentMethod);

        paymentButton.innerHTML = "Pay Now";
        paymentButton.disabled = false;

        document.getElementById("downloadInvoice").style.display = "block";
    }, 1000);
}

function generateInvoice(mobileNumber, plan, paymentMethod) {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("MOBICOMM", 20, 20);
    doc.setFontSize(10);
    doc.text("123 Street, Bangalore, India", 20, 30);
    doc.text("Email: support@mobicomm.in | Phone: +123 456 7890", 20, 35);

    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0);
    doc.text("Transaction Invoice", 80, 50);
    doc.line(20, 55, 190, 55);

    const tableData = [
        ["Mobile Number", mobileNumber],
        ["Selected Plan", plan],
        ["Payment Method", paymentMethod],
        ["Transaction Status", "Successful"]
    ];

    doc.autoTable({
        startY: 65,
        head: [["Details", "Information"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [255, 0, 0] }
    });

    doc.text("Thank you for your payment!", 80, doc.lastAutoTable.finalY + 20);
    window.generatedInvoice = doc;
}

function downloadInvoice() {
    if (window.generatedInvoice) {
        window.generatedInvoice.save(`Invoice_${document.getElementById("customerMobile").value}.pdf`);
    } else {
        showToast("No invoice available to download.", "Error", "danger");
    }
}

// Recommended Plans Section Functions
function scrollPlans(direction) {
    const container = document.getElementById("planScroll");
    container.scrollBy({ left: direction, behavior: "smooth" });
}

function showRechargeModal() {
    const modal = new bootstrap.Modal(document.getElementById("rechargeModal"));
    modal.show();
}

function useQuickPay() {
    const modal = bootstrap.Modal.getInstance(document.getElementById("rechargeModal"));
    modal.hide();
    document.getElementById("quickpay").style.display = "block";
    document.getElementById("plans").style.display = "none";
    document.getElementById("payment").style.display = "none";
}


// Show or Hide the Back to Top Button
window.onscroll = function () {
    let btn = document.getElementById("backToTop");
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        btn.classList.add("show");
    } else {
        btn.classList.remove("show");
    }
};

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}


document.addEventListener("DOMContentLoaded", function () {
    let navLinks = document.querySelectorAll(".nav-link");

    // Remove active class on page load
    navLinks.forEach(link => link.classList.remove("active"));

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove("active"));

            // Add active class to the clicked link
            this.classList.add("active");
        });
    });
});

