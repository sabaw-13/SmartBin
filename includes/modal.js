let timerInterval;

function openBinModal() {
    document.getElementById('binModal').classList.remove('hidden');
}

function closeBinModal() {
    document.getElementById('binModal').classList.add('hidden');
    document.getElementById('binId').value = '';
}

function closeTimerModal() {
    document.getElementById('timerModal').classList.add('hidden');
    clearInterval(timerInterval);
}

function startTimer() {
    const binId = document.getElementById('binId').value;
    if (!binId) {
        alert('Please enter a Bin ID');
        return;
    }

    document.getElementById('binModal').classList.add('hidden');
    document.getElementById('timerModal').classList.remove('hidden');
    document.getElementById('displayBinId').textContent = binId;

    let timeLeft = 60;
    updateTimerDisplay(timeLeft);

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            closeTimerModal(); // Close the modal
            // Show a message when time is up
            alert('Time is up! Please try again.');
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    startTimer();
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}