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


// function loadUserManagement() {
//     document.getElementById("home").style.display = "none";
//     document.getElementById("prepaidPlans").style.display = "none";
//     document.getElementById("userManagement").style.display = "block";
//     document.getElementById("kycDetails").style.display = "none";
//     document.getElementById("admin-kyc").style.display = "none";
//     document.getElementById("adminProfile").style.display = "none";
//     document.getElementById("expiringUsersSection").style.display = "none";
//     fetchUsers(0);

// }
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

// Utility functions for authentication using sessionStorage
function getAdminToken() {
    return sessionStorage.getItem("adminToken");
}

function isAdminLoggedIn() {
    return !!sessionStorage.getItem("adminToken");
}

function adminLogout() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    window.location.href = "adminLogin.html";
}

async function makeAuthenticatedRequest(url, method = "GET", data = null) {


    try {
        const headers = {
            "Content-Type": "application/json",

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
                adminLogout();
                throw new Error("Session expired. Please login again.");
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
        throw error;
    }
}

// Show Toast Notification (Replaced showModal with showToast for consistency)
function showToast(message, title = 'Notification', type = 'info') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.classList.add('toast-container', 'position-fixed', 'top-0', 'end-0', 'p-3');
        document.body.appendChild(toastContainer);
    }

    const toastHTML = `
        <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : 'info'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;

    const toastElement = document.createElement('div');
    toastElement.innerHTML = toastHTML;
    toastContainer.appendChild(toastElement.firstChild);

    const toast = new bootstrap.Toast(toastElement.firstChild);
    toast.show();

    setTimeout(() => {
        toastElement.remove();
    }, 3000);
}

// Show Section
function showSection(sectionId) {
    document.querySelectorAll('#content > div').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[onclick="load${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}()"]`);
    if (activeLink) activeLink.classList.add('active');
}

// User Management
async function fetchUsers(page = 0, size = 5) {
    const tableBody = document.getElementById('userTable');
    tableBody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    try {
        const data = await makeAuthenticatedRequest(`${USER_API_URL}?page=${page}&size=${size}`);
        renderUsers(data.content);
        renderPagination(data.totalPages, page);
    } catch (error) {
        console.error('Error fetching users:', error);
        showToast('Failed to fetch users: ' + error.message, 'Error', 'danger');
        tableBody.innerHTML = '<tr><td colspan="6">Error loading users.</td></tr>';
    }
}

function renderUsers(users) {
    const tableBody = document.getElementById('userTable');
    tableBody.innerHTML = '';
    if (!users || users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">No users found.</td></tr>';
        return;
    }
    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.mobileNumber}</td>
                <td>${user.customerName || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.startDate || 'N/A'}</td>
                <td>${user.endDate || 'N/A'}</td>
                <td>${user.daysRemaining !== null ? user.daysRemaining : 'N/A'}</td>
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

    const tableBody = document.getElementById('userTable');
    tableBody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

    try {
        let url = USER_API_URL;
        if (name.length > 2) {
            url = `${USER_API_URL}/search?name=${encodeURIComponent(name)}`;
        } else if (startDate && endDate) {
            url = `${USER_API_URL}/search-by-date?startDate=${startDate}&endDate=${endDate}`;
        } else {
            fetchUsers(); // Default to fetching all users if no filters
            return;
        }
        const users = await makeAuthenticatedRequest(url);
        renderUsers(users); // The response is a list, not a page
        document.getElementById('pagination').innerHTML = ''; // Clear pagination for filtered results
    } catch (error) {
        console.error('Error filtering users:', error);
        showToast('Failed to filter users: ' + error.message, 'Error', 'danger');
        tableBody.innerHTML = '<tr><td colspan="6">Error filtering users.</td></tr>';
    }
}

