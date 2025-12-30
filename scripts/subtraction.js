let subSettings = {
  borrow: "no",
  digits: 2,
  rows: 2
};

let subNum1, subNum2;

/* ----- POPUP CONTROL ----- */

function openSubPopup() {
  document.getElementById("subPopup").style.display = "flex";
}

function closeSubPopup() {
  document.getElementById("subPopup").style.display = "none";
}

function setupSubPopupControls() {

  document.getElementById("subCancel").onclick = closeSubPopup;

  // Handle toggle buttons for borrow mode
  const toggleBtns = document.querySelectorAll('#subPopup .toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all toggle buttons
      toggleBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked button
      btn.classList.add('active');
      // Update borrow mode
      subSettings.borrow = btn.dataset.borrow;
      console.log("Borrow mode changed to:", subSettings.borrow);
    });
  });

  // Handle quick selection buttons
  const quickSelectBtns = document.querySelectorAll(".sub-select-btn");

  quickSelectBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove selected class from all buttons
      quickSelectBtns.forEach(b => b.classList.remove("selected"));

      // Add selected class to clicked button
      btn.classList.add("selected");

      // Get digits from data attribute
      const digits = parseInt(btn.dataset.digits);

      // Borrow mode is already set by toggle buttons above
      // Update settings (rows always 2 for subtraction)
      subSettings.digits = digits;
      subSettings.rows = 2;  // Always 2 for subtraction!

      console.log("Generating subtraction with settings:", subSettings);

      // Close popup and generate new question
      closeSubPopup();
      generateSubQuestion();
    });
  });
}


function splitDigitsAligned(n, len) {
  return String(n).padStart(len, "0").split("").map((d, i) =>
    (i === 0 && d === "0") ? "" : d);
}


/* ensure NO borrow when selected */
function forceNoBorrow(a, b, d) {

  a = String(a).padStart(d, "0").split("").map(Number);
  b = String(b).padStart(d, "0").split("").map(Number);

  for (let i = d - 1; i >= 0; i--) {
    if (a[i] < b[i]) {
      a[i] = b[i]; // adjust to avoid borrow
    }
  }

  return [
    Number(a.join("")),
    Number(b.join(""))
  ];
}


function renderSubColumns() {

  const colBox = document.getElementById("additionColumns");

  colBox.innerHTML = "";

  const len = subSettings.digits;

  // Show leading zero on second row (with minus sign) for alignment
  const d1 = splitDigitsAligned(subNum1, len);
  const d2 = splitDigitsAligned(subNum2, len);

  for (let i = 0; i < len; i++) {

    const col = document.createElement("div");
    col.className = "col";

    // leftmost column → show minus sign
    const prefix = (i === 0) ? "-" : "";

    // Show second number with leading zeros for alignment (like addition)
    const bottomDigit = d2[i] || "0";  // Show "0" even if it's leading

    // Only show borrow box if borrow mode enabled AND not rightmost column
    const isOnesColumn = (i === len - 1);
    const borrowBox = (subSettings.borrow === "yes" && !isOnesColumn)
      ? `<input class="carry-input" maxlength="1" inputmode="numeric" pattern="[0-9]*">`
      : `<div class="carry-placeholder"></div>`;

    col.innerHTML = `
      <!-- Borrow box (conditional) -->
      ${borrowBox}

      <!-- Top number -->
      <div class="num1">${d1[i]}</div>

      <!-- Bottom number with - on first column -->
      <div class="num2">${prefix}${bottomDigit}</div>

      <!-- Answer digit -->
      <input class="answer-input" maxlength="1" data-pos="${i}" inputmode="numeric" pattern="[0-9]*">
    `;

    colBox.appendChild(col);
  }

  // Add single continuous line above all answer boxes
  const lineDiv = document.createElement("div");
  lineDiv.className = "continuous-answer-line";
  colBox.appendChild(lineDiv);
}


function generateSubQuestion() {

  const d = subSettings.digits;

  const min = Math.pow(10, d - 1);
  const max = Math.pow(10, d) - 1;

  subNum1 = Math.floor(Math.random() * (max - min + 1)) + min;
  subNum2 = Math.floor(Math.random() * (max - min + 1)) + min;

  // ensure top ≥ bottom
  if (subNum2 > subNum1) {
    [subNum1, subNum2] = [subNum2, subNum1];
  }

  if (subSettings.borrow === "no") {
    [subNum1, subNum2] = forceNoBorrow(subNum1, subNum2, d);
  }

  renderSubColumns();
}

function getSubUserAnswer() {
  return Number(
    Array.from(document.querySelectorAll(".answer-input"))
      .map(i => i.value || "0").join("")
  );
}

