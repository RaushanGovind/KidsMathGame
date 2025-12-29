/* =========================================================
   APP ENTRY POINT
   Loads modules & initializes app
========================================================= */

window.onload = function () {
    console.log("=== App Initialization Started ===");

    try {
        // Setup UI button actions
        setupUIEvents();
        console.log("✓ setupUIEvents() completed");
    } catch (e) {
        console.error("✗ setupUIEvents() failed:", e);
    }

    try {
        // Setup settings panel
        setupSettingsPanel();
        setupThemeControl();
        setupFontControls();
        console.log("✓ Settings controls completed");
    } catch (e) {
        console.error("✗ Settings controls failed:", e);
    }

    try {
        // Setup navigation
        setupNavButtons();
        console.log("✓ setupNavButtons() completed");
    } catch (e) {
        console.error("✗ setupNavButtons() failed:", e);
    }

    try {
        // Setup addition mode controls
        setupAdditionModeControls();
        console.log("✓ setupAdditionModeControls() completed");
    } catch (e) {
        console.error("✗ setupAdditionModeControls() failed:", e);
    }

    try {
        // Setup subtraction popup controls
        setupSubPopupControls();
        console.log("✓ setupSubPopupControls() completed");
    } catch (e) {
        console.error("✗ setupSubPopupControls() failed:", e);
    }

    try {
        // Setup multiplication popup controls
        setupMultiplicationControls();
        console.log("✓ setupMultiplicationControls() completed");
    } catch (e) {
        console.error("✗ setupMultiplicationControls() failed:", e);
    }

    try {
        // Setup table practice controls
        setupTablePracticeControls();
        console.log("✓ setupTablePracticeControls() completed");
    } catch (e) {
        console.error("✗ setupTablePracticeControls() failed:", e);
    }

    try {
        // Setup menu controls - CRITICAL FOR MENU TO WORK
        setupMenuControls();
        console.log("✓ setupMenuControls() completed");
    } catch (e) {
        console.error("✗ setupMenuControls() failed:", e);
    }

    // Setup landing page start button
    const startButton = document.getElementById("startButton");
    console.log("Looking for start button...", startButton);

    if (startButton) {
        startButton.addEventListener("click", function () {
            console.log("👆 Button click detected!");
            window.hideLandingPage();
        });

        // Also make it work with onclick
        startButton.onclick = function () {
            console.log("👆 Button onclick triggered!");
            window.hideLandingPage();
        };

        console.log("✓ Start button event listeners attached");
    } else {
        console.error("❌ Start button not found!");
    }

    // Don't auto-start - show landing page first
    // User clicks "Start Learning" button to begin
    console.log("=== Landing Page Displayed ===");
    console.log("=== App Initialization Completed ===");
};

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
        console.log("✅ Landing page hidden");

        // Show menu popup so user can choose which mode to practice
        try {
            openMenuPopup();
            console.log("✓ Menu popup opened");
        } catch (e) {
            console.error("✗ openMenuPopup() failed:", e);
        }
    }, 500);
};