async function loadExpiringUsers() {
    showSection('expiringUsersSection');
    const tbody = document.getElementById('expiringUsersTableBody');
    tbody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
    try {
        const users = await makeAuthenticatedRequest(`${USER_API_URL}/expiring-users`);
        tbody.innerHTML = '';
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No users expiring in the next 3 days.</td></tr>';
        } else {
            users.forEach(user => {
                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.customerName || 'N/A'}</td>
                        <td>${user.mobileNumber}</td>
                        <td>${user.email || 'N/A'}</td>
                        <td>${user.endDate || 'N/A'}</td>
                        <td>${user.daysRemaining !== null ? user.daysRemaining : 'N/A'}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="notifyUser(${user.id})">Notify</button>
                        </td>
                    </tr>`;
                tbody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error('Error fetching expiring users:', error);
        showToast('Failed to fetch expiring users: ' + error.message, 'Error', 'danger');
        tbody.innerHTML = '<tr><td colspan="7">Error loading expiring users.</td></tr>';
    }
}

async function notifyUser(userId) {
    const button = document.querySelector(`[onclick="notifyUser(${userId})"]`);
    button.textContent = "Notifying...";
    button.disabled = true;
    try {
        const result = await makeAuthenticatedRequest(`${USER_API_URL}/notify-user/${userId}`, 'POST');
        button.textContent = "✅ Notified";
        button.classList.remove("btn-warning");
        button.classList.add("btn-success");
        showToast(result || 'User notified successfully!', 'Success', 'success');
    } catch (error) {
        console.error("Error notifying user:", error);
        showToast("Failed to notify user: " + error.message, 'Error', 'danger');
        button.textContent = "Notify";
        button.disabled = false;
    }
}

async function notifyAllExpiringUsers() {
    const notifyAllButton = document.querySelector('button[onclick="notifyAllExpiringUsers()"]');
    notifyAllButton.textContent = "Notifying All...";
    notifyAllButton.disabled = true;
    try {
        const users = await makeAuthenticatedRequest(`${USER_API_URL}/notify-expiring-users`, 'GET');
        if (!users || users.length === 0) {
            showToast('No users to notify.', 'Info', 'info');
            notifyAllButton.textContent = "Notify All";
            notifyAllButton.disabled = false;
            return;
        }
        // Update all "Notify" buttons to "Notified"
        users.forEach(user => {
            const button = document.querySelector(`[onclick="notifyUser(${user.id})"]`);
            if (button) {
                button.textContent = "✅ Notified";
                button.disabled = true;
                button.classList.remove("btn-warning");
                button.classList.add("btn-success");
            }
        });
        showToast('All expiring users have been notified successfully!', 'Success', 'success');
        notifyAllButton.textContent = "Notify All";
        notifyAllButton.disabled = false;
    } catch (error) {
        console.error('Error notifying all expiring users:', error);
        showToast('Failed to notify all expiring users: ' + error.message, 'Error', 'danger');
        notifyAllButton.textContent = "Notify All";
        notifyAllButton.disabled = false;
    }
}

// Navigation Functions
function loadUserManagement() {
    document.getElementById("home").style.display = "none";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("kycDetails").style.display = "none";

    showSection('userManagement');
    fetchUsers();
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
});


//kyc
const KYC_API_URL = 'http://localhost:8083/admin/kyc';

// Utility functions for authentication using sessionStorage
function getAdminCredentials() {
    const username = sessionStorage.getItem("adminUsername");
    const password = sessionStorage.getItem("adminPassword");
    return { username, password };
}

function isAdminLoggedIn() {
    const credentials = getAdminCredentials();
    return !!(credentials.username && credentials.password);
}

function adminLogout() {
    sessionStorage.removeItem("adminUsername");
    sessionStorage.removeItem("adminPassword");
    window.location.href = "adminLogin.html";
}

async function makeAuthenticatedRequest(url, method = "GET", data = null) {
    const credentials = getAdminCredentials();

    if (!isAdminLoggedIn()) {
        showModal("Please login first");
        setTimeout(() => window.location.href = "adminLogin.html", 1000);
        return;
    }

    try {
        // Encode credentials for Basic Auth
        const authHeader = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": authHeader
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
                adminLogout();
                throw new Error("Session expired. Please login again.");
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        return await response.text();

    } catch (error) {
        console.error(`Error in ${method} ${url}:`, error);
        throw error;
    }
}

// Show Section
function showSection(sectionId) {
    document.querySelectorAll('#content > div').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[onclick="load${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}()"]`);
    if (activeLink) activeLink.classList.add('active');
}

// KYC Management
async function loadKYCRequests() {
    try {
        const kycRequests = await makeAuthenticatedRequest(KYC_API_URL);
        renderKYCRequests(kycRequests);
    } catch (error) {
        console.error('Error fetching KYC requests:', error);
        document.getElementById('kycTable').innerHTML = `<tr><td colspan="5">Error loading KYC requests: ${error.message}</td></tr>`;
    }
}

async function loadPendingKYCRequests() {
    try {
        const kycRequests = await makeAuthenticatedRequest(`${KYC_API_URL}/pending`);
        renderKYCRequests(kycRequests);
    } catch (error) {
        console.error('Error fetching pending KYC requests:', error);
        document.getElementById('kycTable').innerHTML = `<tr><td colspan="5">Error loading pending KYC requests: ${error.message}</td></tr>`;
    }
}

function renderKYCRequests(kycRequests) {
    const kycTable = document.getElementById('kycTable');
    kycTable.innerHTML = '';

    if (!kycRequests || kycRequests.length === 0) {
        kycTable.innerHTML = '<tr><td colspan="5">No KYC requests found.</td></tr>';
        return;
    }

    kycRequests.forEach(request => {
        const isPending = request.status.toLowerCase() === 'pending';
        const row = `
            <tr>
                <td>${request.mobileNumber}</td>
                <td>${request.customerName}</td>
                <td><img src="${request.aadharDocument}" alt="Aadhaar Document" style="max-width: 100px; max-height: 100px;" /></td>
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
        // Fetch the KYC request to get the email
        const kycRequests = await makeAuthenticatedRequest(KYC_API_URL);
        const kycRequest = kycRequests.find(req => req.id === id);
        if (!kycRequest) {
            showModal("KYC request not found!");
            return;
        }

        // Since email is now mandatory, this check is for safety
        if (!kycRequest.email || kycRequest.email.trim() === "") {
            showModal("KYC request approved, but no email provided for notification!");
        }

        const result = await makeAuthenticatedRequest(`${KYC_API_URL}/approve/${id}`, 'PUT');
        let message = result.message || 'KYC request approved successfully!';
        if (kycRequest.email) {
            message += `\nNotification email sent to: ${kycRequest.email}`;
        }
        showModal(message);
        loadKYCRequests(); // Refresh table
    } catch (error) {
        console.error('Error approving KYC:', error);
        showModal('Failed to approve KYC: ' + error.message);
    }
}

async function rejectKYC(id) {
    try {
        // Fetch the KYC request to get the email
        const kycRequests = await makeAuthenticatedRequest(KYC_API_URL);
        const kycRequest = kycRequests.find(req => req.id === id);
        if (!kycRequest) {
            showModal("KYC request not found!");
            return;
        }

        // Since email is now mandatory, this check is for safety
        if (!kycRequest.email || kycRequest.email.trim() === "") {
            showModal("KYC request rejected, but no email provided for notification!");
        }

        const result = await makeAuthenticatedRequest(`${KYC_API_URL}/reject/${id}`, 'PUT');
        let message = result.message || 'KYC request rejected successfully!';
        if (kycRequest.email) {
            message += `\nNotification email sent to: ${kycRequest.email}`;
        }
        showModal(message);
        loadKYCRequests(); // Refresh table
    } catch (error) {
        console.error('Error rejecting KYC:', error);
        showModal('Failed to reject KYC: ' + error.message);
    }
}

async function clearKYCData() {
    if (!confirm('Are you sure you want to clear all KYC data? This action cannot be undone.')) return;

    try {
        const kycRequests = await makeAuthenticatedRequest(KYC_API_URL);
        if (!kycRequests || kycRequests.length === 0) {
            showModal('No KYC requests to clear.');
            return;
        }

        for (const request of kycRequests) {
            await makeAuthenticatedRequest(`${KYC_API_URL}/clear/${request.id}`, 'DELETE');
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
    const modalElement = document.getElementById('notificationModal');
    document.getElementById('modalMessage').textContent = message;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    modalElement.setAttribute('aria-hidden', 'false');
    modalElement.addEventListener('hidden.bs.modal', () => {
        modalElement.setAttribute('aria-hidden', 'true');
    }, { once: true });
}

// Navigation Function
function loadKYC() {
    if (!isAdminLoggedIn()) {
        adminLogout();
        return;
    }
    showSection('kycDetails');
    document.getElementById('prepaidPlans').style.display = 'none';
    document.getElementById("adminProfile").style.display = "none";
    document.querySelector(".profile-card").style.display = "none";
    document.querySelector(".edit-section").style.display = "none";
    document.getElementById("home").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "block";
    document.getElementById("expiringUsersSection").style.display = "none";
    loadKYCRequests();
}

// Initial Load
document.addEventListener('DOMContentLoaded', function () {
    if (!isAdminLoggedIn()) {
        adminLogout();
        return;
    }
    showSection('home'); // Default to home section
});

// Optional window.onload for initial visibility (if needed)
window.onload = function () {
    if (!isAdminLoggedIn()) {
        adminLogout();
        return;
    }
    document.getElementById("home").style.display = "block";
    document.getElementById("prepaidPlans").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "none";
    document.getElementById("adminProfile").style.display = "none";
    document.getElementById("expiringUsersSection").style.display = "none";
};

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



//admin Profile

const ADMIN_API_URL = 'http://localhost:8083/admin/profile';
const ADMIN_ID = 1;

// Utility functions for authentication using sessionStorage
function getAdminToken() {
    return sessionStorage.getItem("adminToken");
}

function isAdminLoggedIn() {
    return !!sessionStorage.getItem("adminToken");
}

function adminLogout() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    sessionStorage.removeItem("adminProfilePic"); // Clear profile pic on logout
    window.location.href = "adminLogin.html";
}

async function makeAuthenticatedRequest(url, method = "GET", data = null) {
    const token = getAdminToken();

    if (!token) {
        showModal("Please login first");
        setTimeout(() => window.location.href = "adminLogin.html", 1000);
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
                adminLogout();
                throw new Error("Session expired. Please login again.");
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
        throw error;
    }
}

// Load Admin Profile Section
function loadAdminProfile() {
    if (!isAdminLoggedIn()) {
        adminLogout();
        return;
    }
    console.log("🔍 Attempting to load admin profile...");
    document.querySelectorAll('#content > div').forEach(section => {
        section.style.display = 'none';
    });
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
        const admin = await makeAuthenticatedRequest(`${ADMIN_API_URL}/${ADMIN_ID}`);
        console.log("Fetched admin data:", admin);
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
    const savedProfilePic = sessionStorage.getItem('adminProfilePic');
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
    document.getElementById('editAdminPassword').value = '';
}

// Save Admin Profile to Backend
async function saveAdminProfile() {
    const name = document.getElementById('editAdminName').value.trim();
    const email = document.getElementById('editAdminEmail').value.trim();
    const phoneNumber = document.getElementById('editAdminMobile').value.trim();
    const password = document.getElementById('editAdminPassword').value.trim();

    if (!name || !email || !phoneNumber) {
        showModal('Please fill in all required fields.');
        return;
    }

    const updatedAdmin = {
        name,
        email,
        phoneNumber,
        ...(password && { password }) // Only include password if provided
    };

    try {
        const admin = await makeAuthenticatedRequest(`${ADMIN_API_URL}/${ADMIN_ID}`, 'PUT', updatedAdmin);
        displayAdminProfile(admin);
        showModal('Profile updated successfully!');
        document.querySelector('.profile-card').style.display = 'block';
        document.querySelector('.edit-section').style.display = 'none';
    } catch (error) {
        console.error('Error saving admin profile:', error);
        showModal('Failed to update profile: ' + error.message);
    }
}

// Handle Profile Picture Upload (SessionStorage-based)
document.getElementById('uploadAdminPic')?.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            document.getElementById('adminProfilePic').src = imageData;
            document.getElementById('editAdminProfilePic').src = imageData;
            sessionStorage.setItem('adminProfilePic', imageData); // Use sessionStorage
        };
        reader.readAsDataURL(file);
    }
});

// Show Modal for Messages
function showModal(message) {
    const modalElement = document.getElementById('notificationModal');
    document.getElementById('modalMessage').textContent = message;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    modalElement.setAttribute('aria-hidden', 'false');
    modalElement.addEventListener('hidden.bs.modal', () => {
        modalElement.setAttribute('aria-hidden', 'true');
    }, { once: true });
}

// Show Section
function showSection(sectionId) {
    document.querySelectorAll('#content > div').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Initial Load
document.addEventListener('DOMContentLoaded', function () {
    if (!isAdminLoggedIn()) {
        adminLogout();
        return;
    }
    loadAdminProfile();
});


const BASE_URL = 'http://localhost:8083/api';

// Utility functions for authentication
function getAdminToken() {
    return sessionStorage.getItem("adminToken");
}

function isAdminLoggedIn() {
    return !!sessionStorage.getItem("adminToken");
}

function adminLogout() {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUsername");
    window.location.href = "adminLogin.html";
}

async function makeAuthenticatedRequest(url, method = "GET", data = null) {
    const token = getAdminToken();

    if (!token) {
        alert("Please login first");
        setTimeout(() => window.location.href = "adminLogin.html", 1000);
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
        const rawText = await response.text();
        console.log(`Raw response from ${url}:`, rawText); // Debug raw response

        if (!response.ok) {
            if (response.status === 401) {
                adminLogout();
                throw new Error("Session expired. Please login again.");
            }
            throw new Error(rawText || `HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return JSON.parse(rawText);
        }
        return rawText;

    } catch (error) {
        console.error(`Error in ${method} ${url}:`, error);
        throw error;
    }
}

// Load prepaid plans section
function loadPrepaidPlans() {
    if (!isAdminLoggedIn()) {
        adminLogout();
        return;
    }

    document.querySelectorAll('#content > div').forEach(div => div.style.display = 'none');
    document.getElementById('prepaidPlans').style.display = 'block';


    document.getElementById("adminProfile").style.display = "none";
    document.querySelector(".profile-card").style.display = "none";
    document.querySelector(".edit-section").style.display = "none";
    document.getElementById("home").style.display = "none";
    document.getElementById("userManagement").style.display = "none";
    document.getElementById("kycDetails").style.display = "none";
    document.getElementById("expiringUsersSection").style.display = "none";
    fetchCategoriesAndPlans();
}


// Fetch Categories and Plans
async function fetchCategoriesAndPlans() {
    try {
        const categories = await makeAuthenticatedRequest(`${BASE_URL}/categories`);
        console.log('Parsed categories:', categories);
        const container = document.getElementById('categoriesContainer');
        if (!container) {
            throw new Error('categoriesContainer element not found in HTML');
        }
        container.innerHTML = '';

        if (!categories || categories.length === 0) {
            container.innerHTML = '<p>No categories available.</p>';
            return;
        }

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'mb-5';
            categoryDiv.innerHTML = `
                <div class="category-header">
                    ${category.name}
                    <button class="btn btn-danger btn-sm ms-3" onclick="deleteCategory(${category.id})">Delete</button>
                </div>
                <div class="row category-plans" id="plans-${category.id}"></div>
            `;
            container.appendChild(categoryDiv);
            fetchPlansForCategory(category.id);
        });

        populateCategoryDropdowns(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to fetch categories: ' + error.message);
    }
}

