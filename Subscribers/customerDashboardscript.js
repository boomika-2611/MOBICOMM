
function scrollToSection(event, sectionId) {
    event.preventDefault();
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

function scrollPlans(scrollValue) {
    const planScroll = document.getElementById("planScroll");
    planScroll.scrollLeft += scrollValue;
}

//profile
const BASE_URL_1 = 'http://localhost:8083/api/user';

        // Toggle sections
        function toggleSection(sectionId) {
            const sections = ['profileSection', 'quickpay', 'recommended-section', 'heroCarousel', 
                              'prepaidPlansSection', 'transactionSection', 'buyNewConnectionPage', 'helpSection'];
            sections.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.style.display = id === sectionId ? 'block' : 'none';
            });
        }

        // function toggleProfile() {
        //     toggleSection('profileSection');
        // }

        function toggleProfile() {
            let profileSection = document.getElementById("profileSection");
            let quickPay = document.getElementById("quickpay");
            let recommendedSection = document.querySelector(".recommended-section");
            let carousel = document.getElementById("heroCarousel");
        
            if (profileSection.style.display === "none" || profileSection.style.display === "") {
                profileSection.style.display = "block";
                quickPay.style.display = "none";
                recommendedSection.style.display = "none";
                carousel.style.display = "none";
                prepaidPlansSection.style.display = "none";
                transactionSection.style.display = "none";
                buyNewConnectionPage.style.display = "none"
                helpSection.style.display = "none";
        
            } else {
                profileSection.style.display = "none";
                quickPay.style.display = "block";
                recommendedSection.style.display = "block";
                carousel.style.display = "block";
                prepaidPlansSection.style.display = "none";
                transactionSection.style.display = "none";
                buyNewConnectionPage.style.display = "none"
                helpSection.style.display = "none";
            }
        }
        

        // Load Profile from Backend
        async function loadProfile() {
            const phone = "9025159692"; // Hardcoded for demo; replace with authenticated user phone in real app
            try {
                const response = await fetch(`${BASE_URL_1}/${phone}`);
                if (!response.ok) throw new Error("User not found");
                const user = await response.json();

                document.getElementById("profileName").textContent = user.name || "User";
                document.getElementById("profilePhone").textContent = user.phoneNumber || "Not provided";
                document.getElementById("profileAltPhone").textContent = user.alternatePhoneNumber || "Not provided";
                document.getElementById("profileEmail").textContent = user.email || "Not provided";
                document.getElementById("profileAddress").textContent = user.address || "Not provided";
                document.getElementById("profilePic").src = user.profilePic || "https://via.placeholder.com/100";
            } catch (error) {
                console.error("Error loading profile:", error);
                showToast("No profile found. Please save your details.", "Info", "info");
                // Set defaults if no data is found
                document.getElementById("profileName").textContent = "User";
                document.getElementById("profilePhone").textContent = phone;
                document.getElementById("profileAltPhone").textContent = "Not provided";
                document.getElementById("profileEmail").textContent = "Not provided";
                document.getElementById("profileAddress").textContent = "Not provided";
                document.getElementById("profilePic").src = "https://via.placeholder.com/100";
            }
        }

        // Toggle Edit Section
        function toggleEdit() {
            document.querySelector(".profile-card").style.display = "none";
            document.querySelector(".edit-section").style.display = "block";

            // Populate edit fields with current profile data
            document.getElementById("editName").value = document.getElementById("profileName").textContent === "User" ? "" : document.getElementById("profileName").textContent;
            document.getElementById("editPhone").value = document.getElementById("profilePhone").textContent;
            document.getElementById("editAltPhone").value = document.getElementById("profileAltPhone").textContent === "Not provided" ? "" : document.getElementById("profileAltPhone").textContent;
            document.getElementById("editEmail").value = document.getElementById("profileEmail").textContent === "Not provided" ? "" : document.getElementById("profileEmail").textContent;
            document.getElementById("editAddress").value = document.getElementById("profileAddress").textContent === "Not provided" ? "" : document.getElementById("profileAddress").textContent;
            document.getElementById("editProfilePic").src = document.getElementById("profilePic").src;
        }

        // Save Profile to Backend
        async function saveProfile() {
            const name = document.getElementById("editName").value.trim();
            const phone = document.getElementById("editPhone").value.trim();
            const altPhone = document.getElementById("editAltPhone").value.trim();
            const email = document.getElementById("editEmail").value.trim();
            const address = document.getElementById("editAddress").value.trim();
            const profilePic = document.getElementById("editProfilePic").src;

            // Validation
            if (!name || !phone || !email || !address) {
                showToast("Please fill in all required fields.", "Error", "danger");
                return;
            }
            if (!/^\d{10}$/.test(phone)) {
                showToast("Mobile number must be a 10-digit number.", "Error", "danger");
                return;
            }
            if (altPhone && !/^\d{10}$/.test(altPhone)) {
                showToast("Alternate mobile number must be a 10-digit number.", "Error", "danger");
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast("Please enter a valid email address.", "Error", "danger");
                return;
            }

            const user = {
                name: name,
                phoneNumber: phone,
                alternatePhoneNumber: altPhone,
                email: email,
                address: address,
                profilePic: profilePic
            };

            try {
                const response = await fetch(`${BASE_URL_1}/save`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user)
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const result = await response.json();
                showToast(result.message, "Success", "success");
                await loadProfile(); // Reload profile from backend
                document.querySelector(".profile-card").style.display = "block";
                document.querySelector(".edit-section").style.display = "none";
            } catch (error) {
                console.error("Error saving profile:", error);
                showToast("Failed to save profile.", "Error", "danger");
            }
        }

        // Handle Profile Picture Upload
        document.getElementById("uploadPic").addEventListener("change", function (event) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("editProfilePic").src = e.target.result;
                document.getElementById("profilePic").src = e.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        });

        // Toast Notification
        function showToast(message, title = "Notification", type = "info") {
            const toastContainer = document.querySelector(".toast-container");
            const toastHTML = `
                <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'info'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">${message}</div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            `;
            toastContainer.innerHTML = toastHTML;
            const toast = new bootstrap.Toast(toastContainer.querySelector(".toast"));
            toast.show();
            setTimeout(() => toastContainer.innerHTML = "", 3000);
        }

        // Load profile on page load
        // document.addEventListener("DOMContentLoaded", () => {
        //     toggleSection('profileSection');
        //     loadProfile();
        // });

 document.addEventListener("DOMContentLoaded", loadProfile);

