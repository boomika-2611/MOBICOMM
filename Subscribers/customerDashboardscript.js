function scrollToSection(event, sectionId) {
    event.preventDefault();
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

function scrollPlans(scrollValue) {
    const planScroll = document.getElementById("planScroll");
    planScroll.scrollLeft += scrollValue;
}


const BASE_URL_1 = 'http://localhost:8083/api/user';

// Get token from sessionStorage
function getToken() {
    return sessionStorage.getItem('userToken');
}

// Get authentication headers
function getAuthHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// Toggle sections
function toggleSection(sectionId) {
    const sections = ['profileSection', 'quickpay', 'recommended-section', 'heroCarousel',
        'prepaidPlansSection', 'transactionSection', 'buyNewConnectionPage', 'helpSection'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = id === sectionId ? 'block' : 'none';
    });
}

// Toggle profile visibility
function toggleProfile() {
    let profileSection = document.getElementById("profileSection");
    let quickPay = document.getElementById("quickpay");
    let recommendedSection = document.querySelector(".recommended-section");
    let carousel = document.getElementById("heroCarousel");
    let prepaidPlansSection = document.getElementById("prepaidPlansSection");
    let transactionSection = document.getElementById("transactionSection");
    let buyNewConnectionPage = document.getElementById("buyNewConnectionPage");
    let helpSection = document.getElementById("helpSection");

    if (profileSection.style.display === "none" || profileSection.style.display === "") {
        profileSection.style.display = "block";
        quickPay.style.display = "none";
        recommendedSection.style.display = "none";
        carousel.style.display = "none";
        prepaidPlansSection.style.display = "none";
        transactionSection.style.display = "none";
        buyNewConnectionPage.style.display = "none";
        helpSection.style.display = "none";
        loadProfile(); 
    } else {
        profileSection.style.display = "none";
        quickPay.style.display = "block";
        recommendedSection.style.display = "block";
        carousel.style.display = "block";
        prepaidPlansSection.style.display = "none";
        transactionSection.style.display = "none";
        buyNewConnectionPage.style.display = "none";
        helpSection.style.display = "none";
    }
}


