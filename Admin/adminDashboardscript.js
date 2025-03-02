

function loadPrepaidPlans() {
    document.getElementById("home").style.display = "none";
    document.getElementById("prepaidPlans").style.display = "block";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "none";
    document.getElementById("adminProfile").style.display = "none";

}

function loadHome() {
    document.getElementById("home").style.display = "block";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "none";
    document.getElementById("admin-kyc").style.display = "none";
    document.getElementById("adminProfile").style.display = "none";

}


function loadUserManagement() {
    document.getElementById("home").style.display = "none";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "block";
    document.getElementById("kycDetails").style.display = "none";
    document.getElementById("adminProfile").style.display = "none";
    calculateDaysRemaining();
}




const customerNames = ["Alice Johnson", "Bob Smith", "Charlie Brown", "David White", "Emma Wilson", "Frank Thomas", "Grace Hall", "Henry Adams", "Ivy Carter", "Jack Miller", "Karen Davis", "Leo Rodriguez", "Mia Lopez", "Noah Gonzalez", "Olivia Hernandez", "Peter King", "Quinn Scott", "Rachel Moore", "Samuel Young", "Tina Baker", "Umar Perez", "Victoria Reed", "William Turner", "Xander Morris", "Yasmine Evans", "Zachary Foster", "Amanda Green", "Brandon Carter", "Chloe Nelson", "Daniel Wright"];

const users = customerNames.map((name, index) => ({
    mobile: `98765432${(index + 1).toString().padStart(2, '0')}`,
    name,
    startDate: `2025-01-${((index % 30) + 1).toString().padStart(2, '0')}`,
    endDate: `2025-03-${((index % 30) + 1).toString().padStart(2, '0')}`,
}));

let filteredUsers = [...users]; // Store the current filtered users
let currentPage = 1;
const rowsPerPage = 10;

function filterUsers() {
    const searchName = document.getElementById("searchName").value.toLowerCase();
    const startDateFilter = document.getElementById("startDate").value;
    const endDateFilter = document.getElementById("endDate").value;

    filteredUsers = users.filter(user => {
        const matchesName = user.name.toLowerCase().includes(searchName);
        const matchesStartDate = startDateFilter ? user.startDate >= startDateFilter : true;
        const matchesEndDate = endDateFilter ? user.endDate <= endDateFilter : true;
        return matchesName && matchesStartDate && matchesEndDate;
    });

    currentPage = 1;
    displayUsers(currentPage);
}

function displayUsers(page) {
    document.getElementById("userTable").innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedUsers = filteredUsers.slice(start, end);

    paginatedUsers.forEach(user => {
        let daysLeft = Math.ceil((new Date(user.endDate) - new Date()) / (1000 * 60 * 60 * 24));
        document.getElementById("userTable").innerHTML += `
            <tr>
                <td>${user.mobile}</td>
                <td>${user.name}</td>
                <td>${user.startDate}</td>
                <td>${user.endDate}</td>
                <td>${daysLeft > 0 ? `${daysLeft} days` : "Expired"}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" onclick="alert('Notification added for ${user.name}!')">Add Notify</button>
                    <button class="btn btn-success btn-sm" onclick="generatePDF(this)">Generate PDF</button>
                </td>
            </tr>`;
    });

    displayPagination();
}

