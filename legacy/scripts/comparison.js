/* =========================================================
   NUMBER COMPARISON & PLACE VALUE MODULE
========================================================= */

let compState = {
    stars: 0,
    level: "easy", // easy, medium, challenge
    activity: "compare", // compare, order, bigsmall, placevalue
    currentScore: 0,
    questionsDone: 0
};

/**
 * Initialize Comparison Mode
 */
function initComparisonMode() {
    console.log("Initializing Comparison Mode...");
    const wrapper = document.getElementById("comparisonArea");
    const additionBox = document.querySelector(".addition-box");

    // Hide standard addition/subtraction columns
    const columns = document.getElementById("additionColumns");
    if (columns) columns.style.display = "none";

    // Hide bubble section
    const bubbleSection = document.querySelector(".bubble-section");
    if (bubbleSection) bubbleSection.style.display = "none";

    // Show comparison area
    wrapper.style.display = "flex";

    // Setup activity tabs
    setupComparisonTabs();

    // Default activity
    switchComparisonActivity("compare");
}

/**
 * Cleanup Comparison Mode UI
 */
function cleanupComparisonUI() {
    const wrapper = document.getElementById("comparisonArea");
    wrapper.style.display = "none";

    const columns = document.getElementById("additionColumns");
    if (columns) columns.style.display = "flex";
}

/**
 * Setup Tab behaviors
 */
function setupComparisonTabs() {
    const tabs = document.querySelectorAll(".activity-tab");
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            switchComparisonActivity(tab.dataset.activity);
        };
    });
}

/**
 * Switch between comparison sub-activities
 */
function switchComparisonActivity(activity) {
    compState.activity = activity;
    console.log(`Switching to sub-activity: ${activity}`);

    const content = document.getElementById("comparisonContent");
    content.innerHTML = ""; // Clear

    switch (activity) {
        case "compare":
            renderCompareActivity();
            break;
        case "order":
            renderOrderActivity();
            break;
        case "bigsmall":
            renderBigSmallActivity();
            break;
        case "placevalue":
            renderPlaceValueActivity();
            break;
    }
}

/* =========================================================
   ACTIVITY 1: GREATER THAN / LESS THAN
========================================================= */

function renderCompareActivity() {
    const content = document.getElementById("comparisonContent");

    // Generate numbers based on level
    let min = 1, max = 10;
    if (compState.level === "medium") { min = 10; max = 50; }
    if (compState.level === "challenge") { min = 50; max = 100; }

    let n1 = Math.floor(Math.random() * (max - min)) + min;
    let n2 = Math.floor(Math.random() * (max - min)) + min;
    if (Math.random() > 0.8) n2 = n1;

    const html = `
        <div class="activity-instructions">
            <p>Tap the correct symbol! 🐊 <br><small>"Crocodile eats the bigger number"</small></p>
        </div>
        <div class="comparison-area">
            <div class="compare-num">${n1}</div>
            <div id="dropZone" class="symbol-drop-zone">?</div>
            <div class="compare-num">${n2}</div>
        </div>
        <div class="symbols-palette">
            <button class="draggable-symbol" onclick="selectSymbol('>', this)" data-symbol=">">&gt;</button>
            <button class="draggable-symbol" onclick="selectSymbol('<', this)" data-symbol="<">&lt;</button>
            <button class="draggable-symbol" onclick="selectSymbol('=', this)" data-symbol="=">=</button>
        </div>
    `;

    content.innerHTML = html;
    compState.currentAnswer = (n1 > n2) ? ">" : (n1 < n2) ? "<" : "=";
}

function selectSymbol(symbol, btn) {
    const dropZone = document.getElementById("dropZone");
    dropZone.textContent = symbol;
    dropZone.classList.add("correct-pop");

    if (symbol === compState.currentAnswer) {
        btn.style.backgroundColor = "#6BCF7F";
        showActivityFeedback(true);
    } else {
        btn.style.backgroundColor = "#FF6B6B";
        setTimeout(() => {
            btn.style.backgroundColor = "";
            dropZone.textContent = "?";
            dropZone.classList.remove("correct-pop");
        }, 800);
        showActivityFeedback(false);
    }
}