async function loadProfile() {
    const phone = sessionStorage.getItem('userMobile');
    if (!phone) {
        showToast("No user phone found. Please log in first.", "Error", "danger");
        redirectToLogin();
        return;
    }
    if (!getToken()) {
        showToast("No authentication token found. Please log in.", "Error", "danger");
        redirectToLogin();
        return;
    }

    try {
        const response = await fetch(`${BASE_URL_1}/${phone}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            if (response.status === 401) {
                redirectToLogin();
                return;
            }
            if (response.status === 404) {
                showToast("No profile found. Please save your details.", "Info", "info");
                updateProfileUI("User", phone);
                updateNavbar("User"); // Update navbar with default name
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const user = await response.json();

        updateProfileUI(user.name || "User", phone, user);
        updateNavbar(user.name || "User"); // Update navbar with fetched name
    } catch (error) {
        console.error("Error loading profile:", error);
        showToast("Failed to load profile. Please try again.", "Error", "danger");
        updateProfileUI("User", phone);
        updateNavbar("User"); // Fallback to "User"
    }
}

// Helper function to update profile UI
function updateProfileUI(name, phone, user = {}) {
    document.getElementById("profileName").textContent = name;
    document.getElementById("profilePhone").textContent = `+91 ${phone}`;
    document.getElementById("profileAltPhone").textContent = user.alternatePhoneNumber ? `+91 ${user.alternatePhoneNumber}` : "Not provided";
    document.getElementById("profileEmail").textContent = user.email || "Not provided";
    document.getElementById("profileAddress").textContent = user.address || "Not provided";
    document.getElementById("profilePic").src = user.profilePic || "https://placehold.co/100x100";
}

// Helper function to update navbar with "<i class='fas fa-user-circle'></i> <name>"
function updateNavbar(name) {
    const accountDropdown = document.getElementById("accountDropdown");
    if (accountDropdown) {
        accountDropdown.innerHTML = `<i class="fas fa-user-circle"></i> ${name}`; // No manual caret
        // Ensure necessary classes remain
        accountDropdown.classList.add("nav-link", "dropdown-toggle");
    }
}

// Toggle edit section
function toggleEdit() {
    document.querySelector(".profile-card").style.display = "none";
    document.querySelector(".edit-section").style.display = "block";

    document.getElementById("editName").value = document.getElementById("profileName").textContent === "User" ? "" : document.getElementById("profileName").textContent;
    document.getElementById("editPhone").value = document.getElementById("profilePhone").textContent;
    document.getElementById("editPhone").disabled = true; // Phone number not editable
    document.getElementById("editAltPhone").value = document.getElementById("profileAltPhone").textContent === "Not provided" ? "" : document.getElementById("profileAltPhone").textContent.replace("+91", "");
    document.getElementById("editEmail").value = document.getElementById("profileEmail").textContent === "Not provided" ? "" : document.getElementById("profileEmail").textContent;
    document.getElementById("editAddress").value = document.getElementById("profileAddress").textContent === "Not provided" ? "" : document.getElementById("profileAddress").textContent;
    document.getElementById("editPassword").value = ""; // Password field starts empty for security
    document.getElementById("editProfilePic").src = document.getElementById("profilePic").src;
}

// Save profile to backend
async function saveProfile() {
    console.log("saveProfile called");

    const name = document.getElementById("editName").value.trim();
    const phone = sessionStorage.getItem('userMobile');
    const altPhone = document.getElementById("editAltPhone").value.trim().replace("+91", "");
    const email = document.getElementById("editEmail").value.trim();
    const password = document.getElementById("editPassword").value.trim();
    const address = document.getElementById("editAddress").value.trim();
    const profilePic = document.getElementById("editProfilePic").src;

    if (!name || !phone || !email || !address) {
        console.log("Validation failed: Missing required fields", { name, phone, email, address });
        showToast("Please fill in all required fields.", "Error", "danger");
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
        console.log("Validation failed: Invalid phone number", phone);
        showToast("Mobile number must be a 10-digit number.", "Error", "danger");
        return;
    }
    if (altPhone && !/^\d{10}$/.test(altPhone)) {
        console.log("Validation failed: Invalid alt phone number", altPhone);
        showToast("Alternate mobile number must be a 10-digit number.", "Error", "danger");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.log("Validation failed: Invalid email", email);
        showToast("Please enter a valid email address.", "Error", "danger");
        return;
    }

    const user = {
        name: name,
        phoneNumber: phone,
        alternatePhoneNumber: altPhone,
        email: email,
        password: password || undefined, // Send password if provided
        address: address,
        profilePic: profilePic
    };

    console.log("Sending to backend:", user);

    try {
        const response = await fetch(`${BASE_URL_1}/save`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(user)
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log("Error response:", errorText);
            throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("Save successful, response:", result);
        showToast(result.message || "Profile saved successfully!", "Success", "success");
        sessionStorage.setItem('userMobile', phone);
        await loadProfile(); // Reload profile and update navbar
        document.querySelector(".edit-section").style.display = "none";
        document.querySelector(".profile-card").style.display = "block";
    } catch (error) {
        console.error("Error saving profile:", error);
        showToast(`Failed to save profile: ${error.message}`, "Error", "danger");
    }
}

// Handle profile picture upload
document.getElementById("uploadPic")?.addEventListener("change", function (event) {
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("editProfilePic").src = e.target.result;
        document.getElementById("profilePic").src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
});

// Redirect to login
function redirectToLogin() {
    showToast("Session expired or unauthorized. Please log in again.", "Error", "danger");
    setTimeout(() => {
        window.location.href = "customerlogin.html";
    }, 2000);
}

// Toast notification
function showToast(message, title = "Notification", type = "info") {
    const toastContainer = document.querySelector(".toast-container") || document.createElement("div");
    if (!toastContainer.classList.contains("toast-container")) {
        toastContainer.classList.add("toast-container", "position-fixed", "top-0", "end-0", "p-3");
        document.body.appendChild(toastContainer);
    }
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

// Load profile on page load if authenticated
document.addEventListener("DOMContentLoaded", () => {
    if (getToken()) {
        loadProfile(); // Load profile and update navbar on page load
    } else {
        redirectToLogin();
    }
});

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

const BASE_URL = 'http://localhost:8083';

// Authentication and Headers
function getToken() {
    return sessionStorage.getItem('userToken');
}

function getAuthHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// Load Plans with Optional Filters
async function loadCustomerPlans(categoryName = '', validity = '', data = '') {
    const loggedInMobile = sessionStorage.getItem('userMobile');
    const mobileInput = document.getElementById('customerMobile');

    if (loggedInMobile && mobileInput) {
        mobileInput.value = loggedInMobile;
        mobileInput.classList.remove('is-invalid');
    }

    try {
        let url = `${BASE_URL}/customer/plans`;
        if (categoryName || validity || data) {
            const params = new URLSearchParams();
            if (categoryName) params.append('categoryName', categoryName);
            if (validity) params.append('validity', validity);
            if (data) params.append('data', data);
            url = `${BASE_URL}/customer/plans/search?${params.toString()}`;
        }
        console.log('Fetching plans from:', url);
        const response = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            if (response.status === 401) {
                redirectToLogin();
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const plans = await response.json();
        console.log('Plans received:', plans);

        // Log the first plan to inspect its structure
        console.log('First plan object:', JSON.stringify(plans[0], null, 2));

        // Temporary workaround: Infer categories from the name field
        plans.forEach(plan => {
            if (plan.name.startsWith('Popular')) {
                plan.category = 'Popular Plans';
            } else if (plan.name.startsWith('Data Booster')) {
                plan.category = 'Data Booster Plans';
            } else if (plan.name.startsWith('Top-Up')) {
                plan.category = 'Top-Up Plans';
            } else if (plan.name.startsWith('Unlimited')) {
                plan.category = 'Unlimited Plans';
            } else if (plan.name.startsWith('ISD Pack')) {
                plan.category = 'ISD Plans';
            } else if (plan.name.startsWith('Validity')) {
                plan.category = 'Validity Plans';
            } else {
                plan.category = 'Other Plans'; // Fallback category
            }
        });

        // Extract unique categories from the plans
        const uniqueCategories = [...new Set(plans.map(plan => plan.category))].filter(category => category);
        console.log('Unique categories:', uniqueCategories);

        // Dynamically populate the filter dropdown
        const filterCategory = document.getElementById('filterCategory');
        if (filterCategory) {
            filterCategory.innerHTML = '<option value="">All Categories</option>'; // Reset options
            if (uniqueCategories.length === 0) {
                filterCategory.innerHTML = '<option value="">Categories Not Available</option>';
                filterCategory.disabled = true;
            } else {
                uniqueCategories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    filterCategory.appendChild(option);
                });
            }
        }

        // Dynamically generate tabs and tab content
        const planTabs = document.getElementById('planTabs');
        const planTabContent = document.getElementById('planTabContent');
        if (planTabs && planTabContent) {
            // Clear existing tabs and content
            planTabs.innerHTML = '';
            planTabContent.innerHTML = '';

            if (uniqueCategories.length === 0) {
                // Fallback: Display all plans in a single "All Plans" tab
                const tabId = 'plan-all-plans';

                // Create tab
                const tabLi = document.createElement('li');
                tabLi.className = 'nav-item';
                const tabLink = document.createElement('a');
                tabLink.className = 'nav-link active';
                tabLink.setAttribute('data-bs-toggle', 'tab');
                tabLink.setAttribute('href', `#${tabId}`);
                tabLink.textContent = 'All Plans';
                tabLi.appendChild(tabLink);
                planTabs.appendChild(tabLi);

                // Create tab pane
                const tabPane = document.createElement('div');
                tabPane.className = 'tab-pane fade show active';
                tabPane.id = tabId;
                const plansContainer = document.createElement('div');
                plansContainer.className = 'row';
                plansContainer.id = `${tabId}-container`;
                tabPane.appendChild(plansContainer);
                planTabContent.appendChild(tabPane);

                // Populate all plans
                plansContainer.innerHTML = generatePlanCards(plans);
            } else {
                // Generate tabs and content for each category
                uniqueCategories.forEach((category, index) => {
                    const tabId = `plan-${category.toLowerCase().replace(/\s+/g, '-')}`; // e.g., "plan-popular-plans"

                    // Create tab
                    const tabLi = document.createElement('li');
                    tabLi.className = 'nav-item';
                    const tabLink = document.createElement('a');
                    tabLink.className = `nav-link ${index === 0 ? 'active' : ''}`;
                    tabLink.setAttribute('data-bs-toggle', 'tab');
                    tabLink.setAttribute('href', `#${tabId}`);
                    tabLink.textContent = category;
                    tabLi.appendChild(tabLink);
                    planTabs.appendChild(tabLi);

                    // Create tab pane
                    const tabPane = document.createElement('div');
                    tabPane.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
                    tabPane.id = tabId;
                    const plansContainer = document.createElement('div');
                    plansContainer.className = 'row';
                    plansContainer.id = `${tabId}-container`;
                    tabPane.appendChild(plansContainer);
                    planTabContent.appendChild(tabPane);

                    // Populate plans for this category
                    const categoryPlans = plans.filter(plan => plan.category === category);
                    plansContainer.innerHTML = generatePlanCards(categoryPlans);
                });
            }
        }

        // Log uncategorized plans (for debugging)
        const uncategorizedPlans = plans.filter(plan => !plan.category);
        if (uncategorizedPlans.length > 0) {
            console.warn('Uncategorized plans:', uncategorizedPlans);
        }
    } catch (error) {
        console.error('Error fetching plans:', error);
        showToast('Failed to load plans. Please try again.', 'Error', 'danger');
        const planTabContent = document.getElementById('planTabContent');
        if (planTabContent) {
            planTabContent.innerHTML = '<p class="text-danger">Error loading plans. Please try again later.</p>';
        }
    }
}
// Filter Plans
function filterPlans() {
    const filterCategory = document.getElementById('filterCategory');
    const filterValidity = document.getElementById('filterValidity');
    const filterData = document.getElementById('filterData');

    const categoryName = filterCategory ? filterCategory.value : '';
    const validity = filterValidity ? filterValidity.value : '';
    const data = filterData ? filterData.value : '';
    loadCustomerPlans(categoryName, validity, data);
}

