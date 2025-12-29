/* =========================================================
   COLUMN ADDITION WITH DIGIT INPUT + CARRY BOXES
========================================================= */

let num1, num2;
let additionRows = []; // Store all numbers for multi-row addition

// Bubble matrix state
let bubbleMatrixVisible = true;
let selectedBubbles = new Set();
const BUBBLE_ROWS = 10;
const BUBBLE_COLS = 10;


/**
 * Convert number into equal-length digit array
 * while keeping alignment correct
 */
function splitDigits(n, length, hideLeadingZero = true) {

    // pad with zeros to preserve column width
    const digits = String(n).padStart(length, "0").split("");

    // hide ONLY the first leading zero visually (unless hideLeadingZero is false)
    return digits.map((d, i) =>
        (i === 0 && d === "0" && hideLeadingZero) ? "" : d
    );
}




/**
 * Build column UI dynamically
 */
function renderAdditionColumns() {

    const container = document.getElementById("additionColumns");
    container.innerHTML = "";

    // Calculate the sum to determine how many columns we need
    const sum = additionRows.reduce((acc, num) => acc + num, 0);
    const sumDigits = String(sum).length;

    // Use the maximum of: input digits OR sum digits (to handle carry overflow)
    const len = Math.max(additionSettings.digits, sumDigits);

    console.log(`Rendering ${len} columns (input digits: ${additionSettings.digits}, sum: ${sum}, sum digits: ${sumDigits})`);

    // Get all numbers to display based on row count
    const rowCount = additionSettings.rows;
    // For all rows except the last, hide leading zeros
    // For the last row (with + sign), show leading zeros for alignment
    const allDigits = additionRows.map((num, idx) =>
        splitDigits(num, len, idx !== rowCount - 1)  // Don't hide zero on last row
    );

    for (let i = 0; i < len; i++) {

        const col = document.createElement("div");
        col.className = "col";

        // Only show carry box if carry mode is enabled AND not the rightmost column (ones place)
        // Rightmost column is at index (len - 1), we don't show carry there
        const isOnesColumn = (i === len - 1);
        const carryBox = (additionSettings.carry === "yes" && !isOnesColumn)
            ? `<input class="carry-input" maxlength="1" inputmode="numeric" pattern="[0-9]*">`
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

        <!-- Answer digit -->
        <input class="answer-input" maxlength="1" data-pos="${i}" inputmode="numeric" pattern="[0-9]*">
    `;

        container.appendChild(col);
    }

    // Add single continuous line above all answer boxes
    const lineDiv = document.createElement("div");
    lineDiv.className = "continuous-answer-line";
    container.appendChild(lineDiv);
}



/**
 * Generates random numbers & draws board
 */
function generateAdditionQuestion() {

    console.log("🎲 Generating question with carry mode:", additionSettings.carry);

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

    console.log("Initial random numbers:", nums);

    // store first 2 as num1 + num2 for now (UI expectation)
    num1 = nums[0];
    num2 = nums[1];

    // support extra rows later
    additionRows = nums;

    if (additionSettings.carry === "no") {
        console.log("⚠️ Forcing NO CARRY...");
        nums = forceNoCarry(nums, d);
        num1 = nums[0];
        num2 = nums[1];
        additionRows = nums;
        console.log("✅ No-carry numbers:", nums);
    } else {
        console.log("✅ Allowing carry (numbers unchanged)");
    }

    renderAdditionColumns();
    showMessage("");
}


function forceNoCarry(nums, digits) {
    console.log("🔧 forceNoCarry called with:", nums, "digits:", digits);

    let arr = [...nums];
    let maxAttempts = 100;
    let attempts = 0;

    // Keep trying until we get numbers without carry
    while (attempts < maxAttempts) {
        attempts++;

        // Convert all numbers to digit arrays
        let digitArrays = arr.map(num =>
            String(num).padStart(digits, "0").split("").map(Number)
        );

        let needsAdjustment = false;

        // Check each column position from right to left
        for (let colIdx = digits - 1; colIdx >= 0; colIdx--) {
            let columnSum = 0;

            // Sum all digits in this column
            for (let rowIdx = 0; rowIdx < digitArrays.length; rowIdx++) {
                columnSum += digitArrays[rowIdx][colIdx];
            }

            console.log(`  Column ${colIdx}: sum = ${columnSum}`);

            // If there's a carry, adjust numbers
            if (columnSum > 9) {
                needsAdjustment = true;
                let excess = columnSum - 9;

                // Try to reduce from different rows
                for (let rowIdx = digitArrays.length - 1; rowIdx >= 0 && excess > 0; rowIdx--) {
                    let currentDigit = digitArrays[rowIdx][colIdx];
                    let reduction = Math.min(currentDigit, excess);
                    digitArrays[rowIdx][colIdx] -= reduction;
                    excess -= reduction;
                }
            }
        }

        // Convert back to numbers
        arr = digitArrays.map(digits => Number(digits.join("")));

        // If no adjustment needed, we're done!
        if (!needsAdjustment) {
            console.log("✅ Successfully created no-carry numbers:", arr);
            return arr;
        }
    }

    console.warn("⚠️ Max attempts reached, returning best effort:", arr);
    return arr;
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

    document.getElementById("addCarryMode").onchange = e => {
        additionSettings.carry = e.target.value;
        console.log("Carry mode changed to:", additionSettings.carry);
    };

    // Handle quick selection buttons
    const quickSelectBtns = document.querySelectorAll(".quick-select-btn");

    quickSelectBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove selected class from all buttons
            quickSelectBtns.forEach(b => b.classList.remove("selected"));

            // Add selected class to clicked button
            btn.classList.add("selected");

            // Get digits and rows from data attributes
            const digits = parseInt(btn.dataset.digits);
            const rows = parseInt(btn.dataset.rows);

            // IMPORTANT: Read carry mode from dropdown at this moment
            const carryDropdown = document.getElementById("addCarryMode");
            additionSettings.carry = carryDropdown.value;

            // Update settings
            additionSettings.digits = digits;
            additionSettings.rows = rows;

            console.log("Generating question with settings:", additionSettings);

            // Close popup and generate new question
            closeAddPopup();
            generateAdditionQuestion();
        });
    });
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
 * Toggle bubble selection with 3 states:
 * 1st click: selected (colored)
 * 2nd click: crossed (X mark)
 * 3rd click: clear (back to normal)
 */
function toggleBubble(bubble) {
    const id = bubble.dataset.id;

    // Check current state
    if (!bubble.classList.contains("bubble-selected") && !bubble.classList.contains("bubble-crossed")) {
        // State 1: Normal → Selected (colored)
        bubble.classList.add("bubble-selected");
        selectedBubbles.add(id);
    } else if (bubble.classList.contains("bubble-selected")) {
        // State 2: Selected → Crossed (X)
        bubble.classList.remove("bubble-selected");
        bubble.classList.add("bubble-crossed");
        selectedBubbles.delete(id);
        // Create X mark
        bubble.innerHTML = '<span class="bubble-x">✕</span>';
    } else if (bubble.classList.contains("bubble-crossed")) {
        // State 3: Crossed → Clear (back to normal)
        bubble.classList.remove("bubble-crossed");
        bubble.innerHTML = '';  // Remove X mark
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
    bubbles.forEach(bubble => {
        bubble.classList.remove("bubble-selected");
        bubble.classList.remove("bubble-crossed");
        bubble.innerHTML = '';  // Remove any X marks
    });
    updateBubbleCounter();
}

/**
 * Initialize bubble matrix on page load
 */
function initBubbleMatrix() {
    generateBubbleMatrix();

    const toggleBtn = document.getElementById("toggleBubbles");
    const matrix = document.getElementById("bubbleMatrix");

    // Hide bubble matrix on page load
    if (matrix) {
        matrix.style.display = "none";
        bubbleMatrixVisible = false;
    }

    // Update button text
    if (toggleBtn) {
        toggleBtn.textContent = "Show Bubbles";
        toggleBtn.onclick = toggleBubbleMatrix;
    }

    const resetBtn = document.getElementById("resetBubbles");
    if (resetBtn) {
        resetBtn.onclick = resetBubbleMatrix;
    }
}

// Initialize bubble matrix when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBubbleMatrix);
} else {
    initBubbleMatrix();
}
