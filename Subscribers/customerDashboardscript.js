

function scrollToSection(event, sectionId) {
    event.preventDefault();
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

function scrollPlans(scrollValue) {
    const planScroll = document.getElementById("planScroll");
    planScroll.scrollLeft += scrollValue;
}

document.addEventListener("DOMContentLoaded", loadProfile);

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

function toggleEdit() {
    document.querySelector(".profile-card").style.display = "none";
    document.querySelector(".edit-section").style.display = "block";

    document.getElementById("editName").value = localStorage.getItem("profileName") || "";
    document.getElementById("editPhone").value = localStorage.getItem("profilePhone") || "";
    document.getElementById("editAltPhone").value = localStorage.getItem("profileAltPhone") || "";
    document.getElementById("editEmail").value = localStorage.getItem("profileEmail") || "";
    document.getElementById("editAddress").value = localStorage.getItem("profileAddress") || "";
}

function saveProfile() {
    let name = document.getElementById("editName").value;
    let phone = document.getElementById("editPhone").value;
    let altPhone = document.getElementById("editAltPhone").value;
    let email = document.getElementById("editEmail").value;
    let address = document.getElementById("editAddress").value;

    if (name && phone && email && address) {
        localStorage.setItem("profileName", name);
        localStorage.setItem("profilePhone", phone);
        localStorage.setItem("profileAltPhone", altPhone);
        localStorage.setItem("profileEmail", email);
        localStorage.setItem("profileAddress", address);

        loadProfile();

        document.querySelector(".profile-card").style.display = "block";
        document.querySelector(".edit-section").style.display = "none";
    } else {
        alert("Please fill in all fields correctly.");
    }
}

document.getElementById("uploadPic").addEventListener("change", function (event) {
    let reader = new FileReader();
    reader.onload = function (e) {
        localStorage.setItem("profilePic", e.target.result);
        document.getElementById("editProfilePic").src = e.target.result;
        document.getElementById("profilePic").src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
});

function loadProfile() {
    document.getElementById("profileName").textContent = localStorage.getItem("profileName") || "User";
    document.getElementById("profilePhone").textContent = localStorage.getItem("profilePhone") || "Not provided";
    document.getElementById("profileAltPhone").textContent = localStorage.getItem("profileAltPhone") || "Not provided";
    document.getElementById("profileEmail").textContent = localStorage.getItem("profileEmail") || "Not provided";
    document.getElementById("profileAddress").textContent = localStorage.getItem("profileAddress") || "Not provided";

    let storedPic = localStorage.getItem("profilePic");
    if (storedPic) {
        document.getElementById("profilePic").src = storedPic;
        document.getElementById("editProfilePic").src = storedPic;
    }
}


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
function loadCustomerPlans() {
    let savedPlans = JSON.parse(localStorage.getItem("prepaidPlans"));
    if (savedPlans) {
        document.getElementById("popularPlansContainer").innerHTML = generatePlanCards(savedPlans.popularPlans);
        document.getElementById("validityPlansContainer").innerHTML = generatePlanCards(savedPlans.validityPlans);
        document.getElementById("dataPlansContainer").innerHTML = generatePlanCards(savedPlans.dataPlans);
        document.getElementById("topupPlansContainer").innerHTML = generatePlanCards(savedPlans.topupPlans);
        document.getElementById("isdPlansContainer").innerHTML = generatePlanCards(savedPlans.isdPlans);
        document.getElementById("comboPlansContainer").innerHTML = generatePlanCards(savedPlans.comboPlans);
    }
}

// Declare global variables
let selectedPlan = null;
let selectedPlanBenefits = "";
let selectedPaymentMethod = "";

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    let paymentButtons = document.querySelectorAll(".payment-options button");
    paymentButtons.forEach(btn => btn.classList.remove("btn-primary"));
    event.target.classList.add("btn-primary");
}

// Generate plan cards from HTML list
function generatePlanCards(planListHTML) {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = planListHTML;
    let plans = tempDiv.getElementsByTagName("li");
    let cards = "";

    for (let plan of plans) {
        let planText = plan.firstChild.textContent.trim();
        let [amountPart, detailsPart] = planText.split(" - ");
        let amount = amountPart.replace("₹", "").trim();
        let benefits = detailsPart.trim();

        cards += `
        <div class="col-md-4">
            <div class="card p-3 text-center shadow-sm" onclick="selectPlan(${amount}, '${benefits}', this)">
                <h5 class="fw-bold text-danger">₹${amount} Plan</h5>
                <p class="text-dark">${benefits}</p>
                <button class="btn btn-danger w-100 mt-2 fw-bold"
                    style="background: linear-gradient(90deg, #C70039, #900C3F); border: none; padding: 10px; border-radius: 20px;"
                    onclick="moveToPayment(${amount}, '${benefits}')">Recharge Now</button>
            </div>
        </div>
    `;
    }

    return cards;
}

// Show tooltip for invalid input
function showTooltip(message) {
    let mobileInput = document.getElementById("customerMobile");

    mobileInput.setAttribute("title", message);
    mobileInput.setAttribute("data-bs-original-title", message);

    let tooltip = new bootstrap.Tooltip(mobileInput);
    tooltip.show();

    setTimeout(() => {
        tooltip.hide();
    }, 2000);
}

// Validate mobile number
function validateMobileNumber() {
    let mobileInput = document.getElementById("customerMobile");
    let mobileNumber = mobileInput ? mobileInput.value.trim() : localStorage.getItem("userMobile");

    if (!mobileNumber) {
        showTooltip("This field is required!");
        mobileInput.focus();
        return false;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
        showTooltip("Please enter a valid 10-digit mobile number!");
        mobileInput.focus();
        return false;
    }

    return true;
}


function selectPaymentMethod(method, element) {

    selectedPaymentMethod = method;


    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('selected');
    });


    element.classList.add('selected');

    // Show toast notification
    showToast(`${method} selected as payment method`, "Payment Method", "info");

    // Enable pay now button and add pulsing effect
    const payNowBtn = document.getElementById('payNowBtn');
    payNowBtn.classList.add('btn-pulse');

    // Optional: Auto-scroll to pay now button on mobile
    if (window.innerWidth < 768) {
        setTimeout(() => {
            payNowBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

// Add click event listeners when the document is ready
document.addEventListener('DOMContentLoaded', function () {
    // Add explicit click handlers to improve touch device compatibility
    document.getElementById('card-payment').addEventListener('click', function () {
        selectPaymentMethod('Credit/Debit Card', this);
    });

    document.getElementById('upi-payment').addEventListener('click', function () {
        selectPaymentMethod('UPI', this);
    });

    document.getElementById('netbanking-payment').addEventListener('click', function () {
        selectPaymentMethod('Net Banking', this);
    });
});

// Proceed to payment
function moveToPayment() {
    let mobileInput = document.getElementById("customerMobile");
    let mobileNumber = mobileInput ? mobileInput.value.trim() : "";

    if (!validateMobileNumber()) return;

    // Store the correct mobile number in localStorage
    localStorage.setItem("userMobile", mobileNumber);


    selectedPlan = localStorage.getItem("selectedPlan");
    selectedPlanBenefits = localStorage.getItem("selectedPlanBenefits");

    document.getElementById("paymentMobile").innerText = mobileNumber;
    document.getElementById("paymentAmount").innerText = `${selectedPlan}`;
    document.getElementById("paymentBenefits").innerText = selectedPlanBenefits;

    document.getElementById("prepaidPlansSection").style.display = "none";
    document.getElementById("paymentSection").style.display = "block";
}

function confirmPayment() {
    if (!selectedPaymentMethod) {

        showToast("Please select a payment method before proceeding.", "Payment Method Required", "warning");
        return;
    }

    document.getElementById("loader").style.display = "block";
    document.getElementById("paymentSuccess").style.display = "none";

    setTimeout(function () {
        document.getElementById("loader").style.display = "none";
        document.getElementById("paymentSuccess").style.display = "block";

        let mobileNumber = localStorage.getItem("userMobile");

        if (!mobileNumber || !selectedPlan) {

            showToast("Error: Missing mobile number or selected plan!", "Error", "danger");
            return;
        }

        // Replace alert with toast
        showToast(`Recharge Successful: ₹${selectedPlan} for mobile: ${mobileNumber} using ${selectedPaymentMethod}`, "Success", "success");

        saveTransaction();

        setTimeout(function () {
            document.getElementById("paymentSuccess").style.display = "none";
            goHome();
        }, 2000);
    }, 2000);
}

function saveTransaction() {
    let mobileNumber = localStorage.getItem("userMobile");

    if (!mobileNumber || !selectedPlan) {
        // Replace alert with toast
        showToast("Error: No mobile number or selected plan found!", "Error", "danger");
        return;
    }

    let transaction = {
        mobile: mobileNumber,
        amount: selectedPlan,
        benefits: selectedPlanBenefits,
        paymentMethod: selectedPaymentMethod,
        date: new Date().toLocaleString()
    };

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.unshift(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function showTransactions() {
    document.getElementById("heroCarousel").style.display = "none";
    document.getElementById("quickpay").style.display = "none";
    document.querySelector(".recommended-section").style.display = "none";
    document.getElementById("rechargeSection").style.display = "none";
    document.getElementById("paymentSection").style.display = "none";
    document.getElementById("transactionSection").style.display = "block";
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("buyNewConnectionPage").style.display = "none";
    document.getElementById("helpSection").style.display = "none";
    document.getElementById("prepaidPlansSection").style.display = "none";

    let transactionList = document.getElementById("transactionList");
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    if (transactions.length === 0) {
        transactionList.innerHTML = "<p>No recent transactions.</p>";
        return;
    }

    transactionList.innerHTML = transactions.map((t, index) => `
    <div class="transaction-item d-flex justify-content-between align-items-center border p-3 mb-2 rounded">
        <div>
            <p><strong>Mobile:</strong> ${t.mobile}</p>
            <p><strong>Amount:</strong> ₹${t.amount}</p>
            <p><strong>Benefits:</strong> ${t.benefits}</p>
            <p><strong>Payment Method:</strong> ${t.paymentMethod}</p>
            <p><strong>Date:</strong> ${t.date}</p>
        </div>
        <button class="btn btn-outline-danger" onclick="generatePDF(${index})">📄 Generate PDF</button>
    </div>
`).join("");

    // Add "Download All Transactions" button
    transactionList.innerHTML += `
    <div class="text-center mt-3">
        <button class="btn btn-danger" onclick="generateAllPDF()">📥 Download All Transactions</button>
    </div>
`;
}

// Generate and Download PDF for a Transaction
function generatePDF(index) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let t = transactions[index];

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header - Company Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("MOBICOMM", 20, 20);
    doc.setFontSize(10);
    doc.text("123 Street, Bangalore, India", 20, 30);
    doc.text("Email: support@mobicomm.in | Phone: +123 456 7890", 20, 35);

    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0);
    doc.text("Transaction Invoice", 80, 50);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 55, 190, 55);

    // Transaction Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice No: INV-${index + 1}`, 150, 65);
    doc.text(`Date: ${t.date}`, 20, 65);
    doc.text(`Customer Mobile: ${t.mobile}`, 20, 75);

    // Table Data
    const tableData = [
        ["Description", "Details"],
        ["Amount Paid", `₹${t.amount}`],
        ["Plan Benefits", t.benefits],
        ["Payment Method", t.paymentMethod],
        ["Transaction Date", t.date]
    ];

    // AutoTable for Better Structure
    doc.autoTable({
        startY: 85,
        headStyles: { fillColor: [255, 0, 0] }, // Red Header
        bodyStyles: { fontSize: 12 },
        theme: "grid",
        head: [["Invoice Details", "Information"]],
        body: tableData,
        margin: { left: 20, right: 20 },
    });

    // Footer Section
    doc.setFontSize(10);
    doc.text("Thank you for your payment!", 80, doc.lastAutoTable.finalY + 20);
    doc.text("For any queries, contact support@mobicomm.in", 60, doc.lastAutoTable.finalY + 30);

    // Save PDF with a dynamic filename
    doc.save(`Invoice_${t.mobile}_${t.date.replace(/[/,: ]/g, "_")}.pdf`);
}

// Generate PDF for all transactions
function generateAllPDF() {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    if (transactions.length === 0) {
        alert("No transactions found!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header - Company Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("MOBICOMM", 20, 20);
    doc.setFontSize(10);
    doc.text("123 Street, Bangalore, India", 20, 30);
    doc.text("Email: support@mobicomm.in | Phone: +123 456 7890", 20, 35);

    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0);
    doc.text("All Transactions History", 70, 50);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 55, 190, 55); // Line Separator

    // Prepare table data
    let tableData = transactions.map((t, index) => [
        index + 1, t.mobile, `₹${t.amount}`, t.benefits, t.paymentMethod, t.date
    ]);

    // AutoTable for listing all transactions
    doc.autoTable({
        startY: 65,
        headStyles: { fillColor: [255, 0, 0] },
        theme: "grid",
        head: [["#", "Mobile", "Amount", "Benefits", "Payment Method", "Date"]],
        body: tableData,
        margin: { left: 10, right: 10 },
    });

    // Footer Section
    doc.setFontSize(10);
    doc.text("Thank you for using MOBICOMM!", 75, doc.lastAutoTable.finalY + 20);
    doc.text("For any queries, contact support@mobicomm.in", 60, doc.lastAutoTable.finalY + 30);

    // Save PDF
    doc.save(`All_Transactions_${new Date().toISOString().slice(0, 10)}.pdf`);
}



function goBackToPlans() {
    document.getElementById("paymentSection").style.display = "none";
    document.getElementById("prepaidPlansSection").style.display = "block";
}

// Load Mobile Number from Local Storage on Page Load
window.onload = function () {
    loadCustomerPlans();
    let storedMobile = localStorage.getItem("userMobile");
    if (storedMobile) {
        document.getElementById("paymentMobile").innerText = storedMobile;
    }
};



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



// Function to show the "Buy New Connection" page and hide other sections


function goToBuyNewConnection() {
    // Hide other sections
    document.getElementById("heroCarousel").style.display = "none";
    document.getElementById("quickpay").style.display = "none";
    document.querySelector(".recommended-section").style.display = "none";
    document.getElementById("rechargeSection").style.display = "none";
    document.getElementById("paymentSection").style.display = "none";
    document.getElementById("transactionSection").style.display = "none";
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("helpSection").style.display = "none";
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("prepaidPlansSection").style.display = "none";

    // Show the Buy New Connection page
    document.getElementById("buyNewConnectionPage").style.display = "block";

}



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

document.getElementById("aadhaarUpload").addEventListener("change", function () {
    let errorElement = document.getElementById("aadhaarError");

    if (this.files.length === 0) {
        errorElement.textContent = "Please upload your Aadhaar card!";
        this.classList.add("is-invalid");
    } else {
        errorElement.textContent = "";
        this.classList.remove("is-invalid");
    }
});

document.getElementById("newConnectionForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let customerName = document.getElementById("customerName").value.trim();
    let mobile = document.getElementById("mobileNumber").value.trim();
    let aadhaarFile = document.getElementById("aadhaarUpload").files[0];

    if (customerName === "" || !/^[a-zA-Z0-9 ]{3,}$/.test(customerName)) {
        alert("Please enter a valid name with at least 3 alphanumeric characters!");
        return;
    }

    if (mobile === "" || !/^\d{10}$/.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number!");
        return;
    }

    if (!aadhaarFile) {
        alert("Please upload your Aadhaar card!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (event) {
        let aadhaarData = event.target.result;

        let newRequest = { mobile, customerName, aadhaarData, status: "Pending" };

        let kycRequests = JSON.parse(localStorage.getItem("kycRequests")) || [];
        kycRequests.push(newRequest);
        localStorage.setItem("kycRequests", JSON.stringify(kycRequests));

        alert("Your request has been submitted successfully! MobiComm will contact you for KYC.");
    };
    reader.readAsDataURL(aadhaarFile);

    this.reset();
});



function viewRequest() {
    let kycRequests = JSON.parse(localStorage.getItem("kycRequests")) || [];

    if (kycRequests.length === 0) {
        showToast("No KYC request found!");
        return;
    }

    let latestRequest = kycRequests[kycRequests.length - 1];
    let statusClass = "status-" + latestRequest.status.toLowerCase();

    let toastMessage = `<strong>Name:</strong> ${latestRequest.customerName}<br>
                <strong>Mobile:</strong> ${latestRequest.mobile}<br>
                <strong>Status:</strong> <span class='${statusClass}'>${latestRequest.status}</span>`;

    showToast(toastMessage);
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
bottom:80px;
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