// Generate Plan Cards
function generatePlanCards(plans) {
    if (!plans || plans.length === 0) return '<p>No plans available in this category.</p>';
    return plans.map(plan => `
        <div class="col-md-4">
            <div class="card p-3 text-center shadow-sm" onclick="selectPlan(${plan.id}, ${plan.price}, '${plan.dataPerDay} for ${plan.validityDays} days', this)">
                <h5 class="fw-bold text-danger">₹${plan.price} Plan</h5>
                <p class="text-dark">${plan.dataPerDay} for ${plan.validityDays} days</p>
                <button class="btn btn-danger w-100 mt-2 fw-bold"
                    style="background: linear-gradient(90deg, #C70039, #900C3F); border: none; padding: 10px; border-radius: 20px;"
                    onclick="moveToPayment(${plan.id}, ${plan.price}, '${plan.dataPerDay} for ${plan.validityDays} days'); event.stopPropagation();">Recharge Now</button>
            </div>
        </div>
    `).join('');
}

// Plan Selection and Navigation
let selectedPlanId = null;
let selectedPlanAmount = null;
let selectedPlanBenefits = '';
let selectedPaymentMethod = '';

function selectPlan(planId, amount, benefits, element) {
    selectedPlanId = planId;
    selectedPlanAmount = amount;
    selectedPlanBenefits = benefits;
    document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    showToast(`Plan ₹${amount} selected`, 'Plan Selected', 'info');
}

