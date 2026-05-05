        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('-translate-x-full');
        }

        function loadPage(pageId) {
            // Hide all sections
            document.querySelectorAll('section[id^="page-"]').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show selected section
            document.getElementById(`page-${pageId}`).classList.remove('hidden');
            
            // Update mobile header title
            document.getElementById('page-title').textContent = pageId.charAt(0).toUpperCase() + pageId.slice(1);
        }

        function approveReward(id) {
            Swal.fire({
                title: 'Approve Reward?',
                text: "This will notify the user that their reward is ready for pickup",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#16a34a',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, approve'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Approved!',
                        'The reward has been approved.',
                        'success'
                    );
                }
            });
        }

        function rejectReward(id) {
            Swal.fire({
                title: 'Reject Reward?',
                text: "The points will be returned to the user",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, reject'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Rejected!',
                        'The reward has been rejected.',
                        'success'
                    );
                }
            });
        }

        function notifyMaintenance(binId) {
            Swal.fire({
                title: 'Notify Maintenance?',
                text: "Send notification to maintenance team for bin emptying",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#16a34a',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, notify'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Notification Sent!',
                        'The maintenance team has been notified.',
                        'success'
                    );
                }
            });
        }

        function filterRewards() {
            const statusFilter = document.getElementById('statusFilter').value;
            const searchQuery = document.getElementById('searchUsers').value.toLowerCase();
            const tableBody = document.getElementById('rewardsTableBody');
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                const userName = row.getElementsByTagName('td')[1].textContent.toLowerCase();
                const statusBadge = row.querySelector('.status-badge');
                const status = statusBadge ? statusBadge.textContent.trim().toLowerCase() : '';
                
                // Fixed filter logic
                const matchesStatus = statusFilter === 'all' || status === statusFilter.toLowerCase();
                const matchesSearch = userName.includes(searchQuery);

                row.style.display = (matchesStatus && matchesSearch) ? '' : 'none';
            }
        }

        function applyFilters() {
            filterRewards();
            
            Swal.fire({
                icon: 'success',
                title: 'Filters Applied',
                text: 'The rewards list has been filtered according to your criteria.',
                showConfirmButton: false,
                timer: 1500
            });
        }

        function searchUsers() {
            const searchQuery = document.getElementById('userSearch').value.toLowerCase();
            const tableBody = document.getElementById('usersTableBody');
            const rows = tableBody.getElementsByTagName('tr');

            for (let row of rows) {
                const name = row.getElementsByTagName('td')[0].textContent.toLowerCase();
                const email = row.getElementsByTagName('td')[1].textContent.toLowerCase();
                
                if (name.includes(searchQuery) || email.includes(searchQuery)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        }

        // `editUser` and `deleteUser` are implemented in the page's module script
        // so they can access Firebase directly. Keeping this file focused on UI helpers.

function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    menu.classList.toggle('hidden');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('profileMenu');
    const profileButton = event.target.closest('button');
    
    if (!profileButton && !menu.contains(event.target)) {
        menu.classList.add('hidden');
    }
});

function editProfile() {
    Swal.fire({
        title: 'Edit Profile',
        html: `
            <form id="editProfileForm" class="space-y-4">
                <div class="text-left">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" id="adminName" value="Admin" 
                            class="w-full px-3 py-2 border rounded-lg">
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#6b7280',
        preConfirm: () => {
            return true;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

function openSettings() {
    Swal.fire({
        title: 'Account Settings',
        html: `
            <div class="space-y-4">
                <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div class="text-left">
                        <h3 class="font-medium">Email Notifications</h3>
                        <p class="text-sm text-gray-500">Receive system notifications</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full 
                                    peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 
                                    after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 
                                    after:transition-all"></div>
                    </label>
                </div>
            </div>
        `,
        confirmButtonText: 'Save Settings',
        confirmButtonColor: '#16a34a',
    });
}

function handleLogout() {
    Swal.fire({
        title: 'Logout Confirmation',
        text: "Are you sure you want to logout?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, logout'
    }).then((result) => {
        if (result.isConfirmed) {
            // Toast notification
            Swal.fire({
                icon: 'success',
                title: 'Logged Out ✓',
                html: '<p style="white-space: pre-wrap; text-align: left;">You have been successfully logged out.</p>',
                position: "top-end",
                toast: true,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: '#dcfce7'
            }).then(() => {
                window.location.href = 'admin_login.html';
            });
        }
    });
}

function showAddBinModal() {
    Swal.fire({
        title: 'Add New Bin',
        html: `
            <form id="addBinForm" class="space-y-4">
                <div class="text-left">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Control Number</label>
                    <input type="text" id="binControlNo" 
                            value="BIN-${String(getNextBinNumber()).padStart(3, '0')}"
                            class="w-full px-3 py-2 border rounded-lg" readonly>
                </div>
                <div class="text-left">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" id="binLocation" 
                            class="w-full px-3 py-2 border rounded-lg" required>
                </div>
                <div class="text-left">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="binStatus" class="w-full px-3 py-2 border rounded-lg">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add Bin',
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#6b7280',
        preConfirm: () => {
            const location = document.getElementById('binLocation').value;
            if (!location) {
                Swal.showValidationMessage('Please enter a location');
                return false;
            }
            return {
                controlNo: document.getElementById('binControlNo').value,
                location: location,
                status: document.getElementById('binStatus').value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            addNewBin(result.value);
        }
    });
}

function toggleBinStatus(binId) {
    Swal.fire({
        title: 'Change Bin Status?',
        text: "Are you sure you want to toggle this bin's status?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, change it'
    }).then((result) => {
        if (result.isConfirmed) {
            // Implementation for toggling status
            Swal.fire({
                icon: 'success',
                title: 'Status Updated',
                text: 'The bin status has been updated successfully.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

function editBin(binId) {
    Swal.fire({
        title: 'Edit Bin',
        html: `
            <form id="editBinForm" class="space-y-4">
                <div class="text-left">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Control Number</label>
                    <input type="text" value="${binId}" 
                            class="w-full px-3 py-2 border rounded-lg bg-gray-100" readonly>
                </div>
                <div class="text-left">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" id="editBinLocation" 
                            value="Main Building"
                            class="w-full px-3 py-2 border rounded-lg" required>
                </div>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#6b7280'
    });
}

function deleteBin(binId) {
    Swal.fire({
        title: 'Delete Bin?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The bin has been deleted.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

function getNextBinNumber() {
    // Implementation to get next available bin number
    return document.querySelectorAll('.bin-card').length + 1;
}

function addNewBin(binData) {
    // Implementation to add new bin to the grid
    Swal.fire({
        icon: 'success',
        title: 'Bin Added!',
        text: 'New bin has been added successfully.',
        showConfirmButton: false,
        timer: 1500
    });
}