function checkSubAnswer() {
  // Hide bubble matrix first
  const matrix = document.getElementById("bubbleMatrix");
  const toggleBtn = document.getElementById("toggleBubbles");

  if (matrix && toggleBtn) {
    matrix.style.display = "none";
    toggleBtn.textContent = "Show Bubbles";
    subBubbleMatrixVisible = false;
  }

  const correct = subNum1 - subNum2;
  const user = getSubUserAnswer();

  showResultFeedback(user === correct);
}

/* =========================================================
   BUBBLE MATRIX FUNCTIONS FOR SUBTRACTION
========================================================= */

// Bubble matrix state for subtraction
let subBubbleMatrixVisible = true;
let subSelectedBubbles = new Set();
const SUB_BUBBLE_ROWS = 10;
const SUB_BUBBLE_COLS = 10;

/**
 * Generate bubble matrix for subtraction
 */
function generateSubBubbleMatrix() {
  const container = document.getElementById("bubbleMatrix");
  if (!container) return;

  container.innerHTML = "";
  subSelectedBubbles.clear();
  updateSubBubbleCounter();

  for (let row = 0; row < SUB_BUBBLE_ROWS; row++) {
    for (let col = 0; col < SUB_BUBBLE_COLS; col++) {
      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.dataset.id = `${row}-${col}`;

      bubble.onclick = () => toggleSubBubble(bubble);

      container.appendChild(bubble);
    }
  }
}

/**
 * Toggle bubble selection with 3 states (Subtraction mode):
 * 1st click: selected (colored)
 * 2nd click: crossed (X mark)
 * 3rd click: clear (back to normal)
 */
function toggleSubBubble(bubble) {
  const id = bubble.dataset.id;

  // Check current state
  if (!bubble.classList.contains("bubble-selected") && !bubble.classList.contains("bubble-crossed")) {
    // State 1: Normal → Selected (colored)
    bubble.classList.add("bubble-selected");
    subSelectedBubbles.add(id);
  } else if (bubble.classList.contains("bubble-selected")) {
    // State 2: Selected → Crossed (X)
    bubble.classList.remove("bubble-selected");
    bubble.classList.add("bubble-crossed");
    subSelectedBubbles.delete(id);
    // Create X mark
    bubble.innerHTML = '<span class="bubble-x">✕</span>';
  } else if (bubble.classList.contains("bubble-crossed")) {
    // State 3: Crossed → Clear (back to normal)
    bubble.classList.remove("bubble-crossed");
    bubble.innerHTML = '';  // Remove X mark
  }

  updateSubBubbleCounter();
}

/**
 * Update bubble counter display for subtraction
 */
function updateSubBubbleCounter() {
  const counter = document.getElementById("bubbleCounter");
  if (counter) {
    counter.textContent = `Selected: ${subSelectedBubbles.size}`;
  }
}

/**
 * Toggle bubble matrix visibility for subtraction
 */
function toggleSubBubbleMatrix() {
  const matrix = document.getElementById("bubbleMatrix");
  const toggleBtn = document.getElementById("toggleBubbles");

  if (!matrix || !toggleBtn) return;

  subBubbleMatrixVisible = !subBubbleMatrixVisible;

  if (subBubbleMatrixVisible) {
    matrix.style.display = "grid";
    toggleBtn.textContent = "Hide Bubbles";
  } else {
    matrix.style.display = "none";
    toggleBtn.textContent = "Show Bubbles";
  }
}

/**
 * Reset bubble matrix for subtraction
 */
function resetSubBubbleMatrix() {
  subSelectedBubbles.clear();
  const bubbles = document.querySelectorAll(".bubble");
  bubbles.forEach(bubble => {
    bubble.classList.remove("bubble-selected");
    bubble.classList.remove("bubble-crossed");
    bubble.innerHTML = '';  // Remove any X marks
  });
  updateSubBubbleCounter();
}

/**
 * Initialize bubble matrix on page load for subtraction
 */
function initSubBubbleMatrix() {
  generateSubBubbleMatrix();

  const toggleBtn = document.getElementById("toggleBubbles");
  const resetBtn = document.getElementById("resetBubbles");
  const matrix = document.getElementById("bubbleMatrix");

  // Hide bubble matrix on page load
  if (matrix) {
    matrix.style.display = "none";
    subBubbleMatrixVisible = false;
  }

  // Update button text
  if (toggleBtn) {
    toggleBtn.textContent = "Show Bubbles";
    toggleBtn.onclick = toggleSubBubbleMatrix;
  }

  if (resetBtn) {
    resetBtn.onclick = resetSubBubbleMatrix;
  }
}