function moveToPayment(planId, amount, benefits) {
    const mobileInput = document.getElementById('customerMobile');
    const mobileNumber = mobileInput ? mobileInput.value.trim() : sessionStorage.getItem('userMobile');
    if (!validateMobileNumber(mobileNumber)) return;

    sessionStorage.setItem('userMobile', mobileNumber);
    selectedPlanId = planId;
    selectedPlanAmount = amount;
    selectedPlanBenefits = benefits;

    const paymentMobile = document.getElementById('paymentMobile');
    const paymentAmount = document.getElementById('paymentAmount');
    const paymentBenefits = document.getElementById('paymentBenefits');
    const prepaidPlansSection = document.getElementById('prepaidPlansSection');
    const paymentSection = document.getElementById('paymentSection');

    if (paymentMobile) paymentMobile.innerText = mobileNumber;
    if (paymentAmount) paymentAmount.innerText = amount;
    if (paymentBenefits) paymentBenefits.innerText = benefits;
    if (prepaidPlansSection) prepaidPlansSection.style.display = 'none';
    if (paymentSection) paymentSection.style.display = 'block';
}

// Payment Method Selection
function selectPaymentMethod(method, element) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.payment-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    showToast(`${method.toUpperCase()} selected as payment method`, 'Payment Method', 'info');
}

