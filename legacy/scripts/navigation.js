/* =========================================================
   NAVIGATION SYSTEM - Switch between math modes
========================================================= */

let currentMode = "addition";

function switchToAddition() {
    currentMode = "addition";

    // Close menu popup
    closeMenuPopup();

    // Show addition UI
    const title = document.getElementById("mainTitle");
    if (title) {
        title.textContent = "➕ Addition (Column Method)";
        title.style.display = "block";
    }
    const actionButtons = document.getElementById("mainActionButtons");
    if (actionButtons) actionButtons.style.display = "flex";
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

    // Generate fresh Question!
    if (typeof nextAdditionQuestion === 'function') nextAdditionQuestion();

    // Close any open popups first, then open addition popup
    closeAddPopup();
    closeSubPopup();
    closeMultPopup();
    closeTablePopup();
    if (window.closeFractPopup) window.closeFractPopup();
    if (window.closeFractPopup) window.closeFractPopup();
    if (window.closeFractPopup) window.closeFractPopup();
    if (window.closeFractPopup) window.closeFractPopup();

    // Setup popup controls (must be called before opening popup)
    setupAdditionModeControls();

    // Open popup for addition settings
    openAddPopup();

    if (window.cleanupComparisonUI) window.cleanupComparisonUI();
    if (window.cleanupDivisionUI) window.cleanupDivisionUI();
    if (window.cleanupTimeUI) window.cleanupTimeUI();
    if (window.cleanupFractionsUI) window.cleanupFractionsUI();
    showMessage("");
}

function switchToSubtraction() {
    currentMode = "subtraction";

    // Close menu popup
    closeMenuPopup();

    // Show subtraction UI
    const title = document.getElementById("mainTitle");
    if (title) {
        title.textContent = "➖ Subtraction (Column Method)";
        title.style.display = "block";
    }
    const actionButtons = document.getElementById("mainActionButtons");
    if (actionButtons) actionButtons.style.display = "flex";
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

    // Generate fresh Question!
    if (typeof generateSubQuestion === 'function') generateSubQuestion();

    // Close any open popups first, then open subtraction popup
    closeAddPopup();
    closeSubPopup();
    closeMultPopup();
    closeTablePopup();
    if (window.closeFractPopup) window.closeFractPopup();
    if (window.closeFractPopup) window.closeFractPopup();
    if (window.closeFractPopup) window.closeFractPopup();

    // Setup popup controls (must be called before opening popup)
    setupSubPopupControls();

    // Open popup for subtraction settings
    openSubPopup();

    if (window.cleanupComparisonUI) window.cleanupComparisonUI();
    if (window.cleanupDivisionUI) window.cleanupDivisionUI();
    if (window.cleanupTimeUI) window.cleanupTimeUI();
    if (window.cleanupFractionsUI) window.cleanupFractionsUI();
    showMessage("");
}

function switchToMultiplication() {
    currentMode = "multiplication";

    // Close menu popup
    closeMenuPopup();

    // Show multiplication UI
    const title = document.getElementById("mainTitle");
    if (title) {
        title.textContent = "✖️ Multiplication (Column Method)";
        title.style.display = "block";
    }
    const actionButtons = document.getElementById("mainActionButtons");
    if (actionButtons) actionButtons.style.display = "flex";
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
    if (window.closeFractPopup) window.closeFractPopup();
    if (window.closeFractPopup) window.closeFractPopup();
    if (window.closeFractPopup) window.closeFractPopup();

    // Setup popup controls (must be called before opening popup)
    setupMultiplicationControls();

    // Open popup for multiplication settings
    openMultPopup();

    if (window.cleanupComparisonUI) window.cleanupComparisonUI();
    if (window.cleanupDivisionUI) window.cleanupDivisionUI();
    if (window.cleanupTimeUI) window.cleanupTimeUI();
    if (window.cleanupFractionsUI) window.cleanupFractionsUI();
    showMessage("");
}