async function fetchPlansForCategory(categoryId) {
    try {
        const plans = await makeAuthenticatedRequest(`${BASE_URL}/categories/${categoryId}/plans`);
        console.log(`Plans for category ${categoryId}:`, plans);
        const plansContainer = document.getElementById(`plans-${categoryId}`);
        plansContainer.innerHTML = '';

        if (!plans || plans.length === 0) {
            plansContainer.innerHTML = '<p>No plans in this category.</p>';
            return;
        }

        plans.forEach(plan => {
            const planCard = `
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">${plan.name}</div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><span class="plan-info">Price:</span><span class="plan-value">₹${plan.price}</span></li>
                            <li class="list-group-item"><span class="plan-info">Validity:</span><span class="plan-value">${plan.validityDays} days</span></li>
                            <li class="list-group-item"><span class="plan-info">Data:</span><span class="plan-value">${plan.dataPerDay}</span></li>
                            <li class="list-group-item">
                                <div class="button-group">
                                    <button class="btn-action btn btn-primary" onclick="editPlan(${plan.id})">Edit</button>
                                    <button class="btn-action btn btn-danger" onclick="deletePlan(${plan.id})">Delete</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            `;
            plansContainer.innerHTML += planCard;
        });
    } catch (error) {
        console.error(`Error fetching plans for category ${categoryId}:`, error);
        alert('Failed to fetch plans: ' + error.message);
    }
}

