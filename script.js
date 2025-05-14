let startBtn = document.getElementById('start');
let pauseBtn = document.getElementById('pause');
let resetBtn = document.getElementById('reset');
let lapBtn = document.getElementById('lap');
let lapsList = document.getElementById('laps');

// Audio elements
let tickSound = document.getElementById('tickSound');
let buttonSound = document.getElementById('buttonSound');
let lapSound = document.getElementById('lapSound');

// Time variables
let hour = 0;
let minute = 0;
let second = 0;
let count = 0;
let timer = false;
let paused = false;
let lapCount = 0;
let intervalId;
let lastSecond = 0;

// Create particles
createParticles();

// Add event listeners
startBtn.addEventListener('click', function () {
    playButtonSound();
    if (!timer) {
        timer = true;
        paused = false;
        startBtn.classList.add('active-btn');
        pauseBtn.classList.remove('active-btn');
        animateDigits();
        stopWatch();
    }
});

pauseBtn.addEventListener('click', function () {
    playButtonSound();
    if (timer) {
        timer = false;
        paused = true;
        pauseBtn.classList.add('active-btn');
        startBtn.classList.remove('active-btn');
        clearInterval(intervalId);
    } else if (paused) {
        timer = true;
        paused = false;
        pauseBtn.classList.remove('active-btn');
        startBtn.classList.add('active-btn');
        stopWatch();
    }
});

resetBtn.addEventListener('click', function () {
    playButtonSound();
    resetStopwatch();
});

lapBtn.addEventListener('click', function () {
    if (timer || (hour > 0 || minute > 0 || second > 0 || count > 0)) {
        playLapSound();
        recordLap();
    }
});

// Play tick sound
function playTickSound() {
    if (tickSound.paused) {
        tickSound.volume = 0.3;
        tickSound.play();
    } else {
        tickSound.currentTime = 0;
    }
}

// Play button sound
function playButtonSound() {
    if (buttonSound.paused) {
        buttonSound.volume = 0.5;
        buttonSound.play();
    } else {
        buttonSound.currentTime = 0;
    }
}

// Play lap sound
function playLapSound() {
    if (lapSound.paused) {
        lapSound.volume = 0.5;
        lapSound.play();
    } else {
        lapSound.currentTime = 0;
    }
}

// Main stopwatch function
function stopWatch() {
    if (timer) {
        count++;
        
        // Play tick sound when seconds change
        if (second !== lastSecond && (count === 0 || count === 50)) {
            playTickSound();
            lastSecond = second;
        }
        
        if (count == 100) {
            second++;
            count = 0;
            playTickSound();
            lastSecond = second;
        }
        
        if (second == 60) {
            minute++;
            second = 0;
        }
        
        if (minute == 60) {
            hour++;
            minute = 0;
            second = 0;
        }
        
        updateDisplay();
        intervalId = setTimeout(stopWatch, 10);
    }
}

// Format numbers to display with leading zeros
function formatNumber(num) {
    return num < 10 ? "0" + num : num;
}

// Update the display
function updateDisplay() {
    document.getElementById('hr').innerHTML = formatNumber(hour);
    document.getElementById('min').innerHTML = formatNumber(minute);
    document.getElementById('sec').innerHTML = formatNumber(second);
    document.getElementById('count').innerHTML = formatNumber(count);
}

// Reset the stopwatch
function resetStopwatch() {
    timer = false;
    paused = false;
    hour = 0;
    minute = 0;
    second = 0;
    count = 0;
    clearInterval(intervalId);
    updateDisplay();
    startBtn.classList.remove('active-btn');
    pauseBtn.classList.remove('active-btn');
    
    // Clear laps
    lapsList.innerHTML = '';
    lapCount = 0;
}

// Record a lap
function recordLap() {
    lapCount++;
    let lapTime = `${formatNumber(hour)}:${formatNumber(minute)}:${formatNumber(second)}.${formatNumber(count)}`;
    
    const li = document.createElement('li');
    li.innerHTML = `<span>Lap ${lapCount}</span><span>${lapTime}</span>`;
    
    // Insert at the beginning of the list
    lapsList.insertBefore(li, lapsList.firstChild);
    
    // Flash effect for the lap animation
    li.style.animation = 'fadeIn 0.5s ease-in-out';
}

// Create particle animation in the background
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(156, 39, 176, ' + (Math.random() * 0.5 + 0.1) + ')';
        particle.style.borderRadius = '50%';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.boxShadow = '0 0 10px rgba(156, 39, 176, 0.8)';
        
        // Animation
        const duration = Math.random() * 60 + 30;
        particle.style.animation = `float ${duration}s linear infinite`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Add keyframe animation
        const style = document.createElement('style');
        const randomX = Math.random() * 100 - 50;
        const randomY = Math.random() * 100 - 50;
        
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translate(0, 0) rotate(0);
                    opacity: ${Math.random() * 0.5 + 0.1};
                }
                50% {
                    transform: translate(${randomX}px, ${randomY}px) rotate(180deg);
                    opacity: ${Math.random() * 0.5 + 0.5};
                }
                100% {
                    transform: translate(0, 0) rotate(360deg);
                    opacity: ${Math.random() * 0.5 + 0.1};
                }
            }
        `;
        
        document.head.appendChild(style);
        particlesContainer.appendChild(particle);
    }
}

// Animate digits when running
function animateDigits() {
    const digits = document.querySelectorAll('.digit');
    digits.forEach(digit => {
        if (timer) {
            digit.style.animation = 'pulse 1s infinite alternate';
            digit.style.textShadow = '0 0 15px rgba(156, 39, 176, 1)';
        } else {
            digit.style.animation = 'none';
            digit.style.textShadow = '0 0 15px rgba(156, 39, 176, 0.8)';
        }
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        if (timer) {
            pauseBtn.click();
        } else {
            startBtn.click();
        }
        e.preventDefault();
    } else if (e.code === 'KeyR') {
        resetBtn.click();
        e.preventDefault();
    } else if (e.code === 'KeyL') {
        lapBtn.click();
        e.preventDefault();
    }
});

// Save stopwatch state before page unload
window.addEventListener('beforeunload', function() {
    if (timer || paused || (hour > 0 || minute > 0 || second > 0 || count > 0)) {
        const state = {
            hour,
            minute,
            second,
            count,
            timer,
            paused,
            laps: lapsList.innerHTML,
            lapCount
        };
        localStorage.setItem('stopwatchState', JSON.stringify(state));
    } else {
        localStorage.removeItem('stopwatchState');
    }
});

// Restore stopwatch state on page load
window.addEventListener('load', function() {
    const savedState = localStorage.getItem('stopwatchState');
    if (savedState) {
        const state = JSON.parse(savedState);
        hour = state.hour;
        minute = state.minute;
        second = state.second;
        count = state.count;
        lapCount = state.lapCount;
        paused = state.paused;
        lapsList.innerHTML = state.laps;
        
        updateDisplay();
        
        if (state.timer) {
            startBtn.click();
        } else if (state.paused) {
            pauseBtn.classList.add('active-btn');
        }
    }
    
    // Set up audio context and load sounds when user interacts
    document.body.addEventListener('click', function() {
        // You would replace these with actual sound file URLs in production
        tickSound.src = "https://cdn.freesound.org/previews/536/536782_12131501-lq.mp3"; // Tick sound
        buttonSound.src = "https://cdn.freesound.org/previews/242/242429_4284968-lq.mp3"; // Button sound
        lapSound.src = "https://cdn.freesound.org/previews/412/412743_7865607-lq.mp3"; // Lap sound
    }, { once: true });
});