// Confirm Payment with Razorpay
async function confirmPayment() {
    if (!selectedPaymentMethod) {
        showToast('Please select a payment method before proceeding.', 'Payment Method Required', 'warning');
        return;
    }
    const mobileNumber = sessionStorage.getItem('userMobile');
    const paymentEmail = document.getElementById('paymentEmail');
    const email = paymentEmail ? paymentEmail.value.trim() : '';
    if (!mobileNumber || !selectedPlanId || !selectedPlanAmount) {
        showToast('Error: Missing mobile number, email, or selected plan!', 'Error', 'danger');
        return;
    }
    if (!email) {
        showToast('Please enter your email address.', 'Email Required', 'warning');
        return;
    }

    const loader = document.getElementById('loader');
    const paymentSuccess = document.getElementById('paymentSuccess');
    if (loader) loader.style.display = 'block';
    if (paymentSuccess) paymentSuccess.style.display = 'none';

    try {
        // Step 1: Create Razorpay order
        const orderResponse = await fetch(`${BASE_URL}/customer/payment/create-order`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ amount: selectedPlanAmount })
        });
        if (!orderResponse.ok) {
            throw new Error(`Failed to create order: ${orderResponse.status}`);
        }
        const orderId = await orderResponse.text();

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
                        email: email
                    };
                    const rechargeResponse = await fetch(
                        `${BASE_URL}/customer/plans/recharge/${selectedPlanId}?paymentId=${response.razorpay_payment_id}`,
                        {
                            method: 'POST',
                            headers: getAuthHeaders(),
                            body: JSON.stringify(rechargeData)
                        }
                    );
                    if (!rechargeResponse.ok) {
                        throw new Error(`Recharge failed: ${rechargeResponse.status}`);
                    }
                    const result = await rechargeResponse.text();
                    if (loader) loader.style.display = 'none';
                    if (paymentSuccess) paymentSuccess.style.display = 'block';
                    showToast(result, 'Success', 'success');
                    setTimeout(() => {
                        if (paymentSuccess) paymentSuccess.style.display = 'none';
                        goHome();
                    }, 2000);
                } catch (error) {
                    if (loader) loader.style.display = 'none';
                    showToast('Recharge failed. Please try again.', 'Error', 'danger');
                    console.error('Error during recharge:', error);
                }
            },
            prefill: {
                contact: mobileNumber,
                email: email
            },
            method: {
                card: selectedPaymentMethod === 'card',
                upi: selectedPaymentMethod === 'upi',
                netbanking: selectedPaymentMethod === 'netbanking'
            },
            theme: {
                color: '#C70039'
            }
        };
        const rzp = new Razorpay(options);
        rzp.open();
    } catch (error) {
        if (loader) loader.style.display = 'none';
        showToast('Payment initiation failed. Please try again.', 'Error', 'danger');
        console.error('Error during payment:', error);
    }
}