function populateCategoryDropdowns(categories) {
    const addSelect = document.getElementById('planCategory');
    const editSelect = document.getElementById('editPlanCategory');
    addSelect.innerHTML = '';
    editSelect.innerHTML = '';
    categories.forEach(category => {
        const option = `<option value="${category.id}">${category.name}</option>`;
        addSelect.innerHTML += option;
        editSelect.innerHTML += option;
    });
}

// Add Category
document.getElementById('addCategoryForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('categoryName').value;
    try {
        const result = await makeAuthenticatedRequest(`${BASE_URL}/categories?name=${encodeURIComponent(name)}`, 'POST');
        alert(result);
        document.getElementById('addCategoryForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('addCategoryModal')).hide();
        fetchCategoriesAndPlans();
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Failed to add category: ' + error.message);
    }
});

// Add Plan
document.getElementById('addPlanForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const plan = {
        name: document.getElementById('planName').value,
        price: parseFloat(document.getElementById('planPrice').value),
        validityDays: parseInt(document.getElementById('validityDays').value),
        dataPerDay: document.getElementById('dataPerDay').value
    };
    const categoryId = document.getElementById('planCategory').value;

    try {
        const result = await makeAuthenticatedRequest(`${BASE_URL}/categories/${categoryId}/plans`, 'POST', plan);
        alert(result);
        document.getElementById('addPlanForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('addPlanModal')).hide();
        fetchCategoriesAndPlans();
    } catch (error) {
        console.error('Error adding plan:', error);
        alert('Failed to add plan: ' + error.message);
    }
});

