/* =========================================================
   TABLE PRACTICE MODE - Multiplication Tables
========================================================= */

let tableSettings = {
    tableNumber: 2
};

/**
 * Popup controls
 */
function openTablePopup() {
    document.getElementById("tablePopup").style.display = "flex";
}

function closeTablePopup() {
    document.getElementById("tablePopup").style.display = "none";
}

/**
 * Render table practice with reference table AND practice questions
 */
function renderTablePractice() {
    const container = document.getElementById("additionColumns");
    container.innerHTML = "";

    const tableNum = tableSettings.tableNumber;

    // Create main table container
    const mainContainer = document.createElement("div");
    mainContainer.className = "table-practice-container";

    // Title section
    const title = document.createElement("h2");
    title.className = "table-title";
    title.innerHTML = `🎯 Multiplication Table of <span class="table-number-highlight">${tableNum}</span>`;
    mainContainer.appendChild(title);

    // Colorful reference table (with answers)
    const referenceSection = document.createElement("div");
    referenceSection.className = "table-reference-section";

    const refHeader = document.createElement("h3");
    refHeader.className = "reference-header";
    refHeader.textContent = "📖 Reference Table";
    referenceSection.appendChild(refHeader);

    const tableDisplay = document.createElement("div");
    tableDisplay.className = "table-display-grid";

    for (let i = 1; i <= 10; i++) {
        const row = document.createElement("div");
        row.className = "table-display-row";
        row.innerHTML = `
            <span class="table-num">${tableNum}</span>
            <span class="table-mult">×</span>
            <span class="table-num">${i}</span>
            <span class="table-equals">=</span>
            <span class="table-result">${tableNum * i}</span>
        `;
        tableDisplay.appendChild(row);
    }

    referenceSection.appendChild(tableDisplay);
    mainContainer.appendChild(referenceSection);

    // Practice section header
    const practiceHeader = document.createElement("h3");
    practiceHeader.className = "practice-section-header";
    practiceHeader.textContent = "✏️ Practice Zone - Fill in the answers:";
    mainContainer.appendChild(practiceHeader);

    // Practice questions - simple list format
    const practiceContainer = document.createElement("div");
    practiceContainer.className = "table-practice-list";

    for (let i = 1; i <= 10; i++) {
        const row = document.createElement("div");
        row.className = "table-practice-row";

        row.innerHTML = `
            <span class="practice-question">${tableNum} × ${i} =</span>
            <input class="table-answer-input" inputmode="numeric" pattern="[0-9]*" maxlength="3" data-answer="${tableNum * i}" placeholder="?">
        `;

        practiceContainer.appendChild(row);
    }

    mainContainer.appendChild(practiceContainer);
    container.appendChild(mainContainer);
}


/**
 * Generate table practice
 */
function generateTablePractice() {
    renderTablePractice();
    showMessage("");
}

/**
 * Check all table answers
 */
function checkTableAnswers() {
    const inputs = document.querySelectorAll(".table-answer-input");
    let correct = 0;
    let total = inputs.length;

    inputs.forEach((input, index) => {
        const userAnswer = parseInt(input.value) || 0;
        const correctAnswer = parseInt(input.dataset.answer);

        if (userAnswer === correctAnswer) {
            input.style.backgroundColor = "#d4edda";
            input.style.borderColor = "#28a745";
            correct++;
        } else {
            input.style.backgroundColor = "#f8d7da";
            input.style.borderColor = "#dc3545";
        }
    });

    showMessage(`✅ ${correct} out of ${total} correct!`);
}

/**
 * Reset table practice (clear answers)
 */
function resetTablePractice() {
    const inputs = document.querySelectorAll(".table-answer");
    inputs.forEach(input => {
        input.value = "";
        input.style.backgroundColor = "";
        input.style.borderColor = "";
    });
    showMessage("");
}

/**
 * Check all table answers
 */
function checkTableAnswers() {
    const inputs = document.querySelectorAll(".table-answer-input");
    let correct = 0;
    let total = inputs.length;

    inputs.forEach((input, index) => {
        const userAnswer = parseInt(input.value) || 0;
        const correctAnswer = parseInt(input.dataset.answer);
        const row = input.closest(".table-practice-row");

        if (userAnswer === correctAnswer) {
            row.classList.add("correct");
            row.classList.remove("incorrect");
            input.style.backgroundColor = "#d4edda";
            input.style.borderColor = "#28a745";
            correct++;
        } else {
            row.classList.add("incorrect");
            row.classList.remove("correct");
            input.style.backgroundColor = "#f8d7da";
            input.style.borderColor = "#dc3545";
        }
    });

    showMessage(`✅ ${correct} out of ${total} correct!`);
}

/**
 * Reset table practice (clear answers)
 */
function resetTablePractice() {
    const inputs = document.querySelectorAll(".table-answer-input");
    inputs.forEach(input => {
        input.value = "";
        input.style.backgroundColor = "";
        input.style.borderColor = "";
        const row = input.closest(".table-practice-row");
        if (row) {
            row.classList.remove("correct", "incorrect");
        }
    });
    showMessage("");
}

/**
 * Setup table practice controls and generate grid selector
 */
function setupTablePracticeControls() {
    document.getElementById("tableCancel").onclick = closeTablePopup;

    // Generate colorful grid selector (1-20)
    const gridContainer = document.querySelector(".table-grid-selector");
    if (gridContainer) {
        gridContainer.innerHTML = "";

        for (let num = 1; num <= 20; num++) {
            const btn = document.createElement("button");
            btn.className = "table-num-btn";
            btn.textContent = num;
            btn.dataset.table = num;

            btn.addEventListener("click", () => {
                tableSettings.tableNumber = num;
                console.log(`Selected table: ${num}`);
                closeTablePopup();
                generateTablePractice();
            });

            gridContainer.appendChild(btn);
        }
    }
}
