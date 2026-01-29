/* =========================================================
   TABLE PRACTICE MODE
   Supports: Practice (Input) and Reading (Reveal + Voice)
========================================================= */

let tableSettings = {
    tableNumber: 2,
    mode: 'practice', // 'practice' or 'reading'
    currentIndex: 0,
    answers: new Array(10).fill("") // Store user answers
};

function setTableMode(mode) {
    tableSettings.mode = mode;
    console.log("Mode set to:", mode);
}

/**
 * Popup controls
 */
function openTablePopup() {
    const popup = document.getElementById("tablePopup");
    if (popup) popup.style.display = "flex";

    // Sync radio buttons with current state
    const radios = document.getElementsByName('tableMode');
    radios.forEach(r => {
        if (r.value === tableSettings.mode) r.checked = true;
    });
}

function closeTablePopup() {
    const popup = document.getElementById("tablePopup");
    if (popup) popup.style.display = "none";
}

/**
 * Generate table practice based on current mode
 */
function generateTablePractice() {
    // 1. Hide conflicting UIs
    if (window.cleanupTimeUI) window.cleanupTimeUI();

    // 2. Ensure Main Container is Visible
    const colContainer = document.getElementById("additionColumns");
    if (colContainer) colContainer.style.display = "flex";

    // 3. Update Mode from Radio (Source of Truth)
    const radio = document.querySelector('input[name="tableMode"]:checked');
    if (radio) tableSettings.mode = radio.value;

    // Reset state for new table/session
    tableSettings.currentIndex = 0;
    tableSettings.answers = new Array(10).fill("");

    console.log(`Generating Table: ${tableSettings.tableNumber} in ${tableSettings.mode} mode`);

    // 4. Render
    renderCurrentTablePage();

    // 5. Clear messages
    showMessage("");
}

/**
 * Render the current page (question)
 */
function renderCurrentTablePage() {
    if (tableSettings.mode === 'reading') {
        renderTableReading(); // Reading might remain list or paged? User asked for "complete one question", usually practice.
        // Let's paginate reading too for consistency, or keep it list if user prefers.
        // Reading is passive. "complete one question" implies input. 
        // I will keep reading as list for now unless requested, or paginate if easy.
        // Actually, let's keep Reading as LIST because it's for memorization.
        // Re-reading the code above, I see I replaced the whole file content helper.
        // So I must include renderTableReading content here.
    } else {
        renderTablePracticePaged();
    }
}


/**
 * RENDER: Table Reading Mode (List View - kept as referencing standard)
 */
function renderTableReading() {
    const container = document.getElementById("additionColumns");
    if (!container) return;
    container.innerHTML = "";

    const tableNum = tableSettings.tableNumber;

    const mainContainer = document.createElement("div");
    mainContainer.className = "table-practice-container";

    // Top Controls
    addChangeTableButton(mainContainer);

    // Title
    const title = document.createElement("h2");
    title.className = "table-title";
    title.innerHTML = `📖 Reading: <span class="table-number-highlight">${tableNum}</span>`;
    mainContainer.appendChild(title);

    // List
    const list = document.createElement("div");
    list.className = "table-practice-list";

    for (let i = 1; i <= 10; i++) {
        const row = document.createElement("div");
        row.className = "table-practice-row reading-row";
        const res = tableNum * i;

        row.innerHTML = `
            <span class="practice-question">
                <span class="num-chocolate">${tableNum}</span>
                <span class="operator">×</span>
                <span class="num-chocolate">${i}</span>
                <span class="operator">=</span>
            </span>
            <div class="table-reading-result hidden" data-value="${res}" onclick="revealResult(this)">
                <span>${res}</span>
            </div>
        `;
        list.appendChild(row);
    }

    mainContainer.appendChild(list);
    container.appendChild(mainContainer);
}

/**
 * RENDER: Practice Mode (PAGINATED)
 */