function showHelpSection() {
    document.getElementById("heroCarousel").style.display = "none";
    document.getElementById("quickpay").style.display = "none";
    document.querySelector(".recommended-section").style.display = "none";
    document.getElementById("rechargeSection").style.display = "none";
    document.getElementById("paymentSection").style.display = "none";
    document.getElementById("transactionSection").style.display = "none";
    document.getElementById("helpSection").style.display = "block";
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("buyNewConnectionPage").style.display = "none"
    document.getElementById("prepaidPlansSection").style.display = "none";
}

function goHome() {
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("quickpay").style.display = "block";
    document.querySelector(".recommended-section").style.display = "block";
    document.getElementById("heroCarousel").style.display = "block";
    document.getElementById("rechargeSection").style.display = "none";
    document.getElementById("paymentSection").style.display = "none";
    document.getElementById("transactionSection").style.display = "none";
    document.getElementById("helpSection").style.display = "none";
    document.getElementById("buyNewConnectionPage").style.display = "none"
    document.getElementById("prepaidPlansSection").style.display = "none";
    document.getElementById("customerMobile").value = "";
}



// Toast notification function
function showToast(message, title = "Notification", variant = "primary") {
    const toastEl = document.getElementById('toastNotification');
    const toastMessageEl = document.getElementById('toastMessage');
    const toastTitleEl = document.getElementById('toastTitle');

    // Set content
    toastMessageEl.textContent = message;
    toastTitleEl.textContent = title;

    // Set color based on variant
    toastEl.className = `toast text-white bg-${variant} border-0`;

    // Create Bootstrap toast instance and show
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Show Prepaid Plans Section
function showPrepaidPlans() {
    document.getElementById("heroCarousel").style.display = "none";
    document.getElementById("quickpay").style.display = "none";
    document.querySelector(".recommended-section").style.display = "none";
    document.getElementById("rechargeSection").style.display = "none";
    document.getElementById("paymentSection").style.display = "none";
    document.getElementById("prepaidPlansSection").style.display = "block";
    document.getElementById("transactionSection").style.display = "none";
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("buyNewConnectionPage").style.display = "none";
    document.getElementById("helpSection").style.display = "none";
}


// Toast notification function
function showToast(message, title = "Notification", variant = "primary") {
    const toastEl = document.getElementById('toastNotification');
    const toastMessageEl = document.getElementById('toastMessage');
    const toastTitleEl = document.getElementById('toastTitle');

    // Set content
    toastMessageEl.textContent = message;
    toastTitleEl.textContent = title;

    // Set color based on variant
    toastEl.className = `toast text-white bg-${variant} border-0`;

    // Create Bootstrap toast instance and show
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}


// Load Plans from Local Storage and Display in Customer Page
// // Show Prepaid Plans Section
const BASE_URL = 'http://localhost:8083'; // Matches your backend port

// Load plans from backend and display in customer page
async function loadCustomerPlans() {
    try {
        console.log('Fetching plans from:', `${BASE_URL}/customer/plans`);
        const response = await fetch(`${BASE_URL}/customer/plans`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const plans = await response.json();
        console.log('Plans received:', plans);

        const categorizedPlans = {
            popularPlans: plans.filter(plan => plan.category === 'POPULAR_PLANS'),
            validityPlans: plans.filter(plan => plan.category === 'VALIDITY_PLANS'),
            dataPlans: plans.filter(plan => plan.category === 'DATA_PLANS'),
            topupPlans: plans.filter(plan => plan.category === 'TOP_UP_PLANS'),
            isdPlans: plans.filter(plan => plan.category === 'ISD_PLANS'),
            comboPlans: plans.filter(plan => plan.category === 'COMBO_UNLIMITED_PLANS')
        };
        console.log('Categorized plans:', categorizedPlans);

        document.getElementById('popularPlansContainer').innerHTML = generatePlanCards(categorizedPlans.popularPlans);
        document.getElementById('validityPlansContainer').innerHTML = generatePlanCards(categorizedPlans.validityPlans);
        document.getElementById('dataPlansContainer').innerHTML = generatePlanCards(categorizedPlans.dataPlans);
        document.getElementById('topupPlansContainer').innerHTML = generatePlanCards(categorizedPlans.topupPlans);
        document.getElementById('isdPlansContainer').innerHTML = generatePlanCards(categorizedPlans.isdPlans);
        document.getElementById('comboPlansContainer').innerHTML = generatePlanCards(categorizedPlans.comboPlans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        showToast('Failed to load plans. Please try again.', 'Error', 'danger');
        document.getElementById('popularPlansContainer').innerHTML = '<p class="text-danger">Error loading plans. Please try again later.</p>';
    }
}

// Generate plan cards from backend data
function generatePlanCards(plans) {
    if (!plans || plans.length === 0) return '<p>No plans available in this category.</p>';
    return plans.map(plan => `
        <div class="col-md-4">
            <div class="card p-3 text-center shadow-sm" onclick="selectPlan(${plan.id}, ${plan.price}, '${plan.dataPerDay} for ${plan.validityDays} days', this)">
                <h5 class="fw-bold text-danger">₹${plan.price} Plan</h5>
                <p class="text-dark">${plan.dataPerDay} for ${plan.validityDays} days</p>
                <button class="btn btn-danger w-100 mt-2 fw-bold"
                    style="background: linear-gradient(90deg, #C70039, #900C3F); border: none; padding: 10px; border-radius: 20px;"
                    onclick="moveToPayment(${plan.id}, ${plan.price}, '${plan.dataPerDay} for ${plan.validityDays} days')">Recharge Now</button>
            </div>
        </div>
    `).join('');
}

// Global variables
let selectedPlanId = null;
let selectedPlanAmount = null;
let selectedPlanBenefits = '';
let selectedPaymentMethod = '';

// Select a plan
function selectPlan(planId, amount, benefits, element) {
    selectedPlanId = planId;
    selectedPlanAmount = amount;
    selectedPlanBenefits = benefits;
    document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    showToast(`Plan ₹${amount} selected`, 'Plan Selected', 'info');
}

// Proceed to payment
function moveToPayment(planId, amount, benefits) {
    if (!validateMobileNumber()) return;
    const mobileNumber = document.getElementById('customerMobile').value.trim();
    localStorage.setItem('userMobile', mobileNumber);
    selectedPlanId = planId;
    selectedPlanAmount = amount;
    selectedPlanBenefits = benefits;
    document.getElementById('paymentMobile').innerText = mobileNumber;
    document.getElementById('paymentAmount').innerText = amount;
    document.getElementById('paymentBenefits').innerText = benefits;
    document.getElementById('prepaidPlansSection').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'block';
}

// Confirm payment and send recharge request to backend
async function confirmPayment() {
    if (!selectedPaymentMethod) {
        showToast('Please select a payment method before proceeding.', 'Payment Method Required', 'warning');
        return;
    }
    const mobileNumber = localStorage.getItem('userMobile');
    if (!mobileNumber || !selectedPlanId) {
        showToast('Error: Missing mobile number or selected plan!', 'Error', 'danger');
        return;
    }
    document.getElementById('loader').style.display = 'block';
    document.getElementById('paymentSuccess').style.display = 'none';
    const rechargeData = {
        mobileNumber,
        amount: selectedPlanAmount,
        planDetails: selectedPlanBenefits,
        paymentMethod: selectedPaymentMethod
    };
    try {
        const response = await fetch(`${BASE_URL}/customer/recharge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rechargeData)
        });
        const result = await response.text();
        document.getElementById('loader').style.display = 'none';
        document.getElementById('paymentSuccess').style.display = 'block';
        showToast(result, 'Success', 'success');
        setTimeout(() => {
            document.getElementById('paymentSuccess').style.display = 'none';
            goHome();
        }, 2000);
    } catch (error) {
        document.getElementById('loader').style.display = 'none';
        showToast('Recharge failed. Please try again.', 'Error', 'danger');
        console.error('Error during recharge:', error);
    }
}

async function showTransactions() {
    document.querySelector(".recommended-section").style.display = "none";
    toggleSection('transactionSection');
    const mobileNumber = localStorage.getItem('userMobile');
    if (!mobileNumber) {
        document.getElementById('transactionList').innerHTML = '<p>Please enter a mobile number in the recharge section first.</p>';
        return;
    }
    try {
        const response = await fetch(`${BASE_URL}/customer/transactions/${mobileNumber}`);
        const transactions = await response.json();
        const transactionList = document.getElementById('transactionList');
        if (transactions.length === 0) {
            transactionList.innerHTML = '<p>No recent transactions.</p>';
            return;
        }
        transactionList.innerHTML = transactions.map((t, index) => `
            <div class="transaction-item d-flex justify-content-between align-items-center border p-3 mb-2 rounded">
                <div>
                    <p><strong>Mobile:</strong> ${t.mobileNumber}</p>
                    <p><strong>Amount:</strong> ₹${t.amount}</p>
                    <p><strong>Benefits:</strong> ${t.planDetails}</p>
                    <p><strong>Payment Method:</strong> ${t.paymentMethod}</p>
                    <p><strong>Date:</strong> ${t.transactionDate}</p>
                </div>
                <button class="btn btn-outline-danger" onclick="downloadReceipt(${t.id})">📄 Download Receipt</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching transactions:', error);
        document.getElementById('transactionList').innerHTML = '<p>Failed to load transactions. Please try again.</p>';
    }
}

// Download receipt from backend
async function downloadReceipt(id) {
    try {
        const response = await fetch(`${BASE_URL}/customer/transactions/download/${id}`);
        if (!response.ok) throw new Error('Receipt not found');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast('Receipt downloaded successfully!', 'Success', 'success');
    } catch (error) {
        console.error('Error downloading receipt:', error);
        showToast('Failed to download receipt.', 'Error', 'danger');
    }
}

// Helper function to toggle sections
function toggleSection(sectionId) {
    const sections = ['heroCarousel', 'quickpay', 'recommended-section', 'paymentSection',
        'transactionSection', 'profileSection', 'buyNewConnectionPage',
        'helpSection', 'prepaidPlansSection'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = id === sectionId ? 'block' : 'none';
        }
    });
}

// Show prepaid plans section
function showPrepaidPlans() {

    document.querySelector(".recommended-section").style.display = "none";

    toggleSection('prepaidPlansSection');
    loadCustomerPlans();
}

// Validate mobile number
function validateMobileNumber() {
    let mobileInput = document.getElementById('customerMobile');
    let mobileNumber = mobileInput ? mobileInput.value.trim() : localStorage.getItem('userMobile');
    if (!mobileNumber) {
        showTooltip('This field is required!');
        mobileInput.focus();
        return false;
    }
    if (!/^\d{10}$/.test(mobileNumber)) {
        showTooltip('Please enter a valid 10-digit mobile number!');
        mobileInput.focus();
        return false;
    }
    return true;
}

// Select payment method
function selectPaymentMethod(method, element) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.payment-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    showToast(`${method} selected as payment method`, 'Payment Method', 'info');
}

window.onload = function () {
    const mobileInput = document.getElementById('customerMobile');
    if (mobileInput) {
        mobileInput.value = ''; // Clear the field on every page load
    }
};

// Show toast notification
function showToast(message, title = 'Notification', type = 'info') {
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;
    document.body.appendChild(toastContainer);
    const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
    toast.show();
    setTimeout(() => toastContainer.remove(), 3000);
}

// Show tooltip
function showTooltip(message) {
    let mobileInput = document.getElementById('customerMobile');
    mobileInput.setAttribute('title', message);
    mobileInput.setAttribute('data-bs-original-title', message);
    let tooltip = new bootstrap.Tooltip(mobileInput);
    tooltip.show();
    setTimeout(() => tooltip.hide(), 2000);
}

function clearTransactionHistory() {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '<p>No recent transactions.</p>';
    showToast('Transaction history cleared from view.', 'Info', 'info');
}

// Chart Configurations for Clean UI
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } }
};

