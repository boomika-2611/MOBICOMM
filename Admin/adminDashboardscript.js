
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
    document.getElementById("expiringUsersSection").style.display = "none";

}


function loadUserManagement() {
    document.getElementById("home").style.display = "none";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "block";
    document.getElementById("kycDetails").style.display = "none";
    document.getElementById("admin-kyc").style.display = "none";
    document.getElementById("adminProfile").style.display = "none";
    document.getElementById("expiringUsersSection").style.display = "none";
    fetchUsers(0);

}
function loadExpiringUsers() {
    document.getElementById("home").style.display = "none";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "none";
    document.getElementById("adminProfile").style.display = "none";
    document.getElementById("expiringUsersSection").style.display = "block";
    fetchExpiringUsers();


}

const USER_API_URL = 'http://localhost:8083/admin/users';




// function loadExpiringUsers() {
//     showSection('expiringUsersSection');
//     fetchExpiringUsers();
// }

function showSection(sectionId) {
    document.querySelectorAll('#content > div').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[onclick="load${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}()"]`);
    if (activeLink) activeLink.classList.add('active');
}


async function fetchUsers(page = 0, size = 5) {
    try {
        const response = await fetch(`${USER_API_URL}?page=${page}&size=${size}`);
        const data = await response.json();
        renderUsers(data.content);
        renderPagination(data.totalPages, page);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function renderUsers(users) {
    const tableBody = document.getElementById('userTable');
    tableBody.innerHTML = '';
    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.mobileNumber}</td>
                <td>${user.customerName}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.startDate}</td>
                <td>${user.endDate}</td>
                <td>${user.daysRemaining}</td>
            </tr>`;
        tableBody.innerHTML += row;
    });
}

function renderPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    if (totalPages > 1) {
        pagination.innerHTML += `
            <li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="fetchUsers(${currentPage - 1})">Previous</a>
            </li>`;
        for (let i = 0; i < totalPages; i++) {
            pagination.innerHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="fetchUsers(${i})">${i + 1}</a>
                </li>`;
        }
        pagination.innerHTML += `
            <li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="fetchUsers(${currentPage + 1})">Next</a>
            </li>`;
    }
}

async function filterUsers() {
    const name = document.getElementById('searchName').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    try {
        let url = USER_API_URL;
        if (name.length > 2) {
            url = `${USER_API_URL}/search?name=${encodeURIComponent(name)}`;
        } else if (startDate && endDate) {
            url = `${USER_API_URL}/search-by-date?startDate=${startDate}&endDate=${endDate}`;
        } else if (name.length === 0) {
            fetchUsers();
            return;
        }
        const response = await fetch(url);
        const users = await response.json();
        renderUsers(Array.isArray(users) ? users : users.content);
        document.getElementById('pagination').innerHTML = '';
    } catch (error) {
        console.error('Error filtering users:', error);
    }
}

async function loadExpiringUsers() {
    showSection('expiringUsersSection');
    try {
        const response = await fetch(`${USER_API_URL}/expiring-users`); // New endpoint without email sending
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const users = await response.json();
        const tbody = document.getElementById('expiringUsersTableBody');
        tbody.innerHTML = '';
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No users expiring in the next 3 days.</td></tr>';
        } else {
            users.forEach(user => {
                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.customerName}</td>
                        <td>${user.mobileNumber}</td>
                        <td>${user.email || 'N/A'}</td>
                        <td>${user.endDate}</td>
                        <td>${user.daysRemaining}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="notifyUser(${user.id})">Notify</button>

                        </td>
                    </tr>`;
                tbody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error('Error fetching expiring users:', error);
        const tbody = document.getElementById('expiringUsersTableBody');
        tbody.innerHTML = `<tr><td colspan="7">Error loading expiring users: ${error.message}</td></tr>`;
    }
}

