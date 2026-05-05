function checkRedeemAvailability() {
    const userPoints = 124; // Get this from your actual user data
    const redeemButtons = document.querySelectorAll('.redeem-button');
    
    redeemButtons.forEach(button => {
        const requiredPoints = parseInt(button.getAttribute('data-points'));
        
        if (userPoints < requiredPoints) {
            button.disabled = true;
            button.classList.remove('bg-green-600', 'hover:bg-green-700');
            button.classList.add('bg-gray-400', 'cursor-not-allowed');
            button.title = `You need ${requiredPoints - userPoints} more points`;
        } else {
            button.disabled = false;
            button.classList.remove('bg-gray-400', 'cursor-not-allowed');
            button.classList.add('bg-green-600', 'hover:bg-green-700');
            button.title = 'Click to redeem';
        }
    });
}

function handleRedeem(points, rewardName) {
    if (points > 124) { // Compare with actual user points
        Swal.fire({
            icon: 'error',
            title: 'Not Enough Points',
            text: `You need ${points - 124} more points to redeem this reward.`,
            confirmButtonColor: '#16a34a'
        });
        return;
    }

    Swal.fire({
        title: 'Confirm Redemption',
        text: `Are you sure you want to redeem ${rewardName} for ${points} points?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, redeem it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Redeemed!',
                text: 'Your reward has been successfully redeemed.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}