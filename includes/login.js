function togglePassword() {
    const password = document.getElementById('password');
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    
    const icon = event.currentTarget.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
}

function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember') === 'on';

    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <i class="fas fa-circle-notch fa-spin mr-2"></i>
        Signing in...
    `;

    setTimeout(() => {
        if (email === "omsim@gmail.com" && password === "password123") {
            Swal.fire({
                icon: 'success',
                title: 'Welcome back!',
                text: 'Login successful. Redirecting...',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                // Redirect to dashboard
                window.location.href = 'index_loggedin.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid email or password. Please try again.',
                confirmButtonColor: '#16a34a'
            });
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }, 1500);
}