async function notifyUser(userId) {
    let button = document.querySelector(`[onclick="notifyUser(${userId})"]`);

    try {
        const response = await fetch(`${USER_API_URL}/notify-user/${userId}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.text();

        // Update button text, disable it & apply styles
        button.innerText = "✅ Notified";
        button.disabled = true;
        button.classList.add("btn-notified");

        // Show modal with response message
        showModal(result);

    } catch (error) {
        console.error("Error notifying user:", error);
        showModal("⚠ Failed to send email: " + error.message);
    }
}

function showModal(message) {
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    const modal = new bootstrap.Modal(document.getElementById('notificationModal'));
    modal.show();
}



const KYC_API_URL = 'http://localhost:8083/admin/kyc';

async function loadKYCRequests() {
    try {
        const response = await fetch(`${KYC_API_URL}`, { // Changed from /pending to fetch all
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const kycRequests = await response.json();
        renderKYCRequests(kycRequests);
    } catch (error) {
        console.error('Error fetching KYC requests:', error);
        document.getElementById('kycTable').innerHTML = `<tr><td colspan="5">Error loading KYC requests: ${error.message}</td></tr>`;
    }
}


function renderKYCRequests(kycRequests) {
    const kycTable = document.getElementById('kycTable');
    kycTable.innerHTML = '';

    if (kycRequests.length === 0) {
        kycTable.innerHTML = '<tr><td colspan="5">No KYC requests found.</td></tr>';
        return;
    }

    kycRequests.forEach(request => {
        const isPending = request.status.toLowerCase() === 'pending';
        const row = `
            <tr>
                <td>${request.mobileNumber}</td>
                <td>${request.customerName}</td>
                <td><a href="${request.aadharDocument}" target="_blank" class="btn btn-sm btn-primary">View PDF</a></td>
                <td><span class="status ${request.status.toLowerCase()}">${request.status}</span></td>
                <td>
                    <button class="btn btn-success btn-sm me-2" onclick="approveKYC(${request.id})" ${!isPending ? 'disabled' : ''}>Approve</button>
                    <button class="btn btn-danger btn-sm" onclick="rejectKYC(${request.id})" ${!isPending ? 'disabled' : ''}>Reject</button>
                </td>
            </tr>`;
        kycTable.innerHTML += row;
    });
}


async function approveKYC(id) {
    try {
        const response = await fetch(`${KYC_API_URL}/approve/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        showModal(result.message || 'KYC request approved successfully!');
        loadKYCRequests(); // Refresh table
    } catch (error) {
        console.error('Error approving KYC:', error);
        showModal('Failed to approve KYC: ' + error.message);
    }
}


async function rejectKYC(id) {
    try {
        const response = await fetch(`${KYC_API_URL}/reject/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        showModal(result.message || 'KYC request rejected successfully!');
        loadKYCRequests(); // Refresh table
    } catch (error) {
        console.error('Error rejecting KYC:', error);
        showModal('Failed to reject KYC: ' + error.message);
    }
}


async function clearKYCData() {
    if (!confirm('Are you sure you want to clear all KYC data?')) return;

    try {
        const response = await fetch(`${KYC_API_URL}`, { // Fetch all requests
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const kycRequests = await response.json();

        // Delete each request
        for (const request of kycRequests) {
            const deleteResponse = await fetch(`${KYC_API_URL}/clear/${request.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors'
            });
            if (!deleteResponse.ok) throw new Error(`HTTP error! Status: ${deleteResponse.status}`);
        }

        showModal('All KYC data has been cleared!');
        loadKYCRequests();
    } catch (error) {
        console.error('Error clearing KYC data:', error);
        showModal('Failed to clear KYC data: ' + error.message);
    }
}

// Show Modal for Messages
function showModal(message) {
    document.getElementById('modalMessage').textContent = message;
    const modal = new bootstrap.Modal(document.getElementById('notificationModal'));
    modal.show();
}

// function loadKYC() {
//     showSection('kycDetails');
//     loadKYCRequests();
// }


// function showSection(sectionId) {
//     document.querySelectorAll('#content > div').forEach(section => {
//         section.style.display = 'none';
//     });
//     document.getElementById(sectionId).style.display = 'block';
// }

// Initial Load
document.addEventListener('DOMContentLoaded', function () {

    loadKYC();
});


window.onload = function () {
    document.getElementById("home").style.display = "block";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "none";
    document.getElementById("adminProfile").style.display = "none";
    document.getElementById("expiringUsersSection").style.display = "none";

};


function loadKYC() {
    document.getElementById("home").style.display = "none";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "block";
    document.getElementById("adminProfile").style.display = "none";
    document.getElementById("expiringUsersSection").style.display = "none";
    loadKYCRequests();
}

