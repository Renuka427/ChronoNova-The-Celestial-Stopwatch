const display = document.querySelector('.display');
const startButton = document.getElementById('top-btn-1');
const stopButton = document.getElementById('top-btn-2');
const resetButton = document.getElementById('top-btn-3');
const lapRing = document.getElementById('lap-ring');
const lapHistoryList = document.querySelector('.lap-history');

let timer = null;
let elapsedTime = 0;
let lapTimes = [];
let lapNameCard;

const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();
utterance.pitch = 1;
utterance.rate = 1;
utterance.volume = 1;

function speak(text, pitch = 1, rate = 1, volume = 1) {
    utterance.text = text;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;
    synth.speak(utterance);
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}

function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

function startTimer() {
    if (!timer) {
        const startTime = Date.now() - elapsedTime;
        timer = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
        startButton.disabled = true;
        stopButton.disabled = false;
        lapRing.classList.remove('disabled');
        speak("Stopwatch started", 1, 1, 1);
    }
}

function stopTimer(event) {
    event.stopPropagation();
    clearInterval(timer);
    timer = null;
    startButton.disabled = false;
    stopButton.disabled = true;
    lapRing.classList.add('disabled');
    speak("Stopwatch stopped", 0.5, 1, 1);
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    lapTimes = [];
    updateDisplay();
    lapHistoryList.innerHTML = '';
    speak("Stopwatch reset", 1.5, 1.5, 1);
}

function recordLap() {
    if (timer) {
        lapTimes.push(elapsedTime);
        const lapTime = formatTime(elapsedTime);
        const lapItem = document.createElement('li');
        lapItem.textContent = `Lap ${lapTimes.length}: ${lapTime}`;
        lapHistoryList.appendChild(lapItem);
        speak(`Lap ${lapTimes.length} recorded`, 1.2, 1, 1);
    }
}

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

lapRing.addEventListener('mouseenter', function() {
    lapNameCard = document.createElement('div');
    lapNameCard.classList.add('lap-name-card');
    lapNameCard.textContent = `Lap ${lapTimes.length + 1}`;
    document.body.appendChild(lapNameCard);
});

lapRing.addEventListener('mouseleave', function() {
    if (lapNameCard) {
        lapNameCard.remove();
    }
});

lapRing.addEventListener('click', function(event) {
    if (!lapRing.classList.contains('disabled')) {
        recordLap();
    }
    event.stopPropagation();
});

updateDisplay();
