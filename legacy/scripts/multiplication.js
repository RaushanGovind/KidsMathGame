/* =========================================================
   MULTIPLICATION MODE - Column-based layout
========================================================= */

let multiplicationSettings = {
    carry: "no",
    digits: 2,  // This controls the multiplier (1 or 2 digits)
    digits1: 2  // This controls the multiplicand (1-3 digits)
};

let multNum1, multNum2;
const multMaxDigits = 5;  // Updated to 5 to handle larger products (e.g., 999 × 99 = 98901)

/**
 * Convert number into equal-length digit array
 */
function splitDigitsMult(n, length) {
    const s = String(n);
    const diff = length - s.length;
    const arr = [];
    // Fill leading positions with empty strings
    for (let i = 0; i < diff; i++) {
        arr.push("");
    }
    // Fill remaining positions with the actual digits
    for (let i = 0; i < s.length; i++) {
        arr.push(s[i]);
    }
    return arr;
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
/**
 * Simple multiplication for 1-digit multiplier (e.g., 23 × 4)
 */
function renderSimpleMultiplication() {
    const container = document.getElementById("additionColumns");

    // Calculate answer length to determine how many columns we need
    const answer = multNum1 * multNum2;
    const answerLength = String(answer).length;

    // Use the max length to ensure enough columns for the widest part (question or answer)
    // usually answer is wider or equal to question length + 1
    const totalCols = Math.max(String(multNum1).length, String(multNum2).length + 1, answerLength);

    // Create new D1 and D2 arrays padded to the total column count
    const d1 = splitDigitsMult(multNum1, totalCols);
    const d2 = splitDigitsMult(multNum2, totalCols);

    for (let i = 0; i < totalCols; i++) {
        const col = document.createElement("div");
        col.className = "col";

        const bottomNumber = (i === 0) ? `×${d2[i]}` : d2[i];

        // For simple multiplication, show carry boxes if enabled
        // Only show for columns > 0 (not the ones place) 
        // AND only if it's within the range of the top number's digits (carrying over 100s when top is only 10s is valid though)
        // Let's stick to: show carry if columns > 0.
        const isOneColumn = (i === totalCols - 1);
        const showCarry = multiplicationSettings.carry === "yes" && !isOneColumn;

        const carryBox = showCarry
            ? `<input class="carry-input" maxlength="1" inputmode="numeric" pattern="[0-9]*">`
            : `<div class="carry-placeholder"></div>`;

        // Only show input box if this column position is part of the answer
        // i=0 is the M.S.D (Most Significant Digit) or L.S.D?
        // splitDigitsMult returns [0, 0, 2, 3]. So i=0 is standard reading order (Left).
        // If answer is 92 (length 2), and totalCols is 3 (padding), we have [space, 9, 2].
        // We only want inputs for the last 'answerLength' columns.

        const isAnswerColumn = i >= (totalCols - answerLength);

        let inputHTML = '';
        if (isAnswerColumn) {
            inputHTML = `<input class="answer-input" maxlength="1" data-pos="${i}" data-row="final">`;
        } else {
            // Invisible placeholder to keep alignment if needed, or just nothing
            // border:none makes it invisible but takes space
            inputHTML = `<div class="answer-input" style="visibility:hidden; border:none;"></div>`;
        }

        col.innerHTML = `
        ${carryBox}
        <div class="num1">${d1[i]}</div>
        <div class="num2">${bottomNumber}</div>
        <div class="answer-line"></div>
        ${inputHTML}
    `;

        container.appendChild(col);
    }

    // Add single continuous line above all answer boxes
    const lineDiv = document.createElement("div");
    lineDiv.className = "continuous-answer-line";
    container.appendChild(lineDiv);
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
    const num1Str = String(multNum1);
    const num2Str = String(multNum2).padStart(2, " ");

    // Display the problem (multiplicand and multiplier)
    const problemDiv = document.createElement("div");
    problemDiv.className = "mult-problem";

    // Build first number row dynamically based on length
    let num1HTML = '<div class="mult-row top-row">';
    for (let char of num1Str) {
        num1HTML += `<span class="mult-digit">${char}</span>`;
    }
    num1HTML += '</div>';

    // Build Carry Row (if enabled)
    // We insert it BEFORE the top row.
    if (multiplicationSettings.carry === 'yes') {
        let carryHTML = '<div class="mult-row carry-row">';
        // Add placeholders/inputs. We need one less input than digits
        for (let i = 0; i < num1Str.length; i++) {
            // Last digit (ones place) doesn't catch a carry from a previous column, 
            // BUT in mult, valid carries appear above tens, hundreds etc.
            if (i < num1Str.length - 1) {
                carryHTML += `<input class="carry-input small-carry" maxlength="1" inputmode="numeric" pattern="[0-9]*">`;
            } else {
                carryHTML += `<div class="carry-placeholder"></div>`;
            }
        }
        carryHTML += '</div>';
        problemDiv.innerHTML = carryHTML;
    } else {
        problemDiv.innerHTML = '';
    }

    problemDiv.innerHTML += num1HTML;

    problemDiv.innerHTML += `
        <div class="mult-row bottom-row">
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
    for (let i = 0; i < partial1Length; i++) {
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
        for (let i = 0; i < partial2Length; i++) {
            partial2HTML += `<input class="answer-input mult-input" maxlength="1" data-row="partial2" data-pos="${i}">`;
        }
        partial2HTML += '<span class="mult-placeholder"></span>'; // Show the shift (empty space)
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
    for (let i = 0; i < finalLength; i++) {
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
function checkMultiplicationCarry(n1, n2) {
    const s1 = String(n1);
    const s2 = String(n2);

    // For 2-digit multiplier, simplistic check: if any digit product >= 10, true
    // This is stricter than necessary but safe for "No Carry"
    for (let c2 of s2) {
        let carry = 0;
        for (let i = s1.length - 1; i >= 0; i--) {
            const digit1 = parseInt(s1[i]);
            const digit2 = parseInt(c2);
            const product = digit1 * digit2 + carry;
            if (product >= 10) return true;
            carry = Math.floor(product / 10);
        }
        if (carry > 0) return true;
    }

    // Also check sum of partials if multi-digit? 
    // Usually "No Carry" for multip digit just refers to the multiplication step.
    return false;
}

function generateMultiplicationQuestion() {
    const d1 = multiplicationSettings.digits1;  // Multiplicand digits
    const d2 = multiplicationSettings.digits;   // Multiplier digits

    const min1 = Math.pow(10, d1 - 1);
    const max1 = Math.pow(10, d1) - 1;

    const min2 = Math.pow(10, d2 - 1);
    const max2 = Math.pow(10, d2) - 1;

    let attempts = 0;
    do {
        attempts++;
        multNum1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
        multNum2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;

        if (multiplicationSettings.carry === 'yes') break; // Accept any if carry allowed

        // If no carry, check
        if (!checkMultiplicationCarry(multNum1, multNum2)) break;

    } while (attempts < 50);

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
        showResultFeedback(userFinal === correctFinal);
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
            showResultFeedback(true);
        } else {
            showResultFeedback(false);
            showMessage(`❌ ${errors[0]}`);
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

    // Handle toggle buttons for carry mode
    const toggleBtns = document.querySelectorAll('#multPopup .toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            multiplicationSettings.carry = btn.dataset.carry;
            console.log("Mult carry mode:", multiplicationSettings.carry);
        });
    });

    // Handle quick select buttons
    const selectBtns = document.querySelectorAll('.mult-select-btn');
    selectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update settings
            multiplicationSettings.digits1 = parseInt(btn.dataset.d1);
            multiplicationSettings.digits = parseInt(btn.dataset.d2);

            console.log("Mult settings:", multiplicationSettings);

            closeMultPopup();
            generateMultiplicationQuestion();
        });
    });
}
