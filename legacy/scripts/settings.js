/* =========================================================
   SETTINGS PANEL & THEME CONTROLS
========================================================= */

/**
 * Open settings panel
 */
function openSettingsPanel() {
    const settingsPanel = document.getElementById("settingsPanel");
    if (settingsPanel) {
        settingsPanel.style.right = "0px";
    }
}

/**
 * Close settings panel
 */
function closeSettingsPanel() {
    const settingsPanel = document.getElementById("settingsPanel");
    if (settingsPanel) {
        settingsPanel.style.right = "-350px";
    }
}

function setupSettingsPanel() {

    const settingsPanel = document.getElementById("settingsPanel");
    const closeBtn = document.getElementById("closeSettings");

    // Close settings panel
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            settingsPanel.style.right = "-350px";
        });
    }
}


/* ---------- THEME SWITCH ---------- */

function setupThemeControl() {

    document.getElementById("themeSelect").onchange = function () {

        if (this.value === "dark") {

            document.documentElement.style.setProperty("--bg-color", "#1f2937");
            document.documentElement.style.setProperty("--text-color", "#ffffff");
            document.documentElement.style.setProperty("--panel-color", "#374151");

        } else {

            document.documentElement.style.setProperty("--bg-color", "#ffffff");
            document.documentElement.style.setProperty("--text-color", "#222");
            document.documentElement.style.setProperty("--panel-color", "#f5f5f5");
        }
    };
}


/* ---------- FONT SETTINGS ---------- */

function setupFontControls() {

    // Font family - apply only to question area elements
    document.getElementById("fontSelect").onchange = function () {
        const questionElements = document.querySelectorAll(
            '.num1, .num2, .answer-input, .carry-input, ' +
            '.mult-digit, .mult-input, .mult-sign, ' +
            '.practice-question, .table-answer-input, ' +
            '.num-chocolate, .operator'
        );
        questionElements.forEach(el => {
            el.style.fontFamily = this.value;
        });
    };

    // Font size - apply only to question area elements with live value display
    const fontSizeInput = document.getElementById("fontSizeInput");
    const fontSizeValue = document.getElementById("fontSizeValue");

    if (fontSizeInput) {
        fontSizeInput.oninput = function () {
            // Update displayed value
            if (fontSizeValue) {
                fontSizeValue.textContent = this.value;
            }

            // Apply global CSS variable for question font size
            // This persists even when new questions are generated
            document.documentElement.style.setProperty('--question-font-size', this.value + 'px');
        };
    }
}


/* ---------- AGE GROUP SETTINGS ---------- */

function setupAgeControl() {
    const ageSelect = document.getElementById("ageGroupSelect");

    if (!ageSelect) return;

    // Set current value
    const currentAge = localStorage.getItem('kidsMath_ageGroup');
    if (currentAge) {
        ageSelect.value = currentAge;
    }

    ageSelect.onchange = function () {
        const selectedAge = this.value;

        // Update storage
        localStorage.setItem('kidsMath_ageGroup', selectedAge);

        // Update AgeManager
        if (typeof AgeManager !== 'undefined') {
            AgeManager.selectedAge = selectedAge;
            AgeManager.applyAgeConfig();

            // If menu is open, we might want to refresh it
            // Usually applyAgeConfig handles internal state, but if the menu html needs regeneration:
            if (window.setupMenuControls) setupMenuControls();
        }
    };
}

/* ---------- SOUND CONTROL ---------- */

function setupSoundControl() {
    const soundToggle = document.getElementById("soundToggle");

    if (soundToggle) {
        soundToggle.onchange = function () {
            if (window.toggleMute) {
                const isMuted = window.toggleMute();
                if (!isMuted && window.playSound) {
                    window.playSound('pop');
                }
            }
        };
    }
}
