/* =========================================================
   MENU POPUP CONTROLS
========================================================= */

/**
 * Open menu popup
 */
function openMenuPopup() {
    document.getElementById("menuPopup").style.display = "flex";
}

/**
 * Close menu popup
 */
function closeMenuPopup() {
    document.getElementById("menuPopup").style.display = "none";
}

/**
 * Setup menu controls
 */
function setupMenuControls() {
    console.log("Setting up menu controls...");

    const menuBtn = document.getElementById("menuBtn");
    const menuClose = document.getElementById("menuClose");
    const menuSettingsBtn = document.getElementById("menuSettingsBtn");

    console.log("menuBtn:", menuBtn);
    console.log("menuClose:", menuClose);

    if (!menuBtn) {
        console.error("Menu button not found!");
        return;
    }

    // Menu button opens popup
    menuBtn.onclick = openMenuPopup;
    console.log("Menu button onclick set:", menuBtn.onclick);

    // Close button closes popup
    if (menuClose) {
        menuClose.onclick = closeMenuPopup;
    }

    // Menu option buttons
    const menuOptions = document.querySelectorAll(".menu-option-btn[data-mode]");
    console.log("Found menu options:", menuOptions.length);

    menuOptions.forEach(btn => {
        btn.onclick = () => {
            const mode = btn.dataset.mode;
            closeMenuPopup();

            // Switch to selected mode
            if (mode === "addition") {
                switchToAddition();
            } else if (mode === "subtraction") {
                switchToSubtraction();
            } else if (mode === "multiplication") {
                switchToMultiplication();
            } else if (mode === "table") {
                switchToTablePractice();
            } else if (mode === "comparison") {
                switchToComparison();
            } else if (mode === "time") {
                switchToTime();
            } else if (mode === "fractions") {
                switchToFractions();
            } else if (mode === "division") {
                switchToDivision();
            }
        };
    });

    // Settings button in menu
    if (menuSettingsBtn) {
        menuSettingsBtn.onclick = () => {
            closeMenuPopup();
            openSettingsPanel();
        };
    }

    console.log("Menu controls setup complete!");
}
