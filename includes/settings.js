function showTab(tabName) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.remove('hidden');
    
    // Update tab button styles
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('border-b-2', 'border-green-600', 'text-gray-900');
        button.classList.add('text-gray-500');
    });
    
    // Highlight active tab
    event.currentTarget.classList.remove('text-gray-500');
    event.currentTarget.classList.add('border-b-2', 'border-green-600', 'text-gray-900');
}

function handlePasswordChange(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <i class="fas fa-circle-notch fa-spin mr-2"></i>
        Updating...
    `;

    // Simulate API call
    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: 'Password Updated!',
            text: 'Your password has been changed successfully.',
            showConfirmButton: false,
            timer: 1500
        });
        
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        event.target.reset();
    }, 1500);
}

function handleDeleteAccount() {
    Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete account'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Account Deleted',
                text: 'Your account has been successfully deleted.',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = 'index.html';
            });
        }
    });
}