// Daily Data Usage Chart
new Chart(document.getElementById('dailyDataUsageChart'), {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            data: [1.5, 2, 2.2, 1.8, 3, 2.5, 2.8],
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.2)',
            fill: true
        }]
    },
    options: chartOptions
});

// Data Trends Chart
new Chart(document.getElementById('dataTrendsChart'), {
    type: 'bar',
    data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{ data: [10, 12, 15, 18], backgroundColor: '#0d6efd' }]
    },
    options: chartOptions
});

// Most Used Plans Chart
new Chart(document.getElementById('mostUsedPlansChart'), {
    type: 'doughnut',
    data: {
        labels: ['₹199', '₹299', '₹399'],
        datasets: [{ data: [40, 35, 25], backgroundColor: ['#dc3545', '#0d6efd', '#198754'] }]
    },
    options: chartOptions
});

// Peak Usage Hours Chart
new Chart(document.getElementById('peakUsageChart'), {
    type: 'bar',
    data: {
        labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
        datasets: [{ data: [0.5, 1.2, 1.8, 2.1, 3.5, 4], backgroundColor: '#ffc107' }]
    },
    options: chartOptions
});

// Recharge Frequency Chart
new Chart(document.getElementById('rechargeFrequencyChart'), {
    type: 'bar',
    data: {
        labels: ['1-2 Times/Month', '3-5 Times/Month', '6+ Times/Month'],
        datasets: [{ data: [50, 35, 15], backgroundColor: '#6c757d' }]
    },
    options: chartOptions
});

