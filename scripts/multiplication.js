/* =========================================================
   MULTIPLICATION MODE - Column-based layout
========================================================= */

let multiplicationSettings = {
    carry: "no",
    digits: 2
};

let multNum1, multNum2;
const multMaxDigits = 3;

/**
 * Convert number into equal-length digit array
 */
function splitDigitsMult(n, length) {
    const digits = String(n).padStart(length, "0").split("");
    return digits.map((d, i) => (i === 0 && d === "0") ? "" : d);
}

/**
 * Popup controls
 */
function openMultPopup() {
    document.getElementById("multPopup").style.display = "flex";
}

function closeMultPopup() {
    document.getElementById("multPopup").style.display = "none";
}

/**
 * Render multiplication columns - supports conventional multi-digit multiplication
 */
function renderMultiplicationColumns() {
    const container = document.getElementById("additionColumns");
    container.innerHTML = "";

    const multiplierDigits = String(multNum2).length;

    // For 1-digit multiplier, use simple format
    if (multiplierDigits === 1) {
        renderSimpleMultiplication();
    } else {
        // For 2-digit multiplier, use conventional format with partial products
        renderConventionalMultiplication();
    }
}

/**
 * Simple multiplication for 1-digit multiplier (e.g., 23 × 4)
 */
function renderSimpleMultiplication() {
    const container = document.getElementById("additionColumns");
    const len = multMaxDigits;
    const d1 = splitDigitsMult(multNum1, len);
    const d2 = splitDigitsMult(multNum2, len);

    for (let i = 0; i < len; i++) {
        const col = document.createElement("div");
        col.className = "col";

        const bottomNumber = (i === 0) ? `×${d2[i]}` : d2[i];

        const carryBox = multiplicationSettings.carry === "yes"
            ? `<input class="carry-input" maxlength="1">`
            : `<div class="carry-placeholder"></div>`;

        col.innerHTML = `
        ${carryBox}
        <div class="num1">${d1[i]}</div>
        <div class="num2">${bottomNumber}</div>
        <div class="answer-line"></div>
        <input class="answer-input" maxlength="1" data-pos="${i}" data-row="final">
    `;

        container.appendChild(col);
    }
}

/**
 * Conventional multiplication for 2-digit multiplier with partial products
 * Example: 23 × 12
 *     23
 *   × 12
 *   ----
 *     46  (23 × 2)
 *   23    (23 × 1, shifted left)
 *   ----
 *   276   (final answer)
 */
function renderConventionalMultiplication() {
    const container = document.getElementById("additionColumns");
    container.innerHTML = "";

    // Create a wrapper for the multiplication layout
    const multWrapper = document.createElement("div");
    multWrapper.className = "mult-wrapper";

    // Get digits
    const num1Str = String(multNum1).padStart(2, " ");
    const num2Str = String(multNum2).padStart(2, " ");

    // Display the problem (multiplicand and multiplier)
    const problemDiv = document.createElement("div");
    problemDiv.className = "mult-problem";
    problemDiv.innerHTML = `
        <div class="mult-row">
            <span class="mult-digit">${num1Str[0]}</span>
            <span class="mult-digit">${num1Str[1]}</span>
        </div>
        <div class="mult-row">
            <span class="mult-sign">×</span>
            <span class="mult-digit">${num2Str[0] === ' ' ? '' : num2Str[0]}</span>
            <span class="mult-digit">${num2Str[1]}</span>
        </div>
        <div class="mult-line"></div>
    `;
    multWrapper.appendChild(problemDiv);

    // First partial product (multiply by ones digit)
    const partial1Div = document.createElement("div");
    partial1Div.className = "mult-partial-row";
    const partial1Length = String(multNum1 * (multNum2 % 10)).length;
    let partial1HTML = '<div class="mult-input-row">';
    for (let i = 0; i < Math.max(3, partial1Length); i++) {
        partial1HTML += `<input class="answer-input mult-input" maxlength="1" data-row="partial1" data-pos="${i}">`;
    }
    partial1HTML += '</div>';
    partial1Div.innerHTML = partial1HTML;
    multWrapper.appendChild(partial1Div);

    // Second partial product (multiply by tens digit, shifted left)
    const tensDigit = Math.floor(multNum2 / 10);
    if (tensDigit > 0) {
        const partial2Div = document.createElement("div");
        partial2Div.className = "mult-partial-row mult-shifted";
        const partial2Length = String(multNum1 * tensDigit).length;
        let partial2HTML = '<div class="mult-input-row">';
        for (let i = 0; i < Math.max(3, partial2Length); i++) {
            partial2HTML += `<input class="answer-input mult-input" maxlength="1" data-row="partial2" data-pos="${i}">`;
        }
        partial2HTML += '<span class="mult-placeholder">0</span>'; // Show the shift
        partial2HTML += '</div>';
        partial2Div.innerHTML = partial2HTML;
        multWrapper.appendChild(partial2Div);
    }

    // Line before final answer
    const lineDiv = document.createElement("div");
    lineDiv.className = "mult-line";
    multWrapper.appendChild(lineDiv);

    // Final answer row
    const finalDiv = document.createElement("div");
    finalDiv.className = "mult-final-row";
    const finalLength = String(multNum1 * multNum2).length;
    let finalHTML = '<div class="mult-input-row">';
    for (let i = 0; i < Math.max(4, finalLength); i++) {
        finalHTML += `<input class="answer-input mult-input" maxlength="1" data-row="final" data-pos="${i}">`;
    }
    finalHTML += '</div>';
    finalDiv.innerHTML = finalHTML;
    multWrapper.appendChild(finalDiv);

    container.appendChild(multWrapper);
}

