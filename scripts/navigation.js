/* =========================================================
   NAVIGATION SYSTEM - Switch between math modes
========================================================= */

let currentMode = "addition";

function switchToAddition() {
    currentMode = "addition";

    // Close menu popup
    closeMenuPopup();

    // Show addition UI
    document.querySelector(".game-box h2").textContent = "➕ Addition (Column Method)";
    document.querySelector(".mode-panel").style.display = "none";

    // Reset button text
    document.getElementById("checkBtn").textContent = "Check Answer";
    document.getElementById("nextBtn").textContent = "Next Question";

    // Update button handlers
    document.getElementById("checkBtn").onclick = checkAdditionAnswer;
    document.getElementById("nextBtn").onclick = nextAdditionQuestion;

    // Show bubble section for addition
    const bubbleSection = document.querySelector(".bubble-section");
    if (bubbleSection) {
        bubbleSection.style.display = "block";
    }

    // Initialize addition bubble matrix (2 states)
    if (typeof initBubbleMatrix === 'function') {
        initBubbleMatrix();
    }

    // Close any open popups first, then open addition popup
    closeAddPopup();
    closeSubPopup();
    closeMultPopup();
    closeTablePopup();

    // Setup popup controls (must be called before opening popup)
    setupAdditionModeControls();

    // Open popup for addition settings
    openAddPopup();

    showMessage("");
}

function switchToSubtraction() {
    currentMode = "subtraction";

    // Close menu popup
    closeMenuPopup();

    // Show subtraction UI
    document.querySelector(".game-box h2").textContent = "➖ Subtraction (Column Method)";
    document.querySelector(".mode-panel").style.display = "none";

    // Reset button text
    document.getElementById("checkBtn").textContent = "Check Answer";
    document.getElementById("nextBtn").textContent = "Next Question";

    // Update button handlers
    document.getElementById("checkBtn").onclick = checkSubAnswer;
    document.getElementById("nextBtn").onclick = generateSubQuestion;

    // Show bubble section for subtraction
    const bubbleSection = document.querySelector(".bubble-section");
    if (bubbleSection) {
        bubbleSection.style.display = "block";
    }

    // Initialize subtraction bubble matrix (3 states)
    if (typeof initSubBubbleMatrix === 'function') {
        initSubBubbleMatrix();
    }

    // Close any open popups first, then open subtraction popup
    closeAddPopup();
    closeSubPopup();
    closeMultPopup();
    closeTablePopup();

    // Setup popup controls (must be called before opening popup)
    setupSubPopupControls();

    // Open popup for subtraction settings
    openSubPopup();

    showMessage("");
}

function switchToMultiplication() {
    currentMode = "multiplication";

    // Close menu popup
    closeMenuPopup();

    // Show multiplication UI
    document.querySelector(".game-box h2").textContent = "✖️ Multiplication (Column Method)";
    document.querySelector(".mode-panel").style.display = "none";

    // Reset button text
    document.getElementById("checkBtn").textContent = "Check Answer";
    document.getElementById("nextBtn").textContent = "Next Question";

    // Update button handlers
    document.getElementById("checkBtn").onclick = checkMultiplicationAnswer;
    document.getElementById("nextBtn").onclick = nextMultiplicationQuestion;

    // Hide bubble section for multiplication
    const bubbleSection = document.querySelector(".bubble-section");
    if (bubbleSection) {
        bubbleSection.style.display = "none";
    }

    // Close any open popups first, then open multiplication popup
    closeAddPopup();
    closeSubPopup();
    closeMultPopup();
    closeTablePopup();

    // Setup popup controls (must be called before opening popup)
    setupMultiplicationControls();

    // Open popup for multiplication settings
    openMultPopup();

    showMessage("");
}

function switchToTablePractice() {
    currentMode = "table-practice";

    // Close menu popup
    closeMenuPopup();

    // Show table practice UI
    document.querySelector(".game-box h2").textContent = "📊 Table Practice";
    document.querySelector(".mode-panel").style.display = "none";

    // Update button handlers - Check becomes Check All, Next becomes Reset
    const checkBtn = document.getElementById("checkBtn");
    const nextBtn = document.getElementById("nextBtn");

    checkBtn.textContent = "Check All";
    checkBtn.onclick = checkTableAnswers;

    nextBtn.textContent = "Reset";
    nextBtn.onclick = resetTablePractice;

    // Hide bubble section for table practice
    const bubbleSection = document.querySelector(".bubble-section");
    if (bubbleSection) {
        bubbleSection.style.display = "none";
    }

    // Close any open popups first, then open table popup
    closeAddPopup();
    closeSubPopup();
    closeMultPopup();
    closeTablePopup();

    // Setup popup controls (must be called before opening popup)
    setupTablePracticeControls();

    // Open popup for table selection
    openTablePopup();

    showMessage("");
}

function setupNavButtons() {
    const buttons = document.querySelectorAll(".nav-btn");

    buttons.forEach(btn => {
        btn.onclick = () => {
            // Update active state
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Reset button text when switching modes
            document.getElementById("checkBtn").textContent = "Check Answer";
            document.getElementById("nextBtn").textContent = "Next Question";

            // Switch mode based on button text
            if (btn.textContent.includes("Addition")) {
                switchToAddition();
            } else if (btn.textContent.includes("Subtraction")) {
                switchToSubtraction();
            } else if (btn.textContent.includes("Multiplication")) {
                switchToMultiplication();
            } else if (btn.textContent.includes("Table Practice")) {
                switchToTablePractice();
            } else if (btn.textContent.includes("Division")) {
                showMessage("🚧 Division mode coming soon!");
            }
        };
    });
}
