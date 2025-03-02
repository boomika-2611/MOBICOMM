
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
function useQuickPay() {
    // For now, just show an alert
    alert("Redirecting to QuickPay for instant recharge.");

}

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


// Function to show the "Buy New Connection" page and hide other sections
function goToBuyNewConnection() {
    // Hide other sections
    document.getElementById("heroCarousel").style.display = "none";
    document.getElementById("quickpay").style.display = "none";
    document.querySelector(".recommended-section").style.display = "none";
    document.getElementById("helpSection").style.display = "none";

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

let allowedNumbers = ["9025159692", "9344863775", "9543530931"];

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

    // Check if mobile number is allowed
    if (!allowedNumbers.includes(mobileNumber)) {
        showToast("Your mobile number is not registered. Please buy a new connection to proceed with recharge.");
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
function showToast(message) {
    let toastContainer = document.createElement("div");
    toastContainer.className = "toast align-items-center show position-fixed bottom-0 end-0 p-3";
    toastContainer.style.zIndex = "1050";
    toastContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
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
    }, 8000); // Remove after 3 seconds
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

        alert("Payment successful using " + paymentMethod + "!");
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
        alert("No invoice available to download.");
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
