function toggleProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        // Add animation classes
        modal.classList.add('animate-fade-in');
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('animate-fade-in');
    }
}

function handleLogout() {
    Swal.fire({
        title: 'Are you sure you want to logout?',
        text: "You will be redirected to the login page",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        customClass: {
            popup: 'animate__animated animate__fadeInDown'
        }
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
                background: '#dcfce7',
                willClose: () => {
                    window.location.href = 'login.html';
                }
            });
        }
    });
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('profileModal');
    const profileButton = event.target.closest('[onclick="toggleProfileModal()"]');
    const modalContent = event.target.closest('#profileModal > div:last-child');
    
    if (!modal.classList.contains('hidden') && !profileButton && !modalContent) {
        modal.classList.add('hidden');
    }
});