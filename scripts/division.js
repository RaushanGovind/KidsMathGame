/* =========================================================
   LONG DIVISION - BOX STYLE INTERACTIVE
========================================================= */

let divState = {
    divisor: 3,
    dividend: 124,
    dividendStr: "124",
    quotient: "",
    remainder: 0,
    currentStep: "QUOTIENT", // QUOTIENT, PRODUCT, SUBTRACT, BRING_DOWN
    activePointer: 0, // index in dividend
    currentGroup: "", // number being divided currently
    currentDigit: 0, // correctly guessed digit for current step
    steps: [] // list of rows for the work area
};

function initDivisionMode() {
    console.log("Initializing Box Division Mode...");
    const wrapper = document.getElementById("divisionArea");

    // Hide standard components
    const columns = document.getElementById("additionColumns");
    if (columns) columns.style.display = "none";
    const bubbleSection = document.querySelector(".bubble-section");
    if (bubbleSection) bubbleSection.style.display = "none";
    const compArea = document.getElementById("comparisonArea");
    if (compArea) compArea.style.display = "none";

    wrapper.style.display = "flex";

    startNewDivisionProblem();
}

/**
 * Cleanup for other modes
 */
function cleanupDivisionUI() {
    const wrapper = document.getElementById("divisionArea");
    if (wrapper) wrapper.style.display = "none";
}

function startNewDivisionProblem() {
    divState.divisor = Math.floor(Math.random() * 7) + 2; // 2-8
    divState.dividend = Math.floor(Math.random() * 800) + 100; // 100-899
    divState.dividendStr = String(divState.dividend);
    divState.quotient = "";
    divState.activePointer = 0;
    divState.currentGroup = "";
    divState.steps = [];
    divState.currentStep = "QUOTIENT";

    // Initial group setup
    divState.currentGroup = divState.dividendStr[0];
    // If first digit smaller than divisor, take two digits
    if (parseInt(divState.currentGroup) < divState.divisor) {
        divState.activePointer = 1;
        divState.currentGroup = divState.dividendStr.substring(0, 2);
    }

    renderDivision();
}

function renderDivision() {
    const display = document.getElementById("longDivisionDisplay");

    // Header Row: Divisor ) Dividend ( QuotientBoxes
    let html = `
        <div class="div-header-row">
            <div class="div-divisor">${divState.divisor}</div>
            <div class="div-symbol">)</div>
            <div class="div-dividend">${divState.dividendStr}</div>
            <div class="div-symbol">(</div>
            <div class="div-quotient">
                ${renderQuotientBoxes()}
            </div>
        </div>
        <div class="div-work-area">
            ${renderWorkArea()}
        </div>
    `;

    display.innerHTML = html;
    updateGuidance();

    // Auto-focus the next input
    const inputs = document.querySelectorAll('.div-input-box:not(.correct)');
    if (inputs.length > 0) inputs[0].focus();
}

function renderQuotientBoxes() {
    const qLen = Math.floor(divState.dividend / divState.divisor).toString().length;
    let boxes = "";
    for (let i = 0; i < qLen; i++) {
        const val = divState.quotient[i] || "";
        const isCurrent = (i === divState.quotient.length && divState.currentStep === "QUOTIENT");
        boxes += `<input type="text" maxlength="1" 
                    class="div-input-box ${val ? 'correct' : ''} ${isCurrent ? 'active' : ''}" 
                    value="${val}" 
                    oninput="handleDivInput(this, 'quotient', ${i})"
                    ${val ? 'readonly' : ''}>`;
    }
    return boxes;
}

function renderWorkArea() {
    let html = "";
    divState.steps.forEach((step, idx) => {
        html += `<div class="div-step-row">`;
        // Pad with empty spaces for alignment if needed
        step.val.split('').forEach((digit, dIdx) => {
            if (digit === " ") {
                html += `<div style="width: 45px; height: 50px; border: 2px solid transparent;"></div>`;
            } else {
                html += `<input type="text" class="div-input-box correct" value="${digit}" readonly>`;
            }
        });
        html += `</div>`;
        if (step.line) html += `<div class="div-line"></div>`;
    });

    // Active Input for current work step
    if (divState.currentStep === "PRODUCT" || divState.currentStep === "SUBTRACT") {
        html += `<div class="div-step-row">`;
        const expected = getExpectedVal();
        const currentInp = divState.currentWorkInput || "";

        // Add leading empty spaces for alignment based on activePointer
        const indent = divState.activePointer - (expected.length - 1);
        for (let i = 0; i < indent; i++) {
            html += `<div style="width: 45px; height: 50px; border: 2px solid transparent;"></div>`;
        }

        for (let i = 0; i < expected.length; i++) {
            const char = currentInp[i] || "";
            const isCorrect = char === expected[i];
            html += `<input type="text" maxlength="1" 
                        class="div-input-box ${isCorrect ? 'correct' : 'active'}" 
                        value="${char}"
                        oninput="handleDivInput(this, 'work', ${i})"
                        ${isCorrect ? 'readonly' : ''}>`;
        }
        html += `</div>`;
    }

    return html;
}