function renderTablePracticePaged() {
    const container = document.getElementById("additionColumns");
    if (!container) return;
    container.innerHTML = "";

    const tableNum = tableSettings.tableNumber;
    const idx = tableSettings.currentIndex;
    const currentNum = idx + 1;

    const mainContainer = document.createElement("div");
    mainContainer.className = "table-practice-container";

    // Top Controls
    addChangeTableButton(mainContainer);

    // Title
    const title = document.createElement("h2");
    title.className = "table-title";
    title.innerHTML = `🎯 Practice: <span class="table-number-highlight">${tableNum}</span>`;
    mainContainer.appendChild(title);

    // Progress
    const progress = document.createElement("div");
    progress.style.marginBottom = "15px";
    progress.style.color = "#666";
    progress.style.fontWeight = "bold";
    progress.innerText = `Question ${currentNum} of 10`;
    mainContainer.appendChild(progress);

    // Single Question Row
    const practiceContainer = document.createElement("div");
    practiceContainer.className = "table-practice-list single-view"; // Add single-view class for styling if needed

    const row = document.createElement("div");
    row.className = "table-practice-row large-row"; // Larger for single view

    const savedAns = tableSettings.answers[idx];

    row.innerHTML = `
        <span class="practice-question">
            <span class="num-chocolate">${tableNum}</span>
            <span class="operator">×</span>
            <span class="num-chocolate">${currentNum}</span>
            <span class="operator">=</span>
        </span>
        <input class="table-answer-input large-input" type="tel" pattern="[0-9]*" maxlength="3" 
            data-answer="${tableNum * currentNum}" 
            value="${savedAns}"
            oninput="handleTableInput(this, ${idx})"
            id="currentTableInput">
    `;

    practiceContainer.appendChild(row);
    mainContainer.appendChild(practiceContainer);

    // Navigation Controls
    const navDiv = document.createElement("div");
    navDiv.className = "table-nav-controls";
    navDiv.style.display = "flex";
    navDiv.style.gap = "15px";
    navDiv.style.justifyContent = "center";
    navDiv.style.marginTop = "20px";

    // Prev Button
    const prevBtn = document.createElement("button");
    prevBtn.className = "action-btn nav-btn";
    prevBtn.innerText = "⬅ Previous";
    prevBtn.disabled = (idx === 0);
    prevBtn.onclick = () => {
        if (idx > 0) {
            tableSettings.currentIndex--;
            renderTablePracticePaged();
        }
    };
    if (idx === 0) prevBtn.style.opacity = "0.5";

    // Check Button (Current)
    const checkBtn = document.createElement("button");
    checkBtn.className = "action-btn";
    checkBtn.innerText = "Check ✅";
    checkBtn.onclick = () => checkCurrentTableAnswer();

    // Next Button
    const nextBtn = document.createElement("button");
    nextBtn.className = "action-btn nav-btn";
    nextBtn.innerText = "Next ➡";
    nextBtn.disabled = (idx === 9);
    nextBtn.onclick = () => {
        if (idx < 9) {
            tableSettings.currentIndex++;
            renderTablePracticePaged();
        }
    };
    if (idx === 9) nextBtn.style.opacity = "0.5";

    navDiv.appendChild(prevBtn);
    navDiv.appendChild(checkBtn);
    navDiv.appendChild(nextBtn);

    mainContainer.appendChild(navDiv);

    container.appendChild(mainContainer);

    // Auto-focus input
    setTimeout(() => {
        const inp = document.getElementById("currentTableInput");
        if (inp) inp.focus();
    }, 100);
}

function handleTableInput(el, idx) {
    tableSettings.answers[idx] = el.value;
    speakInput(el);
}

/**
 * Helper: Add "Change Table" button
 */
function addChangeTableButton(parent) {
    const ctrlPanel = document.createElement('div');
    ctrlPanel.style.marginBottom = '15px';

    const changeBtn = document.createElement('button');
    changeBtn.className = 'action-btn';
    changeBtn.style.background = '#FF9800';
    changeBtn.innerText = '🔄 Change Table';
    changeBtn.onclick = openTablePopup;

    ctrlPanel.appendChild(changeBtn);

    parent.appendChild(ctrlPanel);
}

/**
 * Logic: Reveal Result & Speak
 */
function revealResult(el) {
    if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        el.classList.add('revealed');
        if (window.playSound) window.playSound('pop');
    }
    // Always speak when clicked (reveal or re-click)
    const val = el.dataset.value;
    speakTableNumber(val);
}

/**
 * Logic: Check Single Answer
 */
function checkCurrentTableAnswer() {
    const input = document.getElementById("currentTableInput");
    if (!input) return;

    const userAnswer = parseInt(input.value) || 0;
    const correctAnswer = parseInt(input.dataset.answer);
    const row = input.closest(".table-practice-row");

    if (userAnswer === correctAnswer) {
        row.classList.add("correct");
        row.classList.remove("incorrect");
        input.style.backgroundColor = "#d4edda";
        input.style.borderColor = "#28a745";

        if (window.showResultFeedback) showResultFeedback(true);
        showMessage("Correct! Great job! 🎉");

        // Optional: Auto-next after success? 
        // User asked for manual buttons, but auto-next is nice. 
        // Let's stick to manual to let them see the success state.
    } else {
        row.classList.add("incorrect");
        row.classList.remove("correct");
        input.style.backgroundColor = "#f8d7da";
        input.style.borderColor = "#dc3545";

        if (window.showResultFeedback) showResultFeedback(false);
        showMessage("Try again! You can do it!");
    }
}