// Show Transactions
async function showTransactions() {

    document.getElementById("heroCarousel").style.display = "none";
    document.getElementById("quickpay").style.display = "none";
    document.querySelector(".recommended-section").style.display = "none";
    document.getElementById("rechargeSection").style.display = "none";
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("buyNewConnectionPage").style.display = "none";
    document.getElementById("helpSection").style.display = "none";

    toggleSection('transactionSection');
    const mobileNumber = sessionStorage.getItem('userMobile');
    const transactionList = document.getElementById('transactionList');
    if (!mobileNumber) {
        if (transactionList) transactionList.innerHTML = '<p>Please enter a mobile number in the recharge section first.</p>';
        return;
    }
    try {
        const response = await fetch(`${BASE_URL}/customer/transactions/${mobileNumber}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            if (response.status === 401) {
                redirectToLogin();
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const transactions = await response.json();
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
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true
    });
}

// Download Receipt
async function downloadReceipt(id) {
    try {
        const response = await fetch(`${BASE_URL}/customer/transactions/download/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            if (response.status === 401) {
                redirectToLogin();
                return;
            }
            throw new Error('Receipt not found');
        }
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

// Toggle Sections
function toggleSection(sectionId) {
    const sections = ['paymentSection', 'transactionSection', 'prepaidPlansSection'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = id === sectionId ? 'block' : 'none';
        }
    });
}

// Show Prepaid Plans
function showPrepaidPlans() {
    const paymentSection = document.getElementById("paymentSection");
    const transactionSection = document.getElementById("transactionSection");

    if (paymentSection) paymentSection.style.display = "none";
    if (transactionSection) transactionSection.style.display = "none";

    document.getElementById("heroCarousel").style.display = "none";
    document.getElementById("quickpay").style.display = "none";
    document.querySelector(".recommended-section").style.display = "none";
    document.getElementById("transactionSection").style.display = "none";
    document.getElementById("profileSection").style.display = "none";

    document.getElementById("rechargeSection").style.display = "none";
    document.getElementById("paymentSection").style.display = "none";
    document.getElementById("transactionSection").style.display = "none";
    document.getElementById("helpSection").style.display = "none";
    document.getElementById("buyNewConnectionPage").style.display = "none"


    toggleSection('prepaidPlansSection');
    loadCustomerPlans();
}

// Validate Mobile Number
function validateMobileNumber(mobileNumber) {
    const mobileInput = document.getElementById('customerMobile');
    mobileNumber = mobileNumber || (mobileInput ? mobileInput.value.trim() : sessionStorage.getItem('userMobile'));
    if (!mobileNumber) {
        showTooltip('This field is required!');
        if (mobileInput) mobileInput.focus();
        return false;
    }
    if (!/^\d{10}$/.test(mobileNumber)) {
        showTooltip('Please enter a valid 10-digit mobile number!');
        if (mobileInput) mobileInput.focus();
        return false;
    }
    return true;
}

// Redirect to Login
function redirectToLogin() {
    showToast('Session expired. Please log in again.', 'Authentication Required', 'warning');
    setTimeout(() => {
        window.location.href = 'customerlogin.html';
    }, 2000);
}

