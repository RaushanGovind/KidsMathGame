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

    try {
        // Show addition popup on startup
        openAddPopup();
        console.log("✓ openAddPopup() completed");
    } catch (e) {
        console.error("✗ openAddPopup() failed:", e);
    }

    console.log("=== App Initialization Completed ===");
};