function getExpectedVal() {
    if (divState.currentStep === "PRODUCT") {
        const lastQ = parseInt(divState.quotient[divState.quotient.length - 1]);
        return (lastQ * divState.divisor).toString();
    }
    if (divState.currentStep === "SUBTRACT") {
        const lastQ = parseInt(divState.quotient[divState.quotient.length - 1]);
        const prod = lastQ * divState.divisor;
        return (parseInt(divState.currentGroup) - prod).toString();
    }
    return "";
}

function handleDivInput(el, type, idx) {
    const val = el.value.trim();
    if (!val) return;

    if (type === 'quotient') {
        const correctDigit = Math.floor(parseInt(divState.currentGroup) / divState.divisor).toString();
        if (val === correctDigit) {
            divState.quotient += val;
            divState.currentStep = "PRODUCT";
            divState.currentWorkInput = "";
            showMessage("Correct Quotient! Now multiply.");
            renderDivision();
        } else {
            el.value = "";
            showMessage("Incorrect. Think again!");
        }
    } else if (type === 'work') {
        const expected = getExpectedVal();
        if (val === expected[idx]) {
            divState.currentWorkInput = (divState.currentWorkInput || "") + val;
            if (divState.currentWorkInput === expected) {
                // Step complete
                if (divState.currentStep === "PRODUCT") {
                    divState.steps.push({ val: expected, line: true });
                    divState.currentStep = "SUBTRACT";
                    divState.currentWorkInput = "";
                    showMessage("Multiplication correct! Now subtract.");
                } else if (divState.currentStep === "SUBTRACT") {
                    divState.steps.push({ val: expected, line: false });
                    checkNextMove(expected);
                }
                renderDivision();
            } else {
                // Move to next box in row
                const row = el.parentElement;
                const next = row.children[idx + 1];
                if (next) next.focus();
            }
        } else {
            el.value = "";
            showMessage("Not quite right. Try again!");
        }
    }
}

function checkNextMove(lastSubResult) {
    if (divState.activePointer < divState.dividendStr.length - 1) {
        divState.activePointer++;
        const nextDigit = divState.dividendStr[divState.activePointer];
        divState.currentGroup = (parseInt(lastSubResult) === 0 ? "" : lastSubResult) + nextDigit;

        // Visual "Bring down" in the steps
        let lastStep = divState.steps[divState.steps.length - 1];
        lastStep.val += "↓"; // Marker for UI
        setTimeout(() => {
            lastStep.val = lastStep.val.replace("↓", nextDigit);
            divState.currentStep = "QUOTIENT";
            showMessage("Bring down " + nextDigit + " and divide again!");
            renderDivision();
        }, 600);
    } else {
        finishDivision(lastSubResult);
    }
}

function updateGuidance() {
    const textEl = document.getElementById("divGuidanceText");
    const hintEl = document.getElementById("divHint");

    switch (divState.currentStep) {
        case "QUOTIENT":
            textEl.textContent = `How many times does ${divState.divisor} go into ${divState.currentGroup}?`;
            hintEl.textContent = `${divState.divisor} × ? = Close to ${divState.currentGroup}`;
            break;
        case "PRODUCT":
            const q = divState.quotient[divState.quotient.length - 1];
            textEl.textContent = `Multiply ${q} × ${divState.divisor}`;
            break;
        case "SUBTRACT":
            textEl.textContent = `Subtract to find what's left!`;
            break;
    }
}

function finishDivision(remainder) {
    divState.currentStep = "FINISHED";
    const textEl = document.getElementById("divGuidanceText");
    textEl.innerHTML = `<span style="color:#28a745">🎉 Excellent!</span><br>
                        Quotient: ${divState.quotient}, Remainder: ${remainder}`;

    const inputArea = document.getElementById("divInputArea");
    inputArea.innerHTML = `<button class="btn-action" onclick="startNewDivisionProblem()">New Problem</button>`;

    showResultFeedback(true);
}

window.switchToDivision = initDivisionMode;
window.cleanupDivisionUI = cleanupDivisionUI;