// Edit Plan
async function editPlan(planId) {
    try {
        const categories = await makeAuthenticatedRequest(`${BASE_URL}/categories`);
        const plan = categories.flatMap(cat => cat.plans || []).find(p => p.id === planId);
        if (!plan) throw new Error('Plan not found');

        document.getElementById('editPlanId').value = plan.id;
        document.getElementById('editPlanName').value = plan.name;
        document.getElementById('editPlanPrice').value = plan.price;
        document.getElementById('editValidityDays').value = plan.validityDays;
        document.getElementById('editDataPerDay').value = plan.dataPerDay;
        // Since plan.category is not serialized, we need to find it from the category list
        const category = categories.find(cat => cat.plans.some(p => p.id === planId));
        document.getElementById('editPlanCategory').value = category.id;

        const modal = new bootstrap.Modal(document.getElementById('editPlanModal'), { focus: false });
        modal.show();
    } catch (error) {
        console.error('Error fetching plan:', error);
        alert('Failed to load plan details: ' + error.message);
    }
}

document.getElementById('editPlanForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const planId = document.getElementById('editPlanId').value;
    const updatedPlan = {
        name: document.getElementById('editPlanName').value,
        price: parseFloat(document.getElementById('editPlanPrice').value),
        validityDays: parseInt(document.getElementById('editValidityDays').value),
        dataPerDay: document.getElementById('editDataPerDay').value,
        category: { id: document.getElementById('editPlanCategory').value }
    };

    try {
        const result = await makeAuthenticatedRequest(`${BASE_URL}/plans/${planId}`, 'PUT', updatedPlan);
        alert(result);
        bootstrap.Modal.getInstance(document.getElementById('editPlanModal')).hide();
        fetchCategoriesAndPlans();
    } catch (error) {
        console.error('Error editing plan:', error);
        alert('Failed to edit plan: ' + error.message);
    }
});