function switchToTablePractice() {
    currentMode = "table-practice";

    // Close menu popup
    closeMenuPopup();

    // Show table practice UI
    const title = document.getElementById("mainTitle");
    if (title) {
        title.textContent = "📊 Table Practice";
        title.style.display = "block";
    }
    const actionButtons = document.getElementById("mainActionButtons");
    if (actionButtons) actionButtons.style.display = "flex";
    document.querySelector(".mode-panel").style.display = "none";

    // Update button handlers - Check becomes Check All, Next becomes Reset
    const checkBtn = document.getElementById("checkBtn");
    const nextBtn = document.getElementById("nextBtn");

    checkBtn.textContent = "Check All";
    checkBtn.onclick = checkTableAnswers;

    // Show table practice UI (Reusing addition column container for now)
    const additionBox = document.querySelector(".addition-box");
    if (additionBox) additionBox.style.display = "block";

    document.getElementById("additionColumns").style.display = "flex";

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
    if (window.closeFractPopup) window.closeFractPopup();
    if (window.closeFractPopup) window.closeFractPopup();
    if (window.closeFractPopup) window.closeFractPopup();

    // Setup popup controls (must be called before opening popup)
    setupTablePracticeControls();

    // Open popup for table selection
    openTablePopup();

    if (window.cleanupComparisonUI) window.cleanupComparisonUI();
    if (window.cleanupDivisionUI) window.cleanupDivisionUI();
    if (window.cleanupTimeUI) window.cleanupTimeUI();
    if (window.cleanupFractionsUI) window.cleanupFractionsUI();
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

            // Cleanup ALL modes deeply before switching
            if (window.cleanupDivisionUI) window.cleanupDivisionUI();
            if (window.cleanupComparisonUI) window.cleanupComparisonUI();
            if (window.cleanupTimeUI) window.cleanupTimeUI();
            if (window.cleanupFractionsUI) window.cleanupFractionsUI();
            if (window.closeTablePopup) window.closeTablePopup();

            // Clear main view containers for safety
            const addCols = document.getElementById("additionColumns");
            if (addCols) addCols.innerHTML = "";

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
                switchToDivision();
            } else if (btn.textContent.includes("Time Reading")) {
                switchToTime();
            } else if (btn.textContent.includes("Fractions")) {
                switchToFractions();
            } else if (btn.textContent.includes("Comparison")) {
                switchToComparison();
            }
        };
    });
}

function hideAllMathUI() {
    const title = document.getElementById("mainTitle");
    if (title) title.style.display = "none";

    const panel = document.querySelector('.mode-panel');
    if (panel) panel.style.display = "none";

    const addCols = document.getElementById("additionColumns");
    if (addCols) {
        addCols.style.display = "none";
        // Also clear it to be safe, so it doesn't persist
        addCols.innerHTML = "";
    }

    const bubbleSec = document.querySelector(".bubble-section");
    if (bubbleSec) bubbleSec.style.display = "none";

    const actionButtons = document.getElementById("mainActionButtons");
    if (actionButtons) actionButtons.style.display = "none";

    // Also hide any floating tooltips or comparison areas
    const compArea = document.getElementById("comparisonArea");
    if (compArea) compArea.style.display = "none";
}

function switchToComparison() {
    currentMode = "comparison";
    closeMenuPopup();

    // Aggressively hide common UI
    hideAllMathUI();

    // Initialize module
    if (window.initComparison) {
        window.initComparison();
    }

    showMessage("");
}

function switchToDivision() {
    currentMode = "division";
    closeMenuPopup();

    hideAllMathUI();

    // Initialize module
    if (window.initDivision) {
        window.initDivision();
    }

    if (window.cleanupComparisonUI) window.cleanupComparisonUI();
    if (window.cleanupTimeUI) window.cleanupTimeUI();

    showMessage("");
}

function switchToTime() {
    currentMode = "time";
    closeMenuPopup();

    hideAllMathUI();

    // Initialize module
    if (window.initTime) {
        window.initTime();
    }

    if (window.cleanupComparisonUI) window.cleanupComparisonUI();
    if (window.cleanupDivisionUI) window.cleanupDivisionUI();

    showMessage("");
}

function switchToFractions() {
    currentMode = "fractions";
    closeMenuPopup();

    hideAllMathUI();

    // Initialize module
    if (window.initFractions) {
        window.initFractions();
    }

    if (window.cleanupComparisonUI) window.cleanupComparisonUI();
    if (window.cleanupDivisionUI) window.cleanupDivisionUI();
    if (window.cleanupTimeUI) window.cleanupTimeUI();

    // Open Fraction Popup
    if (window.openFractPopup) window.openFractPopup();

    showMessage("");
}
