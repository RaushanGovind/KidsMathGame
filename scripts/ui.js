/**
 * Displays text under answer box
 */
function showMessage(text) {
  document.getElementById("resultMsg").innerText = text;
}

/**
 * Attach button click actions
 * This is called from main.js after page loads
 * Note: Button handlers are now set dynamically by navigation.js
 * when switching between modes (addition, subtraction, multiplication, etc.)
 */
function setupUIEvents() {
  // Button handlers are now managed by the navigation system
  // Each mode (addition, subtraction, multiplication, table practice)
  // sets its own handlers when activated via switchToXXX() functions
}