// Delete Plan
async function deletePlan(planId) {
    if (confirm('Are you sure you want to delete this plan?')) {
        try {
            const result = await makeAuthenticatedRequest(`${BASE_URL}/plans/${planId}`, 'DELETE');
            alert(result);
            fetchCategoriesAndPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Failed to delete plan: ' + error.message);
        }
    }
}

// Delete Category
async function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category and all its plans?')) {
        try {
            const result = await makeAuthenticatedRequest(`${BASE_URL}/categories/${categoryId}`, 'DELETE');
            alert(result);
            fetchCategoriesAndPlans();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category: ' + error.message);
        }
    }
}


const adminBackendUrl = 'http://localhost:8083'; // Renamed from chart_URL

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true } }
};

// Function to redirect to login page
function redirectToLogin() {
    window.location.href = "adminLogin.html"; // Replace with your actual login page URL
}

// Variables to store chart instances (for updating data)
let activeUsersChart, popularPlanChart, newRegistrationsChart, paymentTrendsChart, adminActionsChart;

// Load Active Users Chart
async function loadActiveUsersChart() {
    try {
        const data = await makeAuthenticatedRequest(`${adminBackendUrl}/admin/dashboard/active-users`);
        const chartData = {
            labels: ['Total Users', 'Active Users'],
            datasets: [{
                label: 'Users',
                data: [data.totalUsers, data.activeUsers],
                backgroundColor: ['#0d6efd', '#20c997']
            }]
        };

        activeUsersChart = new Chart(document.getElementById('activeUsersChart'), {
            type: 'bar',
            data: chartData,
            options: chartOptions
        });
    } catch (error) {
        console.error("Error loading Active Users Chart:", error);
        showToast("Failed to load Active Users data.", "danger");
    }
}

