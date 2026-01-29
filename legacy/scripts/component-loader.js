/* =========================================================
   COMPONENT LOADER
   Loads HTML partials into the main page to keep index.html clean.
========================================================= */

const Components = [
    { id: 'landingPagePlaceholder', file: 'components/landing-page.html' },
    { id: 'menuPopupPlaceholder', file: 'components/menu-popup.html' },
    { id: 'settingsPanelPlaceholder', file: 'components/settings-panel.html' },
    { id: 'addPopupPlaceholder', file: 'components/popup-addition.html' },
    { id: 'subPopupPlaceholder', file: 'components/popup-subtraction.html' },
    { id: 'multPopupPlaceholder', file: 'components/popup-multiplication.html' },
    { id: 'tablePopupPlaceholder', file: 'components/popup-table.html' },
    { id: 'fractPopupPlaceholder', file: 'components/popup-fractions.html' },
    { id: 'additionAreaPlaceholder', file: 'components/game-addition.html' },
    { id: 'comparisonAreaPlaceholder', file: 'components/game-comparison.html' },
    { id: 'divisionAreaPlaceholder', file: 'components/game-division.html' },
    { id: 'timeAreaPlaceholder', file: 'components/game-time.html' },
    { id: 'fractionsAreaPlaceholder', file: 'components/game-fractions.html' },
    { id: 'toddlerAreaPlaceholder', file: 'components/toddler-component.html' },
    { id: 'preschoolAreaPlaceholder', file: 'components/preschool-component.html' },
    { id: 'schoolAreaPlaceholder', file: 'components/school-component.html' },
    { id: 'conceptAreaPlaceholder', file: 'components/concept-component.html' },
    { id: 'preteenAreaPlaceholder', file: 'components/preteen-component.html' }
];

async function loadComponents() {
    console.log("Loading components...");

    for (const comp of Components) {
        try {
            const placeholder = document.getElementById(comp.id);
            if (placeholder) {
                const response = await fetch(comp.file);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const html = await response.text();

                // Replace placeholder with actual content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                // Insert new content
                placeholder.parentElement.insertBefore(tempDiv.firstElementChild, placeholder);

                // Remove placeholder
                placeholder.remove();
                console.log(`✓ Loaded ${comp.file}`);
            }
        } catch (e) {
            console.error(`✗ Failed to load ${comp.file}:`, e);
        }
    }

    // Dispatch event so scripts know components are ready
    window.dispatchEvent(new Event('componentsLoaded'));

    // Safety re-init after DOM ready
    setTimeout(() => {
        if (window.setupMenuControls) window.setupMenuControls();
        if (window.setupSettingsPanel) {
            setupSettingsPanel();
            if (window.setupThemeControl) setupThemeControl();
            if (window.setupFontControls) setupFontControls();
        }
        if (window.setupAdditionModeControls) setupAdditionModeControls();
        if (window.setupSubPopupControls) setupSubPopupControls();
        if (window.setupMultiplicationControls) setupMultiplicationControls();
        if (window.setupTablePracticeControls) setupTablePracticeControls();
        if (window.setupFractPopup) setupFractPopup();

        // Game specific inits that might have failed initially
        if (window.initClock) initClock();
        if (window.nextTimeQuestion && document.getElementById('timeArea') && document.getElementById('timeArea').style.display !== 'none') nextTimeQuestion();

        const startBtn = document.getElementById("startButton");
        if (startBtn) {
            startBtn.onclick = function () {
                window.hideLandingPage();
            };
        }
    }, 100);
}

// Start loading immediately
document.addEventListener('DOMContentLoaded', loadComponents);