function displayPagination() {
    document.getElementById("pagination").innerHTML = "";
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        document.getElementById("pagination").innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>`;
    }
}

function changePage(page) {
    currentPage = page;
    displayUsers(page);
}

function generatePDF(button) {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    let row = button.closest("tr");
    if (!row) {
        alert("Error: Could not find user row.");
        return;
    }

    let mobileNumber = row.cells[0].innerText;
    let customerName = row.cells[1].innerText;
    let startDate = row.cells[2].innerText;
    let endDate = row.cells[3].innerText;
    let daysRemaining = row.cells[4].innerText;

    doc.text("User Details Report", 14, 10);
    doc.text(`Customer Name: ${customerName}`, 14, 20);
    doc.text(`Mobile Number: ${mobileNumber}`, 14, 30);
    doc.text(`Start Date: ${startDate}`, 14, 40);
    doc.text(`End Date: ${endDate}`, 14, 50);
    doc.text(`Days Remaining: ${daysRemaining}`, 14, 60);

    let fileName = customerName.replace(/\s+/g, "_") + "_Details.pdf";
    doc.save(fileName);
}

displayUsers(1);

window.onload = function () {
    document.getElementById("home").style.display = "block";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    calculateDaysRemaining();
};




function loadKYCRequests() {
    let kycRequests = JSON.parse(localStorage.getItem("kycRequests")) || [];
    let kycTable = document.getElementById("kycTable");
    kycTable.innerHTML = "";

    kycRequests.forEach((request, index) => {
        let row = `<tr>
            <td>${request.mobile}</td>
            <td>${request.customerName}</td>
            <td><a href="${request.aadhaarData}" target="_blank" class="btn btn-sm btn-primary">View PDF</a></td>
            <td><span class="status ${request.status.toLowerCase()}">${request.status}</span></td>
            <td>
                <button class="btn btn-success btn-sm me-2" onclick="approveKYC(${index})">Approve</button>
                <button class="btn btn-danger btn-sm" onclick="rejectKYC(${index})">Reject</button>
            </td>
        </tr>`;
        kycTable.innerHTML += row;
    });
}

function approveKYC(index) {
    let kycRequests = JSON.parse(localStorage.getItem("kycRequests")) || [];
    kycRequests[index].status = "Approved";
    localStorage.setItem("kycRequests", JSON.stringify(kycRequests));
    loadKYCRequests();
}

function rejectKYC(index) {
    let kycRequests = JSON.parse(localStorage.getItem("kycRequests")) || [];
    kycRequests[index].status = "Rejected";
    localStorage.setItem("kycRequests", JSON.stringify(kycRequests));
    loadKYCRequests();
}

// Function to clear local storage and refresh table
function clearKYCData() {
    if (confirm("Are you sure you want to clear all KYC data?")) {
        localStorage.removeItem("kycRequests");
        loadKYCRequests(); // Refresh table
        alert("All KYC data has been cleared!");
    }
}



window.onload = function () {
    document.getElementById("home").style.display = "block";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "none";
    calculateDaysRemaining();
};


function loadKYC() {
    document.getElementById("home").style.display = "none";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "block";
    document.getElementById("adminProfile").style.display = "none";
    loadKYCRequests();  // Load KYC data
}


// Function to show only the Admin Profile and hide all other sections
function loadHome() {
    // Hide all other sections
    document.getElementById("home").style.display = "block";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "none";

    // Show the Admin Profile section
    document.getElementById("adminProfile").style.display = "none";
}



// Function to load Admin Profile data from localStorage


function loadAdminProfile() {
    console.log("🔍 Attempting to load admin profile...");

    let profileSection = document.getElementById("adminProfile");

    if (profileSection) {
        document.getElementById("home").style.display = "none";
        document.getElementById("prepaidPlans").style.display = "none";
        document.getElementById("userManagement").style.display = "none";
        document.getElementById("kycDetails").style.display = "none";

        profileSection.style.display = "block";
        document.querySelector(".profile-card").style.display = "block";
        document.querySelector(".edit-section").style.display = "none";

        loadSavedAdminProfile();
        console.log("✅ Admin Profile Loaded");
    } else {
        console.error("❌ Admin Profile Section Not Found!");
    }
}

function loadSavedAdminProfile() {
    let savedName = localStorage.getItem("adminName");
    let savedEmail = localStorage.getItem("adminEmail");
    let savedMobile = localStorage.getItem("adminMobile");
    let savedProfilePic = localStorage.getItem("adminProfilePic");

    if (savedName) {
        document.getElementById("adminName").textContent = savedName;
        document.getElementById("displayAdminName").textContent = savedName;
    }
    if (savedEmail) {
        document.getElementById("displayAdminEmail").textContent = savedEmail;
    }
    if (savedMobile) {
        document.getElementById("displayAdminMobile").textContent = savedMobile;
    }
    if (savedProfilePic) {
        document.getElementById("adminProfilePic").src = savedProfilePic;
        document.getElementById("editAdminProfilePic").src = savedProfilePic;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadSavedAdminProfile();
});

function toggleEdit() {
    document.querySelector(".profile-card").style.display = "none";
    document.querySelector(".edit-section").style.display = "block";

    document.getElementById("editAdminName").value = document.getElementById("adminName").textContent;
    document.getElementById("editAdminEmail").value = document.getElementById("displayAdminEmail").textContent;
    document.getElementById("editAdminMobile").value = document.getElementById("displayAdminMobile").textContent;
}

function saveAdminProfile() {
    let name = document.getElementById("editAdminName").value;
    let email = document.getElementById("editAdminEmail").value;
    let mobile = document.getElementById("editAdminMobile").value;
    let password = document.getElementById("editAdminPassword").value;

    if (name && email && mobile) {
        document.getElementById("adminName").textContent = name;
        document.getElementById("displayAdminName").textContent = name;
        document.getElementById("displayAdminEmail").textContent = email;
        document.getElementById("displayAdminMobile").textContent = mobile;

        localStorage.setItem("adminName", name);
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("adminMobile", mobile);
        if (password) {
            localStorage.setItem("adminPassword", password);
        }

        alert("Profile Updated Successfully!");

        document.querySelector(".profile-card").style.display = "block";
        document.querySelector(".edit-section").style.display = "none";
    } else {
        alert("Please fill in all fields.");
    }
}

document.getElementById("uploadAdminPic").addEventListener("change", function (event) {
    let reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("editAdminProfilePic").src = e.target.result;
        document.getElementById("adminProfilePic").src = e.target.result;
        localStorage.setItem("adminProfilePic", e.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
});






var currentPlanType = "";
var currentEditElement = null;
var currentDeleteElement = null;

// Save Plans to Local Storage
function savePlansToLocalStorage() {
    let allPlans = {
        popularPlans: document.getElementById("popularPlans")?.innerHTML || "",
        validityPlans: document.getElementById("validityPlans")?.innerHTML || "",
        dataPlans: document.getElementById("dataPlans")?.innerHTML || "",
        topupPlans: document.getElementById("topupPlans")?.innerHTML || "",
        isdPlans: document.getElementById("isdPlans")?.innerHTML || "",
        comboPlans: document.getElementById("comboPlans")?.innerHTML || ""
    };
    localStorage.setItem("prepaidPlans", JSON.stringify(allPlans));
    console.log("✅ Plans Saved to Local Storage", allPlans);
    window.dispatchEvent(new Event("storage"));
}


// Load Plans from Local Storage on Page Load
function loadPlansFromLocalStorage() {
    let savedPlans = JSON.parse(localStorage.getItem("prepaidPlans"));
    if (savedPlans) {
        document.getElementById("popularPlans").innerHTML = savedPlans.popularPlans;
        document.getElementById("validityPlans").innerHTML = savedPlans.validityPlans;
        document.getElementById("dataPlans").innerHTML = savedPlans.dataPlans;
        document.getElementById("topupPlans").innerHTML = savedPlans.topupPlans;
        document.getElementById("isdPlans").innerHTML = savedPlans.isdPlans;
        document.getElementById("comboPlans").innerHTML = savedPlans.comboPlans;
    }

    console.log("✅ Plans Loaded from Local Storage:", savedPlans);

    //  Reattach Event Listeners After Loading
    setTimeout(attachEventListeners, 500);
}

// Attach Event Listeners to Edit/Delete Buttons (after loading from storage)
function attachEventListeners() {
    document.querySelectorAll(".btn-warning").forEach(button => {
        button.onclick = function () { openEditModal(this); };
    });

    document.querySelectorAll(".btn-danger").forEach(button => {
        button.onclick = function () {
            openDeleteConfirmation(this);
        };
    });

    console.log("✅ Event Listeners Attached to Plans");
}

//  Open Add Plan Modal
function openAddModal(planType) {
    currentPlanType = planType;
    document.getElementById("planAmount").value = "";
    document.getElementById("planValidity").value = "";
    document.getElementById("planData").value = "";
    document.getElementById("savePlanButton").onclick = addPlan;
    new bootstrap.Modal(document.getElementById("planModal")).show();
}

//  Add a New Plan
function addPlan() {
    let amount = document.getElementById("planAmount").value.trim();
    let validity = document.getElementById("planValidity").value.trim();
    let data = document.getElementById("planData").value.trim();
    if (!amount || !validity || !data) return alert("Please enter valid details.");

    let ul = document.getElementById(currentPlanType);
    let li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `₹${amount} - ${validity} Days | ${data} 
                <button class="btn btn-warning btn-sm" onclick="openEditModal(this)">Edit</button> 
                <button class="btn btn-danger btn-sm" onclick="openDeleteConfirmation(this)">Delete</button>`;
    ul.appendChild(li);

    savePlansToLocalStorage();
    bootstrap.Modal.getInstance(document.getElementById("planModal")).hide();
}

//  Open Edit Modal
// Modified addPlan function with proper structure
function addPlan() {
    let amount = document.getElementById("planAmount").value.trim();
    let validity = document.getElementById("planValidity").value.trim();
    let data = document.getElementById("planData").value.trim();
    if (!amount || !validity || !data) return alert("Please enter valid details.");

    let ul = document.getElementById(currentPlanType);
    let li = document.createElement("li");
    li.className = "list-group-item";

    // Create plan info span
    let planInfo = document.createElement("span");
    planInfo.className = "plan-info";
    planInfo.textContent = `₹${amount} - ${validity} Days | ${data}`;

    // Create button container
    let btnGroup = document.createElement("div");
    btnGroup.className = "btn-action-group";

    // Create edit button
    let editBtn = document.createElement("button");
    editBtn.className = "btn btn-warning btn-sm btn-action";
    editBtn.textContent = "Edit";
    editBtn.onclick = function () { openEditModal(this); };

    // Create delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm btn-action";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () { openDeleteConfirmation(this); };

    // Append buttons to button group
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    // Append plan info and button group to list item
    li.appendChild(planInfo);
    li.appendChild(btnGroup);

    // Add the new item to the list
    ul.appendChild(li);

    savePlansToLocalStorage();
    bootstrap.Modal.getInstance(document.getElementById("planModal")).hide();
}

// Modified openEditModal function to work with the new structure
function openEditModal(button) {
    // Find the parent li element
    let parentLi = button.closest('.list-group-item');
    currentEditElement = parentLi;

    // Get the plan info text
    let planText = parentLi.querySelector('.plan-info').textContent.trim();

    let [amountPart, detailsPart] = planText.split(" - ");
    let amount = amountPart.replace("₹", "");
    let [validity, data] = detailsPart.split(" | ");
    validity = validity.replace(" Days", "");

    document.getElementById("planAmount").value = amount;
    document.getElementById("planValidity").value = validity;
    document.getElementById("planData").value = data;
    document.getElementById("savePlanButton").onclick = editPlan;
    new bootstrap.Modal(document.getElementById("planModal")).show();
}

// Modified editPlan function to work with the new structure
function editPlan() {
    if (!currentEditElement) return;

    let planInfo = currentEditElement.querySelector('.plan-info');
    if (planInfo) {
        planInfo.textContent = `₹${document.getElementById("planAmount").value} - ${document.getElementById("planValidity").value} Days | ${document.getElementById("planData").value}`;
    }

    savePlansToLocalStorage();
    bootstrap.Modal.getInstance(document.getElementById("planModal")).hide();
}

function deletePlan() {
    if (!currentDeleteElement) return;

    // Remove the element from the DOM
    currentDeleteElement.remove();

    // Save the updated plans to local storage
    savePlansToLocalStorage();

    // Reset the current delete element
    currentDeleteElement = null;
}



// Modified openDeleteConfirmation function to work with the new structure
function openDeleteConfirmation(button) {
    // Find the parent li element
    let parentLi = button.closest('.list-group-item');
    currentDeleteElement = parentLi;

    // Get the plan info text
    let planText = parentLi.querySelector('.plan-info').textContent.trim();

    let confirmDelete = confirm(`Are you sure you want to delete this plan?\n\n${planText}`);
    if (confirmDelete) {
        deletePlan();
    }
}

// Function to update existing list items to new format
function updateExistingItems() {
    document.querySelectorAll('.list-group-item').forEach(item => {
        // Skip if already formatted
        if (item.querySelector('.plan-info')) return;

        // Get all the text content (excluding button text)
        const buttons = item.querySelectorAll('button');
        let planText = item.textContent.trim();

        buttons.forEach(btn => {
            planText = planText.replace(btn.textContent.trim(), '');
        });
        planText = planText.trim();

        // Clear the existing content
        item.innerHTML = '';

        // Create plan info span
        let planInfo = document.createElement('span');
        planInfo.className = 'plan-info';
        planInfo.textContent = planText;

        // Create button container
        let btnGroup = document.createElement('div');
        btnGroup.className = 'btn-action-group';

        // Add existing buttons to the group
        buttons.forEach(btn => {
            // Clone the button to preserve its attributes and event handlers
            let newBtn = btn.cloneNode(true);
            newBtn.className = btn.className + ' btn-action';
            btnGroup.appendChild(newBtn);
        });

        // Append the elements to the list item
        item.appendChild(planInfo);
        item.appendChild(btnGroup);
    });
}

// Call after loading plans from local storage
function enhancedLoadPlansFromLocalStorage() {
    loadPlansFromLocalStorage();

    // After loading plans, update the structure
    setTimeout(() => {
        updateExistingItems();
        attachEventListeners();
    }, 600);
}

// Replace the original window.onload
window.onload = enhancedLoadPlansFromLocalStorage;

// Add this at the end of your existing script or in a separate script tag
document.addEventListener('DOMContentLoaded', function () {
    // Apply CSS styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
.list-group-item {
display: flex;
justify-content: space-between;
align-items: center;
padding: 0.75rem 1.25rem;
}

.plan-info {
flex-grow: 1;
}

.btn-action-group {
display: flex;
gap: 5px;
margin-left: 10px;
}

.btn-action {
margin: 0;
}`;
    document.head.appendChild(styleElement);

    // Initialize the structure update
    // This will run when the page is loaded
    setTimeout(updateExistingItems, 1000);
});

