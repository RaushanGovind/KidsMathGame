/* =========================================================
   COLUMN ADDITION WITH DIGIT INPUT + CARRY BOXES
========================================================= */

let num1, num2;
let additionRows = []; // Store all numbers for multi-row addition
const maxDigits = 3;   // fixed 3-column layout (Hundreds Tens Ones)

// Bubble matrix state
let bubbleMatrixVisible = true;
let selectedBubbles = new Set();
const BUBBLE_ROWS = 10;
const BUBBLE_COLS = 10;


/**
 * Convert number into equal-length digit array
 * while keeping alignment correct
 */
function splitDigits(n, length) {

    // pad with zeros to preserve column width
    const digits = String(n).padStart(length, "0").split("");

    // hide ONLY the first leading zero visually
    return digits.map((d, i) =>
        (i === 0 && d === "0") ? "" : d
    );
}



/**
 * Build column UI dynamically
 */
function renderAdditionColumns() {

    const container = document.getElementById("additionColumns");
    container.innerHTML = "";

    // always show 3 columns (Units / Tens / Hundreds)
    const len = maxDigits;

    // Get all numbers to display based on row count
    const rowCount = additionSettings.rows;
    const allDigits = additionRows.map(num => splitDigits(num, len));

    for (let i = 0; i < len; i++) {

        const col = document.createElement("div");
        col.className = "col";

        // Only show carry box if carry mode is enabled
        const carryBox = additionSettings.carry === "yes"
            ? `<input class="carry-input" maxlength="1">`
            : `<div class="carry-placeholder"></div>`;

        // Build all number rows
        let numberRows = "";
        for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
            const digit = allDigits[rowIdx][i];
            const prefix = (i === 0 && rowIdx === rowCount - 1) ? "+" : "";
            numberRows += `<div class="num${rowIdx + 1}">${prefix}${digit}</div>\n`;
        }

        col.innerHTML = `
        <!-- Carry box (conditional) -->
        ${carryBox}

        <!-- Number rows -->
        ${numberRows}

        <!-- Horizontal line before answer -->
        <div class="answer-line"></div>

        <!-- Answer digit -->
        <input class="answer-input" maxlength="1" data-pos="${i}">
    `;

        container.appendChild(col);
    }
}



/**
 * Generates random numbers & draws board
 */
