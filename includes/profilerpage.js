function changeProfilePicture() {
    // Simulate file input click
    Swal.fire({
        title: 'Change Profile Picture',
        text: 'This feature will be available soon!',
        icon: 'info',
        confirmButtonColor: '#16a34a'
    });
}

function handleProfileUpdate(event) {
    event.preventDefault();
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <i class="fas fa-circle-notch fa-spin mr-2"></i>
        Saving...
    `;

    // Simulate API call
    setTimeout(() => {
        Swal.fire({
            icon: 'success',
            title: 'Profile Updated!',
            text: 'Your changes have been saved successfully.',
            showConfirmButton: false,
            timer: 1500
        });
        
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }, 1500);
}

function resetForm() {
    Swal.fire({
        title: 'Reset Changes?',
        text: 'This will revert any unsaved changes.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#dc2626',
        confirmButtonText: 'Yes, reset'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });
}