function updateCustomerDashboard() {
    let event = new Event("storage");
    window.dispatchEvent(event);
}

//Load Plans on Page Load
window.onload = loadPlansFromLocalStorage;

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } }
};

new Chart(document.getElementById('activeUsersChart'), {
    type: 'bar',
    data: {
        labels: ['Total Users', 'Active Users'],
        datasets: [{
            label: 'Users',
            data: [1000, 750],
            backgroundColor: ['#0d6efd', '#20c997']
        }]
    },
    options: chartOptions
});

new Chart(document.getElementById('popularPlanChart'), {
    type: 'bar',
    data: {
        labels: ['Popular Plan', 'Validity Plan', 'Top-Up Plan', 'Data Plan'],
        datasets: [{
            label: 'Usage Percentage',
            data: [40, 30, 20, 10],
            backgroundColor: ['#0d6efd', '#198754', '#dc3545', '#ffc107']
        }]
    },
    options: chartOptions
});

new Chart(document.getElementById('newRegistrationsChart'), {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Registrations',
            data: [50, 80, 120, 90, 150],
            borderColor: '#fd7e14',
            backgroundColor: 'rgba(253, 126, 20, 0.2)',
            fill: true
        }]
    },
    options: chartOptions
});

new Chart(document.getElementById('paymentTrendsChart'), {
    type: 'pie',
    data: {
        labels: ['UPI', 'Debit Card', 'Credit Card', 'Net Banking'],
        datasets: [{
            data: [40, 30, 20, 10],
            backgroundColor: ['#0d6efd', '#dc3545', '#ffc107', '#198754']
        }]
    },
    options: chartOptions
});

new Chart(document.getElementById('adminActionsChart'), {
    type: 'bar',
    data: {
        labels: ['KYC Approved', 'KYC Rejected', 'KYC Pending'],
        datasets: [{
            label: 'Admin Actions',
            data: [120, 40, 30],
            backgroundColor: ['#198754', '#dc3545', '#fd7e14']
        }]
    },
    options: chartOptions
});

function downloadReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("MobiComm Dashboard Report", 14, 20);
    doc.setFontSize(12);
    doc.text("This report summarizes the key performance metrics and trends.", 14, 30);

    const data = [
        ["Metric", "Value"],
        ["Total Users", "1000"],
        ["Active Users", "750"],
        ["Popular Subscription Plan", "40% Usage"],
        ["New Registrations (May)", "150"],
        ["Top Payment Mode", "UPI - 40%"],
        ["KYC Approved", "120"]
    ];

    doc.autoTable({
        startY: 40,
        head: [data[0]],
        body: data.slice(1),
        theme: "striped",
    });

    doc.save("MobiComm_Dashboard_Report.pdf");
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