/* =========================================================
   ACTIVITY 2: ASCENDING / DESCENDING
========================================================= */

function renderOrderActivity() {
    const content = document.getElementById("comparisonContent");
    const isAsc = Math.random() > 0.5;
    const type = isAsc ? "Small to Big (Ascending)" : "Big to Small (Descending)";

    let count = 4;
    let nums = [];
    while (nums.length < count) {
        let n = Math.floor(Math.random() * 50) + 1;
        if (!nums.includes(n)) nums.push(n);
    }

    let sorted = [...nums].sort((a, b) => isAsc ? a - b : b - a);
    compState.correctOrder = sorted;
    compState.userOrder = [];

    const html = `
        <div class="activity-instructions">
            <p>Tap numbers in correct order: <b>${type}</b></p>
        </div>
        <div class="order-area" id="orderNumbers">
            ${nums.map(n => `<div class="order-box" onclick="handleOrderSelect(this, ${n})">${n}</div>`).join('')}
        </div>
        <div id="orderFeedback" style="margin-top: 10px; font-weight: bold;"></div>
    `;
    content.innerHTML = html;
}

function handleOrderSelect(el, val) {
    if (el.classList.contains("selected")) return;

    el.classList.add("selected");
    compState.userOrder.push(val);

    // Check if this step is correct
    const currentIndex = compState.userOrder.length - 1;
    if (compState.userOrder[currentIndex] !== compState.correctOrder[currentIndex]) {
        // Wrong step
        el.style.backgroundColor = "#ffcccc";
        setTimeout(() => {
            el.classList.remove("selected");
            el.style.backgroundColor = "";
            compState.userOrder.pop();
        }, 500);
        return;
    }

    // If all done
    if (compState.userOrder.length === compState.correctOrder.length) {
        showActivityFeedback(true, "Great job! Numbers are in correct order! 🎉");
    }
}

/* =========================================================
   ACTIVITY 3: BIGGEST / SMALLEST
========================================================= */

function renderBigSmallActivity() {
    const content = document.getElementById("comparisonContent");
    const findBiggest = Math.random() > 0.5;
    const taskText = findBiggest ? "Tap the BIGGEST number 🐘" : "Tap the SMALLEST number 🐭";

    let nums = [];
    while (nums.length < 4) {
        let n = Math.floor(Math.random() * 100) + 1;
        if (!nums.includes(n)) nums.push(n);
    }

    const target = findBiggest ? Math.max(...nums) : Math.min(...nums);

    const html = `
        <div class="activity-instructions">
            <p>${taskText}</p>
        </div>
        <div class="choice-grid">
            ${nums.map(n => `<div class="choice-box" onclick="checkBigSmall(${n}, ${target}, this)">${n}</div>`).join('')}
        </div>
    `;
    content.innerHTML = html;
}

function checkBigSmall(val, target, el) {
    if (val === target) {
        el.style.backgroundColor = "#d4edda";
        el.classList.add("correct-pop");
        showActivityFeedback(true);
    } else {
        el.style.backgroundColor = "#f8d7da";
        setTimeout(() => el.style.backgroundColor = "", 500);
    }
}

/* =========================================================
   ACTIVITY 4: PLACE VALUE
========================================================= */

/* =========================================================
   ACTIVITY 4: PLACE VALUE (Conventional Arrow Method)
========================================================= */

/* =========================================================
   ACTIVITY 4: PLACE VALUE (Arrow Method & Expanded Form)
========================================================= */

