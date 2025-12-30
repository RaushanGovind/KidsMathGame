/* =========================================================
   TIME READING - LOGIC
========================================================= */

let timeState = {
    mode: 'learn', // learn, practice
    currentHour: 6,
    currentMinute: 30,
    targetHour: 0,
    targetMinute: 0
};

function initTimeMode() {
    console.log("Initializing Time Reading Mode...");
    const wrapper = document.getElementById("timeArea");

    // Hide others
    if (window.cleanupDivisionUI) window.cleanupDivisionUI();
    if (window.cleanupComparisonUI) window.cleanupComparisonUI();
    document.getElementById("additionColumns").style.display = "none";
    document.querySelector(".bubble-section").style.display = "none";

    wrapper.style.display = "flex";

    setupClockFace();
    updateClock(6, 30);
}

function cleanupTimeUI() {
    const wrapper = document.getElementById("timeArea");
    if (wrapper) wrapper.style.display = "none";
}

/**
 * Generate Clock Numbers and Ticks
 */
function setupClockFace() {
    const face = document.getElementById("clockFace");

    // Clear existing numbers/ticks to avoid duplicates
    const existingTicks = face.querySelectorAll('.tick, .clock-number');
    existingTicks.forEach(el => el.remove());

    // Create 60 ticks
    for (let i = 0; i < 60; i++) {
        const tick = document.createElement("div");
        tick.className = "tick";
        if (i % 5 === 0) tick.classList.add("five-min");
        tick.style.transform = `rotate(${i * 6}deg)`;
        face.appendChild(tick);
    }

    // Create 12 numbers
    for (let i = 1; i <= 12; i++) {
        const num = document.createElement("div");
        num.className = "clock-number";
        num.innerText = i;
        num.style.transform = `rotate(${i * 30}deg)`;

        // Anti-rotate the text inside
        const inner = document.createElement("div");
        inner.innerText = i;
        inner.style.transform = `rotate(${-i * 30}deg)`;
        num.innerText = "";
        num.appendChild(inner);

        face.appendChild(num);
    }
}

/**
 * Update Clock Hands and Displays
 */
function updateClock(h, m) {
    timeState.currentHour = h;
    timeState.currentMinute = m;

    const hourDeg = (h % 12) * 30 + (m / 60) * 30;
    const minDeg = m * 6;

    document.getElementById("hourHand").style.transform = `rotate(${hourDeg}deg)`;
    document.getElementById("minuteHand").style.transform = `rotate(${minDeg}deg)`;

    // Digital update
    const hStr = h === 0 ? "12" : h;
    const mStr = m < 10 ? "0" + m : m;
    document.getElementById("digitalTime").innerText = `${hStr}:${mStr}`;

    // Label update
    document.getElementById("timeLabel").innerText = getTimeAsText(h, m);
}

/**
 * Human friendly time labels
 */
function getTimeAsText(h, m) {
    const numbers = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

    if (m === 0) return `${numbers[h]} O'Clock`;
    if (m === 30) return `Half Past ${numbers[h]}`;
    if (m === 15) return `Quarter Past ${numbers[h]}`;
    if (m === 45) {
        const nextH = h % 12 + 1;
        return `Quarter To ${numbers[nextH]}`;
    }

    if (m < 30) return `${m} Minutes Past ${numbers[h]}`;
    const left = 60 - m;
    const nextH = h % 12 + 1;
    return `${left} Minutes To ${numbers[nextH]}`;
}

/**
 * Modes and Interactions
 */
function setTimeMode(m) {
    timeState.mode = m;
    const btns = document.querySelectorAll(".time-btn");
    btns.forEach(b => b.classList.remove("active"));

    const uiCard = document.querySelector(".time-ui-card");
    const choicesGrid = document.getElementById("timeChoicesGrid");

    if (m === 'learn') {
        btns[0].classList.add("active");
        document.querySelector(".learning-badge").innerText = "Learn Mode";
        uiCard.classList.remove("hidden");
        choicesGrid.style.display = "none";
        nextTimeQuestion();
    } else {
        btns[1].classList.add("active");
        document.querySelector(".learning-badge").innerText = "Question Mode";
        uiCard.classList.add("hidden");
        choicesGrid.style.display = "grid";
        startQuestionMode();
    }
}

function nextTimeQuestion() {
    if (timeState.mode === 'question') {
        startQuestionMode();
    } else {
        const h = Math.floor(Math.random() * 12) + 1;
        const m = [0, 15, 30, 45, 10, 20, 40, 50][Math.floor(Math.random() * 8)];
        updateClock(h, m);
    }
}

function startPracticeQuestion() {
    const h = Math.floor(Math.random() * 12) + 1;
    const m = [0, 15, 30, 45, 10, 20, 40, 50][Math.floor(Math.random() * 8)];
    updateClock(h, m);

    // In practice mode, we might hide the text and ask child to enter
    // For now, let's keep it simple: Show time, but reward for recognizing
    document.getElementById("digitalTime").style.transition = "opacity 0.5s";
    document.getElementById("timeLabel").style.transition = "opacity 0.5s";
}

function startQuestionMode() {
    // Generate target time
    const h = Math.floor(Math.random() * 12) + 1;
    const m = [0, 15, 30, 45, 10, 20, 40, 50][Math.floor(Math.random() * 8)];
    updateClock(h, m);

    // Create choices
    const correct = `${h === 0 ? "12" : h}:${m < 10 ? "0" + m : m}`;
    let options = [correct];

    while (options.length < 4) {
        let randH = Math.floor(Math.random() * 12) + 1;
        let randM = [0, 15, 30, 45, 10, 20, 40, 50][Math.floor(Math.random() * 8)];
        let opt = `${randH}:${randM < 10 ? "0" + randM : randM}`;
        if (!options.includes(opt)) options.push(opt);
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    // Render Choices
    const choicesGrid = document.getElementById("timeChoicesGrid");
    choicesGrid.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.innerText = opt;
        btn.onclick = () => checkTimeAnswer(btn, opt, correct);
        choicesGrid.appendChild(btn);
    });

    showMessage("Look at the clock! What time is it?");
}

function checkTimeAnswer(btn, selected, correct) {
    if (selected === correct) {
        btn.classList.add("correct");
        btn.classList.add("correct-anim");

        // Use Global Feedback Pattern (Same as Addition/Subtraction)
        if (window.showResultFeedback) {
            window.showResultFeedback(true);
        } else {
            showMessage("Correct! You are a Time Master! 🌟");
        }

        // Auto next after 1.8s
        setTimeout(() => {
            if (timeState.mode === 'question') startQuestionMode();
        }, 1800);
    } else {
        btn.classList.add("wrong");

        // Use Global Feedback Pattern
        if (window.showResultFeedback) {
            window.showResultFeedback(false);
        } else {
            showMessage("Not that one... try again! 🔍");
        }

        setTimeout(() => {
            btn.classList.remove("wrong");
        }, 1000);
    }
}

// Global hooks
window.switchToTime = initTimeMode;
window.cleanupTimeUI = cleanupTimeUI;
window.setTimeMode = setTimeMode;
window.nextTimeQuestion = nextTimeQuestion;
