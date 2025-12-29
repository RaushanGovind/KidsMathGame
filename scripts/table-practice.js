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
 * Render table practice questions
 */
function renderTablePractice() {
    const container = document.getElementById("additionColumns");
    container.innerHTML = "";

    const tableNum = tableSettings.tableNumber;

    // Create a vertical list of table questions (1 to 10)
    const tableContainer = document.createElement("div");
    tableContainer.className = "table-container";

    for (let i = 1; i <= 10; i++) {
        const row = document.createElement("div");
        row.className = "table-row";

        row.innerHTML = `
            <span class="table-question">${tableNum} × ${i} =</span>
            <input class="table-answer" type="number" maxlength="3" data-answer="${tableNum * i}" placeholder="??">
        `;

        tableContainer.appendChild(row);
    }

    container.appendChild(tableContainer);
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
    const inputs = document.querySelectorAll(".table-answer");
    let correct = 0;
    let total = inputs.length;

    inputs.forEach(input => {
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
 * Setup table practice controls
 */
function setupTablePracticeControls() {
    document.getElementById("tableCancel").onclick = closeTablePopup;

    document.getElementById("tableNumber").onchange = e =>
        tableSettings.tableNumber = Number(e.target.value);

    document.getElementById("tableApply").onclick = () => {
        closeTablePopup();
        generateTablePractice();
    };
}
