/* =========================================================
   MENU POPUP CONTROLS
========================================================= */

/**
 * Open menu popup
 */
function openMenuPopup() {
    updateMenuVisibility();
    document.getElementById("menuPopup").style.display = "flex";
}

function updateMenuVisibility() {
    if (typeof AgeManager !== 'undefined') {
        const allowed = AgeManager.getAllowedModes();
        const buttons = document.querySelectorAll(".menu-option-btn[data-mode]");

        // Update Age Label Display
        const ageDisplay = document.getElementById("currentAgeDisplay");
        const ageText = document.getElementById("ageLabelText");

        if (ageDisplay && ageText && AgeManager.selectedAge) {
            const stage = AgeManager.stages[AgeManager.selectedAge];
            if (stage) {
                ageText.innerHTML = `${stage.icon} Profile: ${stage.label}`;
                ageDisplay.style.display = "block";

                // Allow clicking to change
                ageDisplay.onclick = () => {
                    closeMenuPopup();
                    // Reset and show selector
                    if (typeof AgeManager !== 'undefined') {
                        localStorage.removeItem('kidsMath_ageGroup');
                        AgeManager.selectedAge = null;
                        AgeManager.showSelectionScreen();
                    }
                };
                ageDisplay.style.cursor = "pointer";
                ageDisplay.title = "Click to change profile";
            }
        }

        buttons.forEach(btn => {
            const mode = btn.dataset.mode;
            if (allowed.includes('all') || allowed.includes(mode)) {
                btn.style.display = "flex";
            } else {
                btn.style.display = "none";
            }
        });
    }
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
            } else if (mode === "toddler") {
                switchToToddler();
            } else if (mode === "preschool") {
                switchToPreschool();
            } else if (mode === "division") {
                switchToDivision();
            } else if (mode === "school") {
                switchToSchool();
            } else if (mode === "concept") {
                switchToConcept();
            } else if (mode === "preteen") {
                switchToPreteen();
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

    // Age button in menu
    const menuAgeBtn = document.getElementById("menuAgeBtn");
    if (menuAgeBtn) {
        menuAgeBtn.onclick = () => {
            closeMenuPopup();
            // Reset and show selector
            if (typeof AgeManager !== 'undefined') {
                localStorage.removeItem('kidsMath_ageGroup');
                AgeManager.selectedAge = null;
                AgeManager.showSelectionScreen();
            }
        };
    }

    console.log("Menu controls setup complete!");
}