// Load Popular Plans Chart
async function loadPopularPlansChart() {
    try {
        const data = await makeAuthenticatedRequest(`${adminBackendUrl}/admin/dashboard/popular-plans`);
        const chartData = {
            labels: ['Popular Plan', 'Validity Plan', 'Top-Up Plan', 'Data Plan'],
            datasets: [{
                label: 'Usage Percentage',
                data: [data['Popular Plan'], data['Validity Plan'], data['Top-Up Plan'], data['Data Plan']],
                backgroundColor: ['#0d6efd', '#198754', '#dc3545', '#ffc107']
            }]
        };

        popularPlanChart = new Chart(document.getElementById('popularPlanChart'), {
            type: 'bar',
            data: chartData,
            options: chartOptions
        });
    } catch (error) {
        console.error("Error loading Popular Plans Chart:", error);
        showToast("Failed to load Popular Plans data.", "danger");
    }
}

// Load New Registrations Chart
async function loadNewRegistrationsChart() {
    try {
        const data = await makeAuthenticatedRequest(`${adminBackendUrl}/admin/dashboard/new-registrations`);
        const chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Registrations',
                data: [data['Jan'], data['Feb'], data['Mar'], data['Apr'], data['May']],
                borderColor: '#fd7e14',
                backgroundColor: 'rgba(253, 126, 20, 0.2)',
                fill: true
            }]
        };

        newRegistrationsChart = new Chart(document.getElementById('newRegistrationsChart'), {
            type: 'line',
            data: chartData,
            options: chartOptions
        });
    } catch (error) {
        console.error("Error loading New Registrations Chart:", error);
        showToast("Failed to load New Registrations data.", "danger");
    }
}