/**
 * Logic: Check All Answers (Legacy / Summary)
 */
function checkTableAnswers() {
    // Kept for backward compat if needed, but not used in new UI
}

function resetTablePractice() {
    tableSettings.currentIndex = 0;
    tableSettings.answers.fill("");
    generateTablePractice();
}

function speakTableNumber(num) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(num.toString());
        msg.rate = 1.0;
        msg.pitch = 1.1;
        window.speechSynthesis.speak(msg);
    }
}

function speakInput(el) {
    const val = el.value;
    if (val.length > 0) {
        speakTableNumber(val);
    }
}

/**
 * SETUP
 */
function setupTablePracticeControls() {
    const cancelBtn = document.getElementById("tableCancel");
    if (cancelBtn) cancelBtn.onclick = closeTablePopup;

    const gridContainer = document.querySelector(".table-grid-selector");
    if (gridContainer) {
        gridContainer.innerHTML = "";
        for (let num = 1; num <= 20; num++) {
            const btn = document.createElement("button");
            btn.className = "table-num-btn";
            btn.textContent = num;
            btn.addEventListener("click", () => {
                tableSettings.tableNumber = num;
                // Mode is checked inside generateTablePractice
                closeTablePopup();
                generateTablePractice();
            });
            gridContainer.appendChild(btn);
        }
    }
}

// Export Global
window.setupTablePracticeControls = setupTablePracticeControls;
window.setTableMode = setTableMode;
window.revealResult = revealResult;
window.generateTablePractice = generateTablePractice;
window.checkTableAnswers = checkTableAnswers;
window.resetTablePractice = resetTablePractice;
window.openTablePopup = openTablePopup;
window.closeTablePopup = closeTablePopup;
window.speakInput = speakInput;
function closeTablePopup() {
    const popup = document.getElementById("tablePopup");
    if (popup) popup.style.display = "none";
}

/**
 * Generate table practice based on current mode
 */
function generateTablePractice() {
    // 1. Hide conflicting UIs
    if (window.cleanupTimeUI) window.cleanupTimeUI();

    // 2. Ensure Main Container is Visible
    const colContainer = document.getElementById("additionColumns");
    if (colContainer) colContainer.style.display = "flex";

    // 3. Update Mode from Radio (Source of Truth)
    const radio = document.querySelector('input[name="tableMode"]:checked');
    if (radio) tableSettings.mode = radio.value;

    console.log(`Generating Table: ${tableSettings.tableNumber} in ${tableSettings.mode} mode`);

    // 4. Render
    if (tableSettings.mode === 'reading') {
        renderTableReading();
    } else {
        renderTablePractice();
    }

    // 5. Clear messages
    showMessage("");
}

/**
 * RENDER: Table Reading Mode (Click to Reveal + Voice)
 */
function renderTableReading() {
    const container = document.getElementById("additionColumns");
    if (!container) return;
    container.innerHTML = "";

    const tableNum = tableSettings.tableNumber;

    const mainContainer = document.createElement("div");
    mainContainer.className = "table-practice-container";

    // Top Controls
    addChangeTableButton(mainContainer);

    // Title
    const title = document.createElement("h2");
    title.className = "table-title";
    title.innerHTML = `📖 Reading: <span class="table-number-highlight">${tableNum}</span>`;
    mainContainer.appendChild(title);

    // List
    const list = document.createElement("div");
    list.className = "table-practice-list";

    for (let i = 1; i <= 10; i++) {
        const row = document.createElement("div");
        row.className = "table-practice-row reading-row";
        const res = tableNum * i;

        row.innerHTML = `
            <span class="practice-question">
                <span class="num-chocolate">${tableNum}</span>
                <span class="operator">×</span>
                <span class="num-chocolate">${i}</span>
                <span class="operator">=</span>
            </span>
            <div class="table-reading-result hidden" data-value="${res}" onclick="revealResult(this)">
                <span>${res}</span>
            </div>
        `;
        list.appendChild(row);
    }

    mainContainer.appendChild(list);
    container.appendChild(mainContainer);
}

/**
 * RENDER: Practice Mode (Inputs + Check)
 */