/**
 * Generate multiplication question
 */
function generateMultiplicationQuestion() {
    const d = multiplicationSettings.digits;

    const min = Math.pow(10, d - 1);
    const max = Math.pow(10, d) - 1;

    multNum1 = Math.floor(Math.random() * (max - min + 1)) + min;
    multNum2 = Math.floor(Math.random() * (max - min + 1)) + min;

    if (multiplicationSettings.carry === "no") {
        // For simplicity, keep numbers small to avoid carry
        multNum1 = Math.floor(Math.random() * 9) + 1;
        multNum2 = Math.floor(Math.random() * 9) + 1;
    }

    renderMultiplicationColumns();
    showMessage("");
}

/**
 * Get user answer from inputs - handles both simple and conventional formats
 */
function getMultUserAnswer() {
    const finalInputs = Array.from(
        document.querySelectorAll('.answer-input[data-row="final"]')
    );

    if (finalInputs.length === 0) return 0;

    const digits = finalInputs.map(inp => inp.value || "0");
    return Number(digits.join(""));
}

/**
 * Get partial product answers
 */
function getPartialProducts() {
    const partial1Inputs = Array.from(
        document.querySelectorAll('.answer-input[data-row="partial1"]')
    );
    const partial2Inputs = Array.from(
        document.querySelectorAll('.answer-input[data-row="partial2"]')
    );

    const partial1 = partial1Inputs.length > 0
        ? Number(partial1Inputs.map(inp => inp.value || "0").join(""))
        : null;

    const partial2 = partial2Inputs.length > 0
        ? Number(partial2Inputs.map(inp => inp.value || "0").join(""))
        : null;

    return { partial1, partial2 };
}

/**
 * Check multiplication answer - validates partial products for 2-digit multiplication
 */
function checkMultiplicationAnswer() {
    const correctFinal = multNum1 * multNum2;
    const userFinal = getMultUserAnswer();

    // Check if this is conventional multiplication (2-digit)
    const multiplierDigits = String(multNum2).length;

    if (multiplierDigits === 1) {
        // Simple multiplication - just check final answer
        if (userFinal === correctFinal) {
            showMessage("🎉 Correct! Well done!");
        } else {
            showMessage(`❌ Try again — Correct answer = ${correctFinal}`);
        }
    } else {
        // Conventional multiplication - check partial products
        const { partial1, partial2 } = getPartialProducts();

        const onesDigit = multNum2 % 10;
        const tensDigit = Math.floor(multNum2 / 10);

        const correctPartial1 = multNum1 * onesDigit;
        const correctPartial2 = tensDigit > 0 ? multNum1 * tensDigit : null;

        let errors = [];

        if (partial1 !== null && partial1 !== correctPartial1) {
            errors.push(`First partial product should be ${correctPartial1}`);
        }

        if (partial2 !== null && correctPartial2 !== null && partial2 !== correctPartial2) {
            errors.push(`Second partial product should be ${correctPartial2}`);
        }

        if (userFinal !== correctFinal) {
            errors.push(`Final answer should be ${correctFinal}`);
        }

        if (errors.length === 0) {
            showMessage("🎉 Perfect! All partial products and final answer are correct!");
        } else {
            showMessage(`❌ ${errors.join(". ")}`);
        }
    }
}

/**
 * Next question
 */
function nextMultiplicationQuestion() {
    generateMultiplicationQuestion();
}

/**
 * Setup multiplication controls
 */
function setupMultiplicationControls() {
    document.getElementById("multCancel").onclick = closeMultPopup;

    document.getElementById("multCarryMode").onchange = e =>
        multiplicationSettings.carry = e.target.value;

    document.getElementById("multDigitCount").onchange = e =>
        multiplicationSettings.digits = Number(e.target.value);

    document.getElementById("multApply").onclick = () => {
        closeMultPopup();
        generateMultiplicationQuestion();
    };
}
