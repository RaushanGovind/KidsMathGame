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

  document.getElementById("subBorrowMode").onchange = e =>
    subSettings.borrow = e.target.value;

  document.getElementById("subDigitCount").onchange = e =>
    subSettings.digits = Number(e.target.value);

  document.getElementById("subRowCount").onchange = e =>
    subSettings.rows = Number(e.target.value);

  document.getElementById("subApply").onclick = () => {
    closeSubPopup();
    generateSubQuestion();
  };
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

  const d1 = splitDigitsAligned(subNum1, len);
  const d2 = splitDigitsAligned(subNum2, len);

  for (let i = 0; i < len; i++) {

    const col = document.createElement("div");
    col.className = "col";

    // leftmost column → show minus sign
    const bottom = (i === 0)
      ? `-${d2[i]}`
      : d2[i];

    // Only show borrow box if borrow mode is enabled
    const borrowBox = subSettings.borrow === "yes"
      ? `<input class="carry-input" maxlength="1">`
      : `<div class="carry-placeholder"></div>`;

    col.innerHTML = `
      <!-- Borrow box (conditional) -->
      ${borrowBox}

      <!-- Top number -->
      <div class="num1">${d1[i]}</div>

      <!-- Bottom number with - on first column -->
      <div class="num2">${bottom}</div>

      <!-- Horizontal line before answer -->
      <div class="answer-line"></div>

      <!-- Answer digit -->
      <input class="answer-input" maxlength="1" data-pos="${i}">
    `;

    colBox.appendChild(col);
  }
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

  const correct = subNum1 - subNum2;
  const user = getSubUserAnswer();

  alert(user === correct ?
    "🎉 Correct!" :
    "❌ Try again — Answer = " + correct);
}
