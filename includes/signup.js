function togglePassword() {
    const password = document.getElementById('password');
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    
    const icon = event.currentTarget.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}
function toggleConfirmPassword() {
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const icon = event.currentTarget.querySelector('i');
    
    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        confirmPasswordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function handleSubmit(event) {
    event.preventDefault();

    // Get password fields for validation
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Passwords do not match',
            text: 'Please make sure your passwords match',
            confirmButtonColor: '#16a34a'
        });
        return;
    }
    
    // Get form data
    const formData = new FormData(event.target);
    const firstName = formData.get('firstName');
    const middleName = formData.get('middleName');
    const lastName = formData.get('lastName');
    const studentNumber = formData.get('studentNumber');
    const email = formData.get('email');
    const terms = formData.get('terms');

    // Validate required fields
    if (!firstName || !lastName || !studentNumber) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Information',
            text: 'Please fill in all required fields',
            confirmButtonColor: '#16a34a'
        });
        return;
    }

    // Validate student number format
    const studentNumberPattern = /^\d{4}-\d{5}$/;
    if (!studentNumberPattern.test(studentNumber)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Student Number',
            text: 'Please use the format: YYYY-XXXXX (e.g., 2023-00001)',
            confirmButtonColor: '#16a34a'
        });
        return;
    }

    // Validate terms acceptance
    if (!terms) {
        Swal.fire({
            icon: 'warning',
            title: 'Please Accept Terms',
            text: 'You must agree to the Terms of Service and Privacy Policy',
            confirmButtonColor: '#16a34a'
        });
        return;
    }

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <i class="fas fa-circle-notch fa-spin mr-2"></i>
        Creating Account...
    `;

    // Simulate API call (replace with actual registration logic)
    setTimeout(() => {
        if (email.includes('@')) { // Basic validation - replace with proper validation
            const fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
            
            Swal.fire({
                icon: 'success',
                title: `Welcome ${firstName}!`,
                text: 'Your account has been created successfully.',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                // Redirect to login page
                window.location.href = 'login.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: 'Please check your email address and try again.',
                confirmButtonColor: '#16a34a'
            });
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }, 1500);
}