function renderPlaceValueActivity() {
    const content = document.getElementById("comparisonContent");

    let n = Math.floor(Math.random() * 899) + 101; // 101 to 999
    let h = Math.floor(n / 100);
    let t = Math.floor((n % 100) / 10);
    let o = n % 10;

    const html = `
        <div class="activity-instructions">
            <p>Write the <b>Expanded Form</b>! <br><small>Follow the arrows to find the value.</small></p>
        </div>
        
        <div class="arrow-method-container">
            <!-- Arrow Diagram -->
            <div class="arrow-diagram">
                <!-- Hundreds -->
                <div class="arrow-column">
                    <div class="arrow-digit">${h}</div>
                    <div class="arrow-icon">⬇</div>
                    <div class="arrow-place place-h">H</div>
                </div>

                 <!-- Tens -->
                 <div class="arrow-column">
                    <div class="arrow-digit">${t}</div>
                    <div class="arrow-icon">⬇</div>
                    <div class="arrow-place place-t">T</div>
                </div>

                 <!-- Ones -->
                 <div class="arrow-column">
                    <div class="arrow-digit">${o}</div>
                    <div class="arrow-icon">⬇</div>
                    <div class="arrow-place place-o">O</div>
                </div>
            </div>

            <!-- Value Hints -->
            <table class="calc-hint-table">
                <tr><td>${h} Hundreds</td><td>= ${h}00</td></tr>
                <tr><td>${t} Tens</td><td>= ${t}0</td></tr>
                <tr><td>${o} Ones</td><td>= ${o}</td></tr>
            </table>

            <!-- Expanded Form Input -->
            <div class="expanded-form-area">
                <div class="expanded-equation">
                    <span>${n} = </span>
                    <input class="expanded-input" type="number" id="expH" placeholder="000">
                    <span>+</span>
                    <input class="expanded-input" type="number" id="expT" placeholder="00">
                    <span>+</span>
                    <input class="expanded-input" type="number" id="expO" placeholder="0">
                </div>
                <button class="btn-action" style="margin-top: 20px" onclick="checkExpandedForm(${h}, ${t}, ${o})">Check Answer</button>
            </div>
        </div>
    `;
    content.innerHTML = html;
}

window.checkExpandedForm = function (h, t, o) {
    const valH = parseInt(document.getElementById('expH').value);
    const valT = parseInt(document.getElementById('expT').value);
    const valO = parseInt(document.getElementById('expO').value);

    // Expected values
    const expH = h * 100;
    const expT = t * 10;
    const expO = o;

    if (valH === expH && valT === expT && valO === expO) {
        showActivityFeedback(true, "Correct Expanded Form! 🎉");
    } else {
        showActivityFeedback(false, "Check your values! (e.g. 3 Hundreds = 300)");
    }
};

/* =========================================================
   SHARED HELPERS
========================================================= */

function showActivityFeedback(isCorrect, customMsg) {
    const resultMsg = document.getElementById("resultMsg");
    if (isCorrect) {
        compState.stars++;
        updateCompStats();
        showMessage(customMsg || "🌟 Awesome! Correct! 🌟");
        resultMsg.className = "correct-text";
        // Auto-next after short delay
        setTimeout(() => {
            switchComparisonActivity(compState.activity);
            showMessage("");
        }, 1500);
    } else {
        showMessage("❌ Try again, you can do it!");
        resultMsg.className = "incorrect-text";
    }
}

function updateCompStats() {
    const starEl = document.getElementById("compStars");
    const levelEl = document.getElementById("compLevel");
    const progressEl = document.getElementById("compProgress");
    const statsContainer = document.querySelector(".stats-container");
    const progressBar = document.querySelector(".progress-bar");

    // Ensure they are visible
    if (statsContainer) statsContainer.style.display = "flex";
    if (progressBar) progressBar.style.display = "block";

    if (starEl) starEl.textContent = compState.stars;

    // Level Logic
    let oldLevel = compState.level;
    if (compState.stars >= 10 && compState.stars < 30) compState.level = "medium";
    else if (compState.stars >= 30) compState.level = "challenge";
    else compState.level = "easy";

    if (levelEl) levelEl.textContent = compState.level.charAt(0).toUpperCase() + compState.level.slice(1);

    // Feedback on Level Up
    if (oldLevel !== compState.level) {
        showMessage(`🎊 WOW! You reached ${compState.level.toUpperCase()} level! 🎊`);
        // Maybe add some sound or more stars?
    }

    // Progress bar (percent of 10 stars per segment)
    let progress = (compState.stars % 10) * 10;
    if (compState.stars > 0 && progress === 0) progress = 100; // Show full on 10, 20...
    if (progressEl) progressEl.style.width = `${progress}%`;
}

// Global hook for navigation
window.initComparison = initComparisonMode;
window.cleanupComparisonUI = cleanupComparisonUI;
