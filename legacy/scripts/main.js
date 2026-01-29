/* =========================================================
   APP ENTRY POINT
   Loads modules & initializes app
========================================================= */

window.onload = function () {
    console.log("=== App Initialization Started (Window Load) ===");
};

// Main Initialization Triggered when Components are ready
window.addEventListener('componentsLoaded', function () {
    console.log("=== Components Loaded Event Received ===");

    try {
        // Setup UI button actions
        if (window.setupUIEvents) setupUIEvents();
        console.log("✓ setupUIEvents() completed");
    } catch (e) {
        console.error("✗ setupUIEvents() failed:", e);
    }

    try {
        // Setup settings panel
        if (window.setupSettingsPanel) {
            setupSettingsPanel();
            if (window.setupThemeControl) setupThemeControl();
            if (window.setupFontControls) setupFontControls();
            if (window.setupAgeControl) setupAgeControl();
            if (window.setupSoundControl) setupSoundControl();
        }
        console.log("✓ Settings controls completed");
    } catch (e) {
        console.error("✗ Settings controls failed:", e);
    }

    try {
        // Setup navigation
        if (window.setupNavButtons) setupNavButtons();
        console.log("✓ setupNavButtons() completed");
    } catch (e) {
        console.error("✗ setupNavButtons() failed:", e);
    }

    try {
        // Setup addition mode controls
        if (window.setupAdditionModeControls) setupAdditionModeControls();
        console.log("✓ setupAdditionModeControls() completed");
    } catch (e) {
        console.error("✗ setupAdditionModeControls() failed:", e);
    }

    try {
        // Setup subtraction popup controls
        if (window.setupSubPopupControls) setupSubPopupControls();
        console.log("✓ setupSubPopupControls() completed");
    } catch (e) {
        console.error("✗ setupSubPopupControls() failed:", e);
    }

    try {
        // Setup multiplication popup controls
        if (window.setupMultiplicationControls) setupMultiplicationControls();
        console.log("✓ setupMultiplicationControls() completed");
    } catch (e) {
        console.error("✗ setupMultiplicationControls() failed:", e);
    }

    try {
        // Setup table practice controls
        if (window.setupTablePracticeControls) setupTablePracticeControls();
        console.log("✓ setupTablePracticeControls() completed");
    } catch (e) {
        console.error("✗ setupTablePracticeControls() failed:", e);
    }

    try {
        // Setup menu controls - CRITICAL FOR MENU TO WORK
        if (window.setupMenuControls) setupMenuControls();
        console.log("✓ setupMenuControls() completed");
    } catch (e) {
        console.error("✗ setupMenuControls() failed:", e);
    }

    try {
        if (window.setupFractPopup) setupFractPopup();
    } catch (e) {
        console.error("Fract setup failed", e);
    }

    // Setup landing page start button (Redundant check but good for safety)
    const startButton = document.getElementById("startButton");

    if (startButton) {
        // Remove old listeners to prevent duplicates if any
        const newBtn = startButton.cloneNode(true);
        startButton.parentNode.replaceChild(newBtn, startButton);

        newBtn.addEventListener("click", function () {
            console.log("👆 Button click detected!");
            window.hideLandingPage();
        });

        console.log("✓ Start button event listeners attached (Refreshed)");
    } else {
        console.warn("⚠️ Start button not found in main.js init (Might be handled by loader)");
    }

    console.log("=== App Logic Initialization Completed ===");
});

/**
 * Hide landing page and start the game
 */
window.hideLandingPage = function () {
    console.log("🚀 Start button clicked!");

    const landing = document.getElementById("landingPage");

    if (!landing) {
        console.error("❌ Landing page element not found!");
        return;
    }

    console.log("✅ Landing page found, starting fade out...");

    // Fade out animation
    landing.style.opacity = "0";
    landing.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
        landing.style.display = "none";
        // Show menu popup OR Age Selection
        console.log("✅ Landing page hidden");

        try {
            if (typeof AgeManager !== 'undefined') {
                // Check if we HAVE a saved age
                const hasSaved = localStorage.getItem('kidsMath_ageGroup');

                if (hasSaved) {
                    // Auto-login
                    const isReady = AgeManager.checkAndStartJourney();
                    if (isReady) {
                        openMenuPopup();
                    }
                } else {
                    // Force selection
                    AgeManager.showSelectionScreen();
                }
            } else {
                openMenuPopup();
                console.log("✓ Menu popup opened (No AgeManager)");
            }
        } catch (e) {
            console.error("✗ Flow failed:", e);
            openMenuPopup(); // Fallback
        }
    }, 500);
};
