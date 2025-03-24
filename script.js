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

// Variable to store registered mobile numbers
let registeredNumbers = [];

// Variables to store selected plan details
let selectedPlanId = null;
let selectedPlanAmount = null;
let selectedPlanBenefits = '';
let selectedPaymentMethod = '';

// Utility function to show toast notifications
function showToast(message, type) {
    const toastEl = document.getElementById('toast');
    if (!toastEl) {
        console.error("Toast element not found in the DOM.");
        return;
    }
    const toastBody = toastEl.querySelector('.toast-body');
    toastBody.textContent = message;
    toastEl.className = `toast bg-${type} text-white`;
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

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
        showToast("Failed to fetch registered numbers. Please try again later.", "danger");
    }
}

// Utility function to get customer token from sessionStorage
function getCustomerToken() {
    return sessionStorage.getItem('customerToken');
}

// Utility function to check if customer token exists
function isCustomerAuthenticated() {
    return !!sessionStorage.getItem('customerToken');
}

// Function to make authenticated requests using customer token
async function makeCustomerAuthenticatedRequest(url, method = "GET", data = null) {
    const token = getCustomerToken();

    if (!token) {
        showToast("Please authenticate with a registered mobile number.", "danger");
        setTimeout(() => goBackToQuickPay(), 1000);
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
            mode: 'cors',
            ...(data && { body: JSON.stringify(data) })
        };

        const response = await fetch(url, config);
        if (!response.ok) {
            if (response.status === 401) {
                sessionStorage.removeItem("customerToken");
                sessionStorage.removeItem("userMobile");
                showToast("Session expired. Please re-authenticate.", "danger");
                setTimeout(() => goBackToQuickPay(), 1000);
                return;
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

// Call fetchRegisteredNumbers when the page loads
document.addEventListener('DOMContentLoaded', fetchRegisteredNumbers);

async function handleRecharge() {
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
        showToast("This number is not a MobiComm registered number. Kindly buy a new connection and make a recharge.", "danger");
        return;
    }

    // Generate customer token
    try {
        const response = await fetch(`${QuickPay_URL}/public/generate-customer-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mobileNumber })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        sessionStorage.setItem("customerToken", result.token);
        sessionStorage.setItem("userMobile", mobileNumber);
        showToast("Authentication successful! Proceeding to plans.", "success");

        document.getElementById("quickpay").style.display = "none";
        document.getElementById("plans").style.display = "block";
        loadPopularPlans();
    } catch (error) {
        console.error("Error generating customer token:", error);
        showToast(error.message, "danger");
    }
}

// Function to clear the error message when user starts typing
document.getElementById("customerMobile").addEventListener("input", function () {
    document.getElementById("errorMessage").style.display = "none";
});

// Load Popular Plans
async function loadPopularPlans() {
    try {
        const url = `${QuickPay_URL}/customer/plans/search?categoryName=Popular Plans`;
        const plans = await makeCustomerAuthenticatedRequest(url);
        console.log('Popular Plans received:', plans);

        // Display plans
        displayPlans(plans);
    } catch (error) {
        console.error('Error fetching popular plans:', error);
        showToast('Failed to load popular plans. Please try again.', "danger");
        const planContainer = document.getElementById('planContainer');
        if (planContainer) {
            planContainer.innerHTML = '<p class="text-danger">Error loading plans. Please try again later.</p>';
        }
        goBackToQuickPay(); // Redirect back to QuickPay on error
    }
}

function displayPlans(plans) {
    let container = document.getElementById("planContainer");
    container.innerHTML = "";

    if (!plans || plans.length === 0) {
        container.innerHTML = '<p>No popular plans available.</p>';
        return;
    }

    plans.forEach(plan => {
        container.innerHTML += `
            <div class="col-md-4">
                <div class="card p-3 text-center shadow-sm" onclick="selectPlan(${plan.id}, ${plan.price}, '${plan.dataPerDay} for ${plan.validityDays} days', this)">
                    <h5 class="fw-bold text-danger">₹${plan.price} Plan</h5>
                    <p class="text-dark">${plan.dataPerDay} for ${plan.validityDays} days</p>
                    <button class="btn btn-danger w-100 mt-2 fw-bold"
                        style="background: linear-gradient(90deg, #C70039, #900C3F); border: none; padding: 10px; border-radius: 20px;"
                        onclick="moveToPayment(${plan.id}, ${plan.price}, '${plan.dataPerDay} for ${plan.validityDays} days'); event.stopPropagation();">Recharge Now</button>
                </div>
            </div>`;
    });
}

function goBackToQuickPay() {
    document.getElementById("plans").style.display = "none";
    document.getElementById("payment").style.display = "none";
    document.getElementById("transactionSection").style.display = "none";
    document.getElementById("quickpay").style.display = "block";
    document.getElementById("planContainer").innerHTML = "";
    document.getElementById("downloadInvoice").style.display = "none"; // Hide download button
    selectedPlanId = null;
    selectedPlanAmount = null;
    selectedPlanBenefits = '';
    selectedPaymentMethod = '';
    const mobileInput = document.getElementById("customerMobile");
    if (mobileInput) {
        mobileInput.value = "";
    }
    
    // Do not clear userMobile immediately to allow invoice download
    // sessionStorage.removeItem("customerToken");
    // sessionStorage.removeItem("userMobile");
}

// Plan Selection
function selectPlan(planId, amount, benefits, element) {
    selectedPlanId = planId;
    selectedPlanAmount = amount;
    selectedPlanBenefits = benefits;
    document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    showToast(`Plan ₹${amount} selected`, "success");
}

function moveToPayment(planId, amount, benefits) {
    const mobileNumber = sessionStorage.getItem('userMobile');
    if (!mobileNumber || !isCustomerAuthenticated()) {
        showToast("Please authenticate with a registered mobile number.", "danger");
        goBackToQuickPay();
        return;
    }

    // Double-check if the mobile number is registered
    if (!registeredNumbers.includes(mobileNumber)) {
        showToast("This number is not a MobiComm registered number. Kindly buy a new connection and make a recharge.", "danger");
        goBackToQuickPay();
        return;
    }

    selectedPlanId = planId;
    selectedPlanAmount = amount;
    selectedPlanBenefits = benefits;

    document.getElementById("selectedPlan").innerText = `₹${amount}`;
    document.getElementById("selectedBenefits").innerText = benefits;
    document.getElementById("plans").style.display = "none";
    document.getElementById("payment").style.display = "block";
}

function goBackToPlans() {
    document.getElementById("payment").style.display = "none";
    document.getElementById("plans").style.display = "block";
    selectedPaymentMethod = ''; // Reset payment method
}

// Payment Method Selection
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    showToast(`${method} selected as payment method`, "success");
}

// Process Payment with Razorpay
async function processPayment() {
    if (!isCustomerAuthenticated()) {
        showToast("Please authenticate with a registered mobile number.", "danger");
        setTimeout(() => goBackToQuickPay(), 1000);
        return;
    }

    if (!selectedPaymentMethod) {
        showToast("Please select a payment method before proceeding.", "danger");
        return;
    }

    const mobileNumber = sessionStorage.getItem('userMobile');
    if (!mobileNumber || !selectedPlanId || !selectedPlanAmount) {
        showToast("Error: Missing mobile number or selected plan!", "danger");
        goBackToQuickPay();
        return;
    }

    // Double-check if the mobile number is registered
    if (!registeredNumbers.includes(mobileNumber)) {
        showToast("This number is not a MobiComm registered number. Kindly buy a new connection and make a recharge.", "danger");
        goBackToQuickPay();
        return;
    }

    let paymentButton = document.querySelector(".btn-success");
    paymentButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Processing...';
    paymentButton.disabled = true;

    try {
        // Step 1: Create Razorpay order
        const orderResponse = await makeCustomerAuthenticatedRequest(
            `${QuickPay_URL}/customer/payment/create-order`,
            "POST",
            { amount: selectedPlanAmount }
        );
        const orderId = orderResponse;

        // Step 2: Open Razorpay payment UI
        const options = {
            key: 'rzp_test_4mqwZ2yylKYX0g', // Replace with your Razorpay key_id
            amount: selectedPlanAmount * 100, // Amount in paise
            currency: 'INR',
            name: 'Recharge App',
            description: 'Plan Recharge',
            order_id: orderId,
            handler: async function (response) {
                try {
                    // Step 3: After payment success, call the recharge endpoint
                    const rechargeData = {
                        mobileNumber: mobileNumber,
                        email: "boomikamohan316@gmail.com"
                    };
                    const rechargeResponse = await makeCustomerAuthenticatedRequest(
                        `${QuickPay_URL}/customer/plans/recharge/${selectedPlanId}?paymentId=${response.razorpay_payment_id}`,
                        "POST",
                        rechargeData
                    );

                    // Generate the invoice after successful payment
                    generateInvoice(mobileNumber, `₹${selectedPlanAmount} (${selectedPlanBenefits})`, selectedPaymentMethod);

                    showToast("Payment Successful! ✅", "success");
                    paymentButton.innerHTML = "Pay Now";
                    paymentButton.disabled = false;
                    document.getElementById("downloadInvoice").style.display = "block";

                    // Reset selections
                    selectedPlanId = null;
                    selectedPlanAmount = null;
                    selectedPlanBenefits = '';
                    selectedPaymentMethod = '';

                    // Redirect to QuickPay after a delay
                    setTimeout(() => {
                        goBackToQuickPay();
                    }, 5000); // Increased delay to give user time to download invoice
                } catch (error) {
                    showToast("Recharge failed. Please try again.", "danger");
                    paymentButton.innerHTML = "Pay Now";
                    paymentButton.disabled = false;
                    console.error('Error during recharge:', error);
                }
            },
            prefill: {
                contact: mobileNumber,
                email: " Not provided"
            },
            method: {
                card: selectedPaymentMethod === 'Credit/Debit Card',
                upi: selectedPaymentMethod === 'UPI',
                netbanking: selectedPaymentMethod === 'Wallet'
            },
            theme: {
                color: '#C70039'
            },
            modal: {
                ondismiss: function () {
                    paymentButton.innerHTML = "Pay Now";
                    paymentButton.disabled = false;
                    showToast("Payment cancelled.", "warning");
                }
            }
        };
        const rzp = new Razorpay(options);
        rzp.on('payment.failed', function (response) {
            showToast("Payment failed. Please try again.", "danger");
            paymentButton.innerHTML = "Pay Now";
            paymentButton.disabled = false;
            console.error("Razorpay payment failed:", response.error);
        });
        rzp.open();
    } catch (error) {
        showToast("Payment initiation failed. Please try again.", "danger");
        paymentButton.innerHTML = "Pay Now";
        paymentButton.disabled = false;
        console.error('Error during payment:', error);
    }
}

// Show Transactions
async function showTransactions() {
    if (!isCustomerAuthenticated()) {
        showToast("Please authenticate with a registered mobile number to view transactions.", "danger");
        setTimeout(() => goBackToQuickPay(), 1000);
        return;
    }

    document.getElementById("quickpay").style.display = "none";
    document.getElementById("plans").style.display = "none";
    document.getElementById("payment").style.display = "none";
    document.getElementById("transactionSection").style.display = "block";

    const mobileNumber = sessionStorage.getItem('userMobile');
    const transactionList = document.getElementById('transactionList');
    if (!mobileNumber) {
        if (transactionList) transactionList.innerHTML = '<p>Please enter a mobile number in the QuickPay section first.</p>';
        return;
    }

    try {
        const transactions = await makeCustomerAuthenticatedRequest(`${QuickPay_URL}/customer/transactions/${mobileNumber}`);
        if (transactionList) {
            if (transactions.length === 0) {
                transactionList.innerHTML = '<p>No recent transactions.</p>';
            } else {
                transactionList.innerHTML = transactions.map((t, index) => `
                    <div class="transaction-item d-flex justify-content-between align-items-center border p-3 mb-2 rounded">
                        <div>
                            <p><strong>Mobile:</strong> ${t.mobileNumber}</p>
                            <p><strong>Amount:</strong> ₹${t.amount}</p>
                            <p><strong>Benefits:</strong> ${t.planDetails}</p>
                            <p><strong>Payment Method:</strong> ${t.paymentMethod}</p>
                            <p><strong>Date:</strong> ${formatDate(t.transactionDate)}</p>
                        </div>
                        <button class="btn btn-outline-danger" onclick="downloadReceipt(${t.id})">📄 Download Receipt</button>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        if (transactionList) transactionList.innerHTML = '<p>Failed to load transactions. Please try again.</p>';
    }
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

// Download Receipt
async function downloadReceipt(id) {
    try {
        const response = await fetch(`${QuickPay_URL}/customer/transactions/download/${id}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${getCustomerToken()}`
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                sessionStorage.removeItem("customerToken");
                sessionStorage.removeItem("userMobile");
                showToast("Session expired. Please re-authenticate.", "danger");
                setTimeout(() => goBackToQuickPay(), 1000);
                return;
            }
            const errorText = await response.text();
            throw new Error(`Failed to download receipt: ${errorText || response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/pdf")) {
            throw new Error("Invalid response: Expected a PDF file.");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        showToast('Receipt downloaded successfully!', "success");
    } catch (error) {
        console.error('Error downloading receipt:', error);
        showToast(error.message || 'Failed to download receipt.', "danger");
    }
}

// Clear Transaction History (Optional)
function clearTransactionHistory() {
    const transactionList = document.getElementById('transactionList');
    if (transactionList) {
        transactionList.innerHTML = '<p>No recent transactions.</p>';
        showToast("Transaction history cleared.", "success");
    }
}

// Generate and Download Invoice
function generateInvoice(mobileNumber, plan, paymentMethod) {
    console.log("Generating invoice for:", { mobileNumber, plan, paymentMethod });
    try {
        const { jsPDF } = window.jspdf;
        if (!jsPDF || !window.jspdf) {
            throw new Error("jsPDF is not loaded.");
        }
        if (!doc.autoTable) {
            throw new Error("jspdf-autotable is not loaded.");
        }

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
        // Store invoice metadata in sessionStorage as a fallback
        sessionStorage.setItem('invoiceData', JSON.stringify({ mobileNumber, plan, paymentMethod }));
        console.log("Invoice generated successfully, window.generatedInvoice set:", window.generatedInvoice);
    } catch (error) {
        console.error("Error generating invoice:", error);
        showToast("Failed to generate invoice.", "danger");
    }
}

function downloadInvoice() {
    console.log("Attempting to download invoice, window.generatedInvoice:", window.generatedInvoice);
    let mobileNumber = document.getElementById("customerMobile").value || sessionStorage.getItem('userMobile') || 'unknown';

    if (!window.generatedInvoice) {
        // Attempt to regenerate the invoice if it’s not available
        const invoiceData = sessionStorage.getItem('invoiceData');
        if (invoiceData) {
            const { mobileNumber: storedMobile, plan, paymentMethod } = JSON.parse(invoiceData);
            generateInvoice(storedMobile, plan, paymentMethod);
            mobileNumber = storedMobile;
        }
    }

    if (window.generatedInvoice) {
        console.log("Downloading invoice for mobile number:", mobileNumber);
        window.generatedInvoice.save(`Invoice_${mobileNumber}.pdf`);
        // Clear the invoice after download to prevent reuse
        window.generatedInvoice = null;
        sessionStorage.removeItem('invoiceData');
    } else {
        showToast("Download the receipt by login ", "danger");
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