function renderTablePractice() {
    const container = document.getElementById("additionColumns");
    if (!container) return;
    container.innerHTML = "";

    const tableNum = tableSettings.tableNumber;

    const mainContainer = document.createElement("div");
    mainContainer.className = "table-practice-container";

    // Top Controls
    addChangeTableButton(mainContainer);

    // Title
    const title = document.createElement("h2");
    title.className = "table-title";
    title.innerHTML = `🎯 Practice: <span class="table-number-highlight">${tableNum}</span>`;
    mainContainer.appendChild(title);

    // List
    const practiceContainer = document.createElement("div");
    practiceContainer.className = "table-practice-list";

    for (let i = 1; i <= 10; i++) {
        const row = document.createElement("div");
        row.className = "table-practice-row";

        row.innerHTML = `
            <span class="practice-question">
                <span class="num-chocolate">${tableNum}</span>
                <span class="operator">×</span>
                <span class="num-chocolate">${i}</span>
                <span class="operator">=</span>
            </span>
            <input class="table-answer-input" type="tel" pattern="[0-9]*" maxlength="3" data-answer="${tableNum * i}" oninput="speakInput(this)">
        `;

        practiceContainer.appendChild(row);
    }

    mainContainer.appendChild(practiceContainer);

    // Check Button inside container
    const checkBtn = document.createElement('button');
    checkBtn.className = 'action-btn';
    checkBtn.style.marginTop = '20px';
    checkBtn.innerText = 'Check Answers';
    checkBtn.onclick = checkTableAnswers;
    mainContainer.appendChild(checkBtn);

    container.appendChild(mainContainer);
}

/**
 * Helper: Add "Change Table" button
 */
function addChangeTableButton(parent) {
    const ctrlPanel = document.createElement('div');
    ctrlPanel.style.marginBottom = '15px';

    const changeBtn = document.createElement('button');
    changeBtn.className = 'action-btn';
    changeBtn.style.background = '#FF9800';
    changeBtn.innerText = '🔄 Change Table';
    changeBtn.onclick = openTablePopup;

    ctrlPanel.appendChild(changeBtn);

    parent.appendChild(ctrlPanel);
}

/**
 * Logic: Reveal Result & Speak
 */
function revealResult(el) {
    if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        el.classList.add('revealed');
        if (window.playSound) window.playSound('pop');
    }
    // Always speak when clicked (reveal or re-click)
    const val = el.dataset.value;
    speakTableNumber(val);
}

/**
 * Logic: Check Answers (Practice Mode)
 */
function checkTableAnswers() {
    const inputs = document.querySelectorAll(".table-answer-input");
    if (inputs.length === 0) return; // Reading mode doesn't check

    let correct = 0;
    let total = inputs.length;

    inputs.forEach((input) => {
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

    if (correct === total) {
        if (window.showResultFeedback) showResultFeedback(true);
        showMessage("🎉 Perfect! All answers correct!");
    } else {
        if (window.showResultFeedback) showResultFeedback(false);
        showMessage(`✅ ${correct} out of ${total} correct! Keep practicing!`);
    }
}

function resetTablePractice() {
    const inputs = document.querySelectorAll(".table-answer-input");
    inputs.forEach(input => {
        input.value = "";
        input.style.backgroundColor = "";
        input.style.borderColor = "";
        const row = input.closest(".table-practice-row");
        if (row) row.classList.remove("correct", "incorrect");
    });
    showMessage("");
}

function speakTableNumber(num) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(num.toString());
        msg.rate = 1.0;
        msg.pitch = 1.1;
        window.speechSynthesis.speak(msg);
    }
}

function speakInput(el) {
    const val = el.value;
    if (val.length > 0) {
        speakTableNumber(val);
    }
}

/**
 * SETUP
 */
function setupTablePracticeControls() {
    const cancelBtn = document.getElementById("tableCancel");
    if (cancelBtn) cancelBtn.onclick = closeTablePopup;

    const gridContainer = document.querySelector(".table-grid-selector");
    if (gridContainer) {
        gridContainer.innerHTML = "";
        for (let num = 1; num <= 20; num++) {
            const btn = document.createElement("button");
            btn.className = "table-num-btn";
            btn.textContent = num;
            btn.addEventListener("click", () => {
                tableSettings.tableNumber = num;
                // Mode is checked inside generateTablePractice
                closeTablePopup();
                generateTablePractice();
            });
            gridContainer.appendChild(btn);
        }
    }
}

// Export Global
window.setupTablePracticeControls = setupTablePracticeControls;
window.setTableMode = setTableMode;
window.revealResult = revealResult;
window.generateTablePractice = generateTablePractice;
window.checkTableAnswers = checkTableAnswers;
window.resetTablePractice = resetTablePractice;
window.openTablePopup = openTablePopup;
window.closeTablePopup = closeTablePopup;
window.speakInput = speakInput;
