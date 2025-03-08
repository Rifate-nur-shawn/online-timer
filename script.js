document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const datePicker = document.getElementById('date-picker');
    const setDateBtn = document.getElementById('set-date');
    const resetBtn = document.getElementById('reset');
    const timerStatus = document.getElementById('timer-status');
    
    // Time elements
    const yearsEl = document.getElementById('years');
    const monthsEl = document.getElementById('months');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    let countdownInterval = null;
    let targetDate = null;
    
    // Set minimum date to now for the date picker
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    
    datePicker.min = `${year}-${month}-${day}T${hour}:${minute}`;
    
    // Set default value to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tYear = tomorrow.getFullYear();
    const tMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const tDay = String(tomorrow.getDate()).padStart(2, '0');
    datePicker.value = `${tYear}-${tMonth}-${tDay}T00:00`;
    
    // Add event listeners
    setDateBtn.addEventListener('click', setCountdown);
    resetBtn.addEventListener('click', resetCountdown);
    
    // Check local storage for saved target date
    const savedDate = localStorage.getItem('targetDate');
    if (savedDate) {
        targetDate = new Date(savedDate);
        datePicker.value = formatDateForInput(targetDate);
        startCountdown();
    }
    
    function setCountdown() {
        const inputDate = datePicker.value;
        
        if (!inputDate) {
            timerStatus.textContent = "Please select a valid date and time";
            return;
        }
        
        targetDate = new Date(inputDate);
        const now = new Date();
        
        if (targetDate <= now) {
            timerStatus.textContent = "Please select a future date and time";
            return;
        }
        
        // Save target date to local storage
        localStorage.setItem('targetDate', targetDate);
        
        startCountdown();
    }
    
    function startCountdown() {
        // Clear any existing interval
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        updateCountdown(); // Update immediately
        
        // Update every second
        countdownInterval = setInterval(updateCountdown, 1000);
        
        timerStatus.textContent = `Counting down to: ${targetDate.toLocaleString()}`;
        
        // Add animation to time blocks
        animateTimeBlocks();
    }
    
    function updateCountdown() {
        const now = new Date();
        
        if (targetDate <= now) {
            clearInterval(countdownInterval);
            timerStatus.textContent = "Countdown finished!";
            resetAllDisplays('00');
            playCountdownFinishedAnimation();
            return;
        }
        
        // Calculate all time differences
        let timeDiff = Math.abs(targetDate - now) / 1000; // in seconds
        
        // Calculate years
        const yearsDiff = Math.floor(timeDiff / (86400 * 365.25));
        timeDiff -= yearsDiff * 86400 * 365.25;
        
        // Calculate months (approximation)
        const monthsDiff = Math.floor(timeDiff / (86400 * 30.44));
        timeDiff -= monthsDiff * 86400 * 30.44;
        
        // Calculate days
        const daysDiff = Math.floor(timeDiff / 86400);
        timeDiff -= daysDiff * 86400;
        
        // Calculate hours
        const hoursDiff = Math.floor(timeDiff / 3600);
        timeDiff -= hoursDiff * 3600;
        
        // Calculate minutes
        const minutesDiff = Math.floor(timeDiff / 60);
        timeDiff -= minutesDiff * 60;
        
        // Calculate seconds
        const secondsDiff = Math.floor(timeDiff);
        
        // Update the display
        yearsEl.textContent = String(yearsDiff).padStart(2, '0');
        monthsEl.textContent = String(monthsDiff).padStart(2, '0');
        daysEl.textContent = String(daysDiff).padStart(2, '0');
        hoursEl.textContent = String(hoursDiff).padStart(2, '0');
        minutesEl.textContent = String(minutesDiff).padStart(2, '0');
        secondsEl.textContent = String(secondsDiff).padStart(2, '0');
        
        // Highlight seconds since they change every tick
        secondsEl.classList.add('highlight');
        setTimeout(() => {
            secondsEl.classList.remove('highlight');
        }, 500);
    }
    
    function resetCountdown() {
        clearInterval(countdownInterval);
        countdownInterval = null;
        targetDate = null;
        localStorage.removeItem('targetDate');
        
        resetAllDisplays('00');
        timerStatus.textContent = "Set a date to start counting down";
        
        // Clear the date picker
        datePicker.value = "";
    }
    
    function resetAllDisplays(value) {
        yearsEl.textContent = value;
        monthsEl.textContent = value;
        daysEl.textContent = value;
        hoursEl.textContent = value;
        minutesEl.textContent = value;
        secondsEl.textContent = value;
    }
    
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    function animateTimeBlocks() {
        const timeBlocks = document.querySelectorAll('.time-block');
        timeBlocks.forEach((block, index) => {
            block.style.animation = `fadeInUp 0.4s ease-out ${index * 0.1}s forwards`;
        });
    }
    
    function playCountdownFinishedAnimation() {
        const container = document.querySelector('.container');
        container.classList.add('countdown-finished');
        
        // Add confetti effect when countdown finishes
        createConfetti();
    }
    
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);
        
        const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
        
        // Create 100 pieces of confetti
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 5 + 's';
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 8000);
    }
    
    // Add this to the CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .highlight {
            color: var(--accent-color) !important;
            transform: scale(1.1);
            transition: all 0.3s ease;
        }
        
        .countdown-finished {
            animation: pulse 1.5s infinite alternate;
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 0 10px rgba(0, 230, 255, 0.5);
            }
            100% {
                box-shadow: 0 0 30px rgba(0, 230, 255, 0.8), 0 0 60px rgba(74, 0, 224, 0.5);
            }
        }
        
        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
        }
        
        .confetti {
            position: absolute;
            top: -10px;
            width: 10px;
            height: 10px;
            opacity: 0.7;
            animation: confettiFall linear forwards;
        }
        
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0.7;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