// Payment Methods Chart
new Chart(document.getElementById('paymentMethodChart'), {
    type: 'pie',
    data: {
        labels: ['Credit/Debit', 'UPI', 'Net Banking', 'Wallet'],
        datasets: [{ data: [45, 30, 15, 10], backgroundColor: ['#dc3545', '#0d6efd', '#198754', '#ffc107'] }]
    },
    options: chartOptions
});




// Go to Buy New Connection page (use toggleSection for consistency)
function goToBuyNewConnection() {
    document.querySelector(".recommended-section").style.display = "none";
    toggleSection('buyNewConnectionPage');
}

// Validation for Customer Name
document.getElementById("customerName").addEventListener("blur", function () {
    let name = this.value.trim();
    let errorElement = document.getElementById("nameError");

    if (name === "") {
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
    let mobile = this.value.trim();
    let errorElement = document.getElementById("mobileError");

    if (mobile === "") {
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

// Validation for Aadhaar Upload
document.getElementById("aadhaarUpload").addEventListener("change", function () {
    let errorElement = document.getElementById("aadhaarError");
    let preview = document.getElementById("aadhaarPreview");

    if (this.files.length === 0) {
        errorElement.textContent = "Please upload your Aadhaar card!";
        this.classList.add("is-invalid");
        preview.src = "";
    } else {
        errorElement.textContent = "";
        this.classList.remove("is-invalid");
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result; // Show preview
        };
        reader.readAsDataURL(file);
    }
});

// Handle Form Submission
document.getElementById("newConnectionForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let customerName = document.getElementById("customerName").value.trim();
    let mobileNumber = document.getElementById("mobileNumber").value.trim();
    let aadhaarFile = document.getElementById("aadhaarUpload").files[0];

    // Client-side validation
    if (customerName === "" || !/^[a-zA-Z0-9 ]{3,}$/.test(customerName)) {
        showToast("Please enter a valid name with at least 3 alphanumeric characters!", "Error", "danger");
        return;
    }

    if (mobileNumber === "" || !/^\d{10}$/.test(mobileNumber)) {
        showToast("Please enter a valid 10-digit mobile number!", "Error", "danger");
        return;
    }

    if (!aadhaarFile) {
        showToast("Please upload your Aadhaar card!", "Error", "danger");
        return;
    }

    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = async function (event) {
        const aadhaarData = event.target.result; // Base64 string

        // Prepare KYC request data
        const kycRequest = {
            mobileNumber: mobileNumber,
            customerName: customerName,
            aadharDocument: aadhaarData, // Send as Base64 string
            status: "Pending" // Default status set by backend, but included for clarity
        };

        try {
            const response = await fetch(`${BASE_URL}/admin/kyc/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(kycRequest)
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            showToast(result.message, "Success", "success");
            document.getElementById("newConnectionForm").reset(); // Clear form
            document.getElementById("aadhaarPreview").src = ""; // Clear preview
        } catch (error) {
            console.error("Error submitting KYC request:", error);
            showToast("Failed to submit KYC request. Please try again.", "Error", "danger");
        }
    };
    reader.readAsDataURL(aadhaarFile);
});

// View Latest KYC Request (optional: fetch from backend)
async function viewRequest() {
    try {
        const response = await fetch(`${BASE_URL}/admin/kyc/pending`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const pendingRequests = await response.json();

        if (pendingRequests.length === 0) {
            showToast("No pending KYC requests found!", "Info", "info");
            return;
        }

        const latestRequest = pendingRequests[pendingRequests.length - 1];
        const statusClass = "status-" + latestRequest.status.toLowerCase();
        const toastMessage = `
            <strong>Name:</strong> ${latestRequest.customerName}<br>
            <strong>Mobile:</strong> ${latestRequest.mobileNumber}<br>
            <strong>Status:</strong> <span class="${statusClass}">${latestRequest.status}</span>
        `;
        showToast(toastMessage, "KYC Request", "info");
    } catch (error) {
        console.error("Error fetching KYC requests:", error);
        showToast("Failed to fetch KYC requests. Please try again.", "Error", "danger");
    }
}

// Reuse your existing showToast function (updated to handle HTML content)
function showToast(message, title = "Notification", type = "info") {
    const toastContainer = document.createElement("div");
    toastContainer.innerHTML = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;
    document.body.appendChild(toastContainer);
    const toast = new bootstrap.Toast(toastContainer.querySelector(".toast"));
    toast.show();
    setTimeout(() => toastContainer.remove(), 5000);
}

function handleRecharge(amount, benefits) {
    selectedPlan = amount;
    selectedPlanBenefits = benefits;

    // Show payment summary
    document.getElementById("paymentMobile").innerText = document.getElementById("mobileNumber").value;
    document.getElementById("paymentAmount").innerText = selectedPlan;
    document.getElementById("paymentBenefits").innerText = selectedPlanBenefits;

    // Hide previous payment success message
    document.getElementById("paymentSuccess").style.display = "none";

    // Hide recommended section and show payment page
    document.querySelector(".recommended-section").style.display = "none";
    document.getElementById("paymentSection").style.display = "block";
}




function clearTransactionHistory() {
    let confirmDelete = confirm("Are you sure you want to clear all transaction history?");
    if (confirmDelete) {
        localStorage.removeItem("transactions"); // Remove transaction data
        document.getElementById("transactionList").innerHTML = "<p>No recent transactions.</p>"; // Update UI
        alert("Transaction history cleared!");
    }
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