function generateAdditionQuestion() {

    const d = additionSettings.digits;
    const r = additionSettings.rows;

    const min = Math.pow(10, d - 1);
    const max = Math.pow(10, d) - 1;

    // create N numbers based on row count
    let nums = [];
    for (let i = 0; i < r; i++) {
        nums.push(
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    }

    // store first 2 as num1 + num2 for now (UI expectation)
    num1 = nums[0];
    num2 = nums[1];

    // support extra rows later
    additionRows = nums;

    if (additionSettings.carry === "no") {
        nums = forceNoCarry(nums, d);
        num1 = nums[0];
        num2 = nums[1];
        additionRows = nums;
    }

    renderAdditionColumns();
    showMessage("");
}

function forceNoCarry(nums, digits) {

    let arr = [...nums];
    let maxPlace = digits - 1;

    // Convert all numbers to digit arrays
    let digitArrays = arr.map(num =>
        String(num).padStart(digits, "0").split("").map(Number)
    );

    // Check each column position from right to left
    for (let i = maxPlace; i >= 0; i--) {
        let columnSum = 0;

        // Sum all digits in this column
        for (let rowIdx = 0; rowIdx < digitArrays.length; rowIdx++) {
            columnSum += digitArrays[rowIdx][i];
        }

        // If there's a carry, adjust the last number's digit
        if (columnSum > 9) {
            let excess = columnSum - 9;
            digitArrays[digitArrays.length - 1][i] = Math.max(0, digitArrays[digitArrays.length - 1][i] - excess);
        }
    }

    // Convert digit arrays back to numbers
    return digitArrays.map(digits => Number(digits.join("")));
}



/**
 * Rebuild number from digit inputs
 */
function getUserAnswer() {

    const digits = Array.from(
        document.querySelectorAll(".answer-input")
    ).map(inp => inp.value || "0");

    return Number(digits.join(""));
}



/**
 * Check Answer (column style)
 */
function checkAdditionAnswer() {

    // Sum all numbers in the additionRows array
    const correct = additionRows.reduce((sum, num) => sum + num, 0);
    const user = getUserAnswer();

    if (user === correct) {
        showMessage("🎉 Correct! Well done!");
    } else {
        showMessage(`❌ Try again — Correct answer = ${correct}`);
    }
}



/**
 * Next question
 */
function nextAdditionQuestion() {
    generateAdditionQuestion();
}


let additionSettings = {
    carry: "no",
    digits: 2,
    rows: 2
};


/* ----- POPUP CONTROL ----- */

function openAddPopup() {
    document.getElementById("addPopup").style.display = "flex";
}

function closeAddPopup() {
    document.getElementById("addPopup").style.display = "none";
}

function setupAdditionModeControls() {

    document.getElementById("addCancel").onclick = closeAddPopup;

    document.getElementById("addCarryMode").onchange = e =>
        additionSettings.carry = e.target.value;

    document.getElementById("addDigitCount").onchange = e =>
        additionSettings.digits = Number(e.target.value);

    document.getElementById("addRowCount").onchange = e =>
        additionSettings.rows = Number(e.target.value);

    document.getElementById("addApply").onclick = () => {
        closeAddPopup();
        generateAdditionQuestion();
    };
}

/* =========================================================
   BUBBLE MATRIX FUNCTIONS
========================================================= */

/**
 * Generate bubble matrix
 */
function generateBubbleMatrix() {
    const container = document.getElementById("bubbleMatrix");
    if (!container) return;

    container.innerHTML = "";
    selectedBubbles.clear();
    updateBubbleCounter();

    for (let row = 0; row < BUBBLE_ROWS; row++) {
        for (let col = 0; col < BUBBLE_COLS; col++) {
            const bubble = document.createElement("div");
            bubble.className = "bubble";
            bubble.dataset.id = `${row}-${col}`;

            bubble.onclick = () => toggleBubble(bubble);

            container.appendChild(bubble);
        }
    }
}

/**
 * Toggle bubble selection
 */
function toggleBubble(bubble) {
    const id = bubble.dataset.id;

    if (selectedBubbles.has(id)) {
        selectedBubbles.delete(id);
        bubble.classList.remove("bubble-selected");
    } else {
        selectedBubbles.add(id);
        bubble.classList.add("bubble-selected");
    }

    updateBubbleCounter();
}

/**
 * Update bubble counter display
 */
function updateBubbleCounter() {
    const counter = document.getElementById("bubbleCounter");
    if (counter) {
        counter.textContent = `Selected: ${selectedBubbles.size}`;
    }
}

/**
 * Toggle bubble matrix visibility
 */
function toggleBubbleMatrix() {
    const matrix = document.getElementById("bubbleMatrix");
    const toggleBtn = document.getElementById("toggleBubbles");

    if (!matrix || !toggleBtn) return;

    bubbleMatrixVisible = !bubbleMatrixVisible;

    if (bubbleMatrixVisible) {
        matrix.style.display = "grid";
        toggleBtn.textContent = "Hide Bubbles";
    } else {
        matrix.style.display = "none";
        toggleBtn.textContent = "Show Bubbles";
    }
}

/**
 * Reset bubble matrix
 */
function resetBubbleMatrix() {
    selectedBubbles.clear();
    const bubbles = document.querySelectorAll(".bubble");
    bubbles.forEach(bubble => bubble.classList.remove("bubble-selected"));
    updateBubbleCounter();
}

/**
 * Initialize bubble matrix on page load
 */
function initBubbleMatrix() {
    generateBubbleMatrix();

    const toggleBtn = document.getElementById("toggleBubbles");
    if (toggleBtn) {
        toggleBtn.onclick = toggleBubbleMatrix;
    }
}

// Initialize bubble matrix when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBubbleMatrix);
} else {
    initBubbleMatrix();
}