// Load Payment Trends Chart
async function loadPaymentTrendsChart() {
    try {
        const data = await makeAuthenticatedRequest(`${adminBackendUrl}/admin/dashboard/payment-trends`);
        const chartData = {
            labels: ['UPI', 'Credit/Debit Card', 'Wallet'], // Updated to match backend
            datasets: [{
                data: [data['UPI'], data['Debit Card'], data['Net Banking']], // Map to backend keys
                backgroundColor: ['#0d6efd', '#dc3545', '#198754']
            }]
        };

        paymentTrendsChart = new Chart(document.getElementById('paymentTrendsChart'), {
            type: 'pie',
            data: chartData,
            options: chartOptions
        });
    } catch (error) {
        console.error("Error loading Payment Trends Chart:", error);
        showToast("Failed to load Payment Trends data.", "danger");
    }
}

// Load Admin Actions Chart
async function loadAdminActionsChart() {
    try {
        const data = await makeAuthenticatedRequest(`${adminBackendUrl}/admin/dashboard/admin-actions`);
        const chartData = {
            labels: ['KYC Approved', 'KYC Rejected', 'KYC Pending'],
            datasets: [{
                label: 'Admin Actions',
                data: [data.kycApproved, data.kycRejected, data.kycPending],
                backgroundColor: ['#198754', '#dc3545', '#fd7e14']
            }]
        };

        adminActionsChart = new Chart(document.getElementById('adminActionsChart'), {
            type: 'bar',
            data: chartData,
            options: chartOptions
        });
    } catch (error) {
        console.error("Error loading Admin Actions Chart:", error);
        showToast("Failed to load Admin Actions data.", "danger");
    }
}

// Download Report
async function downloadReport() {
    try {
        if (!isAdminLoggedIn()) {
            showToast("Please log in to download the report.", "danger");
            redirectToLogin();
            return;
        }

        const data = await makeAuthenticatedRequest(`${adminBackendUrl}/admin/dashboard/report-data`);
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("MobiComm Dashboard Report", 14, 20);
        doc.setFontSize(12);
        doc.text("This report summarizes the key performance metrics and trends.", 14, 30);

        const tableData = [
            ["Metric", "Value"],
            ["Total Users", data.totalUsers],
            ["Active Users", data.activeUsers],
            ["Popular Subscription Plan", data.popularPlan],
            ["New Registrations (May)", data.newRegistrationsMay],
            ["Top Payment Mode", data.topPaymentMode],
            ["KYC Approved", data.kycApproved]
        ];

        doc.autoTable({
            startY: 40,
            head: [tableData[0]],
            body: tableData.slice(1),
            theme: "striped",
        });

        doc.save("MobiComm_Dashboard_Report.pdf");
    } catch (error) {
        console.error("Error generating report:", error);
        showToast("Failed to generate report.", "danger");
    }
}

// Load all charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (!isAdminLoggedIn()) {
        showToast("Please log in to view the dashboard.", "danger");
        redirectToLogin();
        return;
    }

    loadActiveUsersChart();
    loadPopularPlansChart();
    loadNewRegistrationsChart();
    loadPaymentTrendsChart();
    loadAdminActionsChart();
});

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
           
            navLinks.forEach(l => l.classList.remove("active"));

            this.classList.add("active");
        });
    });
});