// Go Back to Plans
function goBackToPlans() {
    const paymentSection = document.getElementById('paymentSection');
    const prepaidPlansSection = document.getElementById('prepaidPlansSection');

    if (paymentSection) paymentSection.style.display = 'none';
    if (prepaidPlansSection) prepaidPlansSection.style.display = 'block';
}



// Show Toast
function showToast(message, title = 'Notification', type = 'info') {
    const toastContainer = document.createElement('div');
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';  // Adjust as needed
    toastContainer.style.right = '20px'; // Position to the right
    toastContainer.style.zIndex = '1050'; // Ensure it appears on top

    toastContainer.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
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


// Show Tooltip
function showTooltip(message) {
    const mobileInput = document.getElementById('customerMobile');
    if (mobileInput) {
        mobileInput.setAttribute('title', message);
        mobileInput.setAttribute('data-bs-original-title', message);
        const tooltip = new bootstrap.Tooltip(mobileInput);
        tooltip.show();
        setTimeout(() => tooltip.hide(), 2000);
    }
}

// Clear Transaction History
function clearTransactionHistory() {
    const transactionList = document.getElementById('transactionList');
    if (transactionList) {
        transactionList.innerHTML = '<p>No recent transactions.</p>';
        showToast('Transaction history cleared from view.', 'Info', 'info');
    }
}

// Initialize
window.onload = function () {
    const mobileInput = document.getElementById('customerMobile');
    if (mobileInput) {
        mobileInput.value = '';
    }
    if (!getToken()) {
        redirectToLogin();
    } else {
        goHome();
    }
};
//Customer plans

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



// // Go to Buy New Connection page (use toggleSection for consistency)
// function goToBuyNewConnection() {
//     document.querySelector(".recommended-section").style.display = "none";
//     toggleSection('buyNewConnectionPage');
// }

// // Validation for Customer Name
// document.getElementById("customerName").addEventListener("blur", function () {
//     let name = this.value.trim();
//     let errorElement = document.getElementById("nameError");

//     if (name === "") {
//         errorElement.textContent = "This field is required";
//         this.classList.add("is-invalid");
//     } else if (!/^[a-zA-Z0-9 ]{3,}$/.test(name)) {
//         errorElement.textContent = "Enter at least 3 alphanumeric characters";
//         this.classList.add("is-invalid");
//     } else {
//         errorElement.textContent = "";
//         this.classList.remove("is-invalid");
//     }
// });

// // Validation for Mobile Number
// document.getElementById("mobileNumber").addEventListener("blur", function () {
//     let mobile = this.value.trim();
//     let errorElement = document.getElementById("mobileError");

//     if (mobile === "") {
//         errorElement.textContent = "This field is required";
//         this.classList.add("is-invalid");
//     } else if (!/^\d{10}$/.test(mobile)) {
//         errorElement.textContent = "Please enter a valid 10-digit mobile number!";
//         this.classList.add("is-invalid");
//     } else {
//         errorElement.textContent = "";
//         this.classList.remove("is-invalid");
//     }
// });

// // Validation for Aadhaar Upload
// document.getElementById("aadhaarUpload").addEventListener("change", function () {
//     let errorElement = document.getElementById("aadhaarError");
//     let preview = document.getElementById("aadhaarPreview");

//     if (this.files.length === 0) {
//         errorElement.textContent = "Please upload your Aadhaar card!";
//         this.classList.add("is-invalid");
//         preview.src = "";
//     } else {
//         errorElement.textContent = "";
//         this.classList.remove("is-invalid");
//         const file = this.files[0];
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             preview.src = e.target.result; // Show preview
//         };
//         reader.readAsDataURL(file);
//     }
// });

// // Handle Form Submission
// document.getElementById("newConnectionForm").addEventListener("submit", async function (event) {
//     event.preventDefault();

//     let customerName = document.getElementById("customerName").value.trim();
//     let mobileNumber = document.getElementById("mobileNumber").value.trim();
//     let aadhaarFile = document.getElementById("aadhaarUpload").files[0];

//     // Client-side validation
//     if (customerName === "" || !/^[a-zA-Z0-9 ]{3,}$/.test(customerName)) {
//         showToast("Please enter a valid name with at least 3 alphanumeric characters!", "Error", "danger");
//         return;
//     }

//     if (mobileNumber === "" || !/^\d{10}$/.test(mobileNumber)) {
//         showToast("Please enter a valid 10-digit mobile number!", "Error", "danger");
//         return;
//     }

//     if (!aadhaarFile) {
//         showToast("Please upload your Aadhaar card!", "Error", "danger");
//         return;
//     }

//     // Convert file to Base64
//     const reader = new FileReader();
//     reader.onload = async function (event) {
//         const aadhaarData = event.target.result; // Base64 string

//         // Prepare KYC request data
//         const kycRequest = {
//             mobileNumber: mobileNumber,
//             customerName: customerName,
//             aadharDocument: aadhaarData, // Send as Base64 string
//             status: "Pending" // Default status set by backend, but included for clarity
//         };

//         try {
//             const response = await fetch(`${BASE_URL}/admin/kyc/add`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(kycRequest)
//             });

//             if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//             const result = await response.json();
//             showToast(result.message, "Success", "success");
//             document.getElementById("newConnectionForm").reset(); // Clear form
//             document.getElementById("aadhaarPreview").src = ""; // Clear preview
//         } catch (error) {
//             console.error("Error submitting KYC request:", error);
//             showToast("Failed to submit KYC request. Please try again.", "Error", "danger");
//         }
//     };
//     reader.readAsDataURL(aadhaarFile);
// });

// // View Latest KYC Request (optional: fetch from backend)
// async function viewRequest() {
//     try {
//         const response = await fetch(`${BASE_URL}/admin/kyc/pending`);
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         const pendingRequests = await response.json();

//         if (pendingRequests.length === 0) {
//             showToast("No pending KYC requests found!", "Info", "info");
//             return;
//         }

//         const latestRequest = pendingRequests[pendingRequests.length - 1];
//         const statusClass = "status-" + latestRequest.status.toLowerCase();
//         const toastMessage = `
//             <strong>Name:</strong> ${latestRequest.customerName}<br>
//             <strong>Mobile:</strong> ${latestRequest.mobileNumber}<br>
//             <strong>Status:</strong> <span class="${statusClass}">${latestRequest.status}</span>
//         `;
//         showToast(toastMessage, "KYC Request", "info");
//     } catch (error) {
//         console.error("Error fetching KYC requests:", error);
//         showToast("Failed to fetch KYC requests. Please try again.", "Error", "danger");
//     }
// }

// // Reuse your existing showToast function (updated to handle HTML content)
// function showToast(message, title = "Notification", type = "info") {
//     const toastContainer = document.createElement("div");
//     toastContainer.innerHTML = `
//         <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
//             <div class="toast-header">
//                 <strong class="me-auto">${title}</strong>
//                 <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
//             </div>
//             <div class="toast-body">${message}</div>
//         </div>
//     `;
//     document.body.appendChild(toastContainer);
//     const toast = new bootstrap.Toast(toastContainer.querySelector(".toast"));
//     toast.show();
//     setTimeout(() => toastContainer.remove(), 5000);

// }


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

function goBackToPlans() {
    const prepaidPlansSection = document.getElementById("prepaidPlansSection");

    if (prepaidPlansSection) {
        prepaidPlansSection.style.display = "block"; 
        prepaidPlansSection.scrollIntoView({ behavior: "smooth" });
    } else {
        console.error("Element with ID 'prepaidPlansSection' not found.");
    }
}