function loadHome() {
    // Hide all other sections
    document.getElementById("home").style.display = "block";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "none";
    document.getElementById("expiringUsersSection").style.display = "none";

    // Show the Admin Profile section
    document.getElementById("adminProfile").style.display = "none";
}



// Function to load Admin Profile data from localStorage

const ADMIN_API_URL = 'http://localhost:8083/admin/profile';
const ADMIN_ID = 1; // Hardcoded for simplicity; in production, get from auth context

// Load Admin Profile Section
function loadAdminProfile() {
    console.log("🔍 Attempting to load admin profile...");
    document.getElementById("adminProfile").style.display = "block";
    document.querySelector(".profile-card").style.display = "block";
    document.querySelector(".edit-section").style.display = "none";
    document.getElementById("home").style.display = "none";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "none";
    document.getElementById("expiringUsersSection").style.display = "none";
    fetchAdminProfile();
}

// Fetch Admin Profile from Backend
async function fetchAdminProfile() {
    try {
        const response = await fetch(`${ADMIN_API_URL}/${ADMIN_ID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const admin = await response.json();
        displayAdminProfile(admin);
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        showModal('Failed to load admin profile: ' + error.message);
    }
}

// Display Admin Profile Data
function displayAdminProfile(admin) {
    document.getElementById('adminName').textContent = admin.name || 'Admin';
    document.getElementById('displayAdminName').textContent = admin.name || 'Admin';
    document.getElementById('displayAdminEmail').textContent = admin.email || 'admin@mobicomm.in';
    document.getElementById('displayAdminMobile').textContent = admin.phoneNumber || '+1234567890';
    // Profile picture not stored in DB; use localStorage or extend backend if needed
    const savedProfilePic = localStorage.getItem('adminProfilePic');
    if (savedProfilePic) {
        document.getElementById('adminProfilePic').src = savedProfilePic;
        document.getElementById('editAdminProfilePic').src = savedProfilePic;
    }
}

// Toggle Edit Mode
function toggleEdit() {
    document.querySelector('.profile-card').style.display = 'none';
    document.querySelector('.edit-section').style.display = 'block';

    document.getElementById('editAdminName').value = document.getElementById('adminName').textContent;
    document.getElementById('editAdminEmail').value = document.getElementById('displayAdminEmail').textContent;
    document.getElementById('editAdminMobile').value = document.getElementById('displayAdminMobile').textContent;
    document.getElementById('editAdminPassword').value = ''; // Clear password field
}

// Save Admin Profile to Backend
async function saveAdminProfile() {
    const name = document.getElementById('editAdminName').value;
    const email = document.getElementById('editAdminEmail').value;
    const mobile = document.getElementById('editAdminMobile').value;
    const password = document.getElementById('editAdminPassword').value;

    if (!name || !email || !mobile) {
        showModal('Please fill in all required fields.');
        return;
    }

    const updatedAdmin = {
        name: name,
        email: email,
        phoneNumber: mobile,
        password: password || undefined // Only send password if provided
    };

    try {
        const response = await fetch(`${ADMIN_API_URL}/${ADMIN_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedAdmin),
            mode: 'cors'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const admin = await response.json();
        displayAdminProfile(admin);
        showModal('Profile updated successfully!');
        document.querySelector('.profile-card').style.display = 'block';
        document.querySelector('.edit-section').style.display = 'none';
    } catch (error) {
        console.error('Error saving admin profile:', error);
        showModal('Failed to update profile: ' + error.message);
    }
}

// Handle Profile Picture Upload (Still using localStorage)
document.getElementById('uploadAdminPic').addEventListener('change', function (event) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const imageData = e.target.result;
        document.getElementById('editAdminProfilePic').src = imageData;
        document.getElementById('adminProfilePic').src = imageData;
        localStorage.setItem('adminProfilePic', imageData);
    };
    reader.readAsDataURL(event.target.files[0]);
});

// Show Modal for Messages
function showModal(message) {
    document.getElementById('modalMessage').textContent = message;
    const modal = new bootstrap.Modal(document.getElementById('notificationModal'));
    modal.show();
}

// Show Section (Assuming this exists in your code)
function showSection(sectionId) {
    document.querySelectorAll('#content > div').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {

    loadAdminProfile();
});

const API_URL = 'http://localhost:8083/admin/plans';

function loadPrepaidPlans() {
    // Hide other sections and show prepaid plans
    document.querySelectorAll('#content > div').forEach(div => div.style.display = 'none');
    document.getElementById('prepaidPlans').style.display = 'block';
    fetchPlans();
}

async function fetchPlans() {
    try {
        const response = await fetch(API_URL, { mode: 'cors' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const plans = await response.json();
        const container = document.getElementById('plansContainer');
        container.innerHTML = '';

        // Group plans by category
        const plansByCategory = plans.reduce((acc, plan) => {
            if (!acc[plan.category]) {
                acc[plan.category] = [];
            }
            acc[plan.category].push(plan);
            return acc;
        }, {});

        // Render each category with its plans
        Object.keys(plansByCategory).forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.className = 'col-12 mb-4';
            categorySection.innerHTML = `
                <h3 class="category-header">${category.replace('_', ' ').replace('PLANS', 'Plans')}</h3>
                <div class="row category-plans"></div>
            `;
            container.appendChild(categorySection);

            const categoryPlansContainer = categorySection.querySelector('.category-plans');
            plansByCategory[category].forEach(plan => {
                const planCard = `
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header">${plan.name}</div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <span class="plan-info">Price:</span> ₹${plan.price}
                                </li>
                                <li class="list-group-item">
                                    <span class="plan-info">Validity:</span> ${plan.validityDays} days
                                </li>
                                <li class="list-group-item">
                                    <span class="plan-info">Data/Day:</span> ${plan.dataPerDay}
                                </li>
                                <li class="list-group-item">
                                    <div class="button-group">
                                        <button class="btn btn-primary btn-action" onclick="editPlan(${plan.id})">Edit</button>
                                        <button class="btn btn-danger btn-action" onclick="deletePlan(${plan.id})">Delete</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                `;
                categoryPlansContainer.innerHTML += planCard;
            });
        });
    } catch (error) {
        console.error('Error fetching plans:', error);
        alert('Failed to fetch plans');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Add Plan Form Submission
    document.getElementById('addPlanForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const plan = {
            name: document.getElementById('planName').value,
            price: parseFloat(document.getElementById('planPrice').value),
            validityDays: parseInt(document.getElementById('validityDays').value),
            dataPerDay: document.getElementById('dataPerDay').value,
            category: document.getElementById('category').value
        };

        try {
            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(plan),
                mode: 'cors'
            });
            if (response.ok) {
                alert(await response.text());
                fetchPlans();
                bootstrap.Modal.getInstance(document.getElementById('addPlanModal')).hide();
                document.getElementById('addPlanForm').reset();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding plan:', error);
            alert('Failed to add plan');
        }
    });

    // Edit Plan Form Submission
    document.getElementById('editPlanForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editPlanId').value;
        const updatedPlan = {
            name: document.getElementById('editPlanName').value,
            price: parseFloat(document.getElementById('editPlanPrice').value),
            validityDays: parseInt(document.getElementById('editValidityDays').value),
            dataPerDay: document.getElementById('editDataPerDay').value,
            category: document.getElementById('editCategory').value
        };

        try {
            const response = await fetch(`${API_URL}/edit/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPlan),
                mode: 'cors'
            });
            if (response.ok) {
                alert(await response.text());
                fetchPlans();
                bootstrap.Modal.getInstance(document.getElementById('editPlanModal')).hide();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error editing plan:', error);
            alert('Failed to edit plan');
        }
    });
});

async function editPlan(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const plan = await response.json();

        document.getElementById('editPlanId').value = plan.id;
        document.getElementById('editPlanName').value = plan.name;
        document.getElementById('editPlanPrice').value = plan.price;
        document.getElementById('editValidityDays').value = plan.validityDays;
        document.getElementById('editDataPerDay').value = plan.dataPerDay;
        document.getElementById('editCategory').value = plan.category;

        const modal = new bootstrap.Modal(document.getElementById('editPlanModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching plan:', error);
        alert('Failed to load plan details');
    }
}

async function deletePlan(id) {
    if (confirm('Are you sure you want to delete this plan?')) {
        try {
            const response = await fetch(`${API_URL}/delete/${id}`, {
                method: 'DELETE',
                mode: 'cors'
            });
            if (response.ok) {
                alert(await response.text());
                fetchPlans();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Failed to delete plan');
        }
    }
}
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

