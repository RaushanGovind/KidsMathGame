/**
 * Displays text under answer box
 */
function showMessage(text) {
  document.getElementById("resultMsg").innerText = text;
}

/**
 * Shows an animated popup with emoji and message
 * Replaces the simple text message
 */
function openAnimatedPopup(isCorrect, message) {
  // Remove existing popup if any
  const existingPopup = document.getElementById("feedbackPopup");
  if (existingPopup) existingPopup.remove();

  // Create popup elements
  const popup = document.createElement("div");
  popup.id = "feedbackPopup";
  popup.className = `feedback-popup ${isCorrect ? "success" : "error"}`;

  const emoji = document.createElement("span");
  emoji.className = "feedback-emoji";
  emoji.innerText = isCorrect ? "🎉" : "😢"; // Party popper or Crying face

  const text = document.createElement("h2");
  text.className = "feedback-text";
  text.innerText = message || (isCorrect ? "Correct!" : "Try Again!");

  popup.appendChild(emoji);
  popup.appendChild(text);
  document.body.appendChild(popup);

  // Trigger animation
  setTimeout(() => {
    popup.classList.add("show");
  }, 10);

  // Auto hide after 2 seconds
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.remove();
    }, 300);
  }, 2000);
}

/**
 * Validates result explicitly for Addition/Subtraction/Multiplication
 * This is a helper to centralize the "check" logic visuals
 */
function showResultFeedback(isCorrect) {
  if (isCorrect) {
    const successMessages = ["Awesome!", "Great Job!", "Correct!", "Superb!"];
    const randomMsg = successMessages[Math.floor(Math.random() * successMessages.length)];
    openAnimatedPopup(true, randomMsg);

    // Optional: Play sound here if desired in future
  } else {
    const errorMessages = ["Oops!", "Try Again!", "Not Quite!", "Keep Trying!"];
    const randomMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    openAnimatedPopup(false, randomMsg);
  }
}

/**
 * Attach button click actions
 * ... existing code ...
 */
function setupUIEvents() {
  // Button handlers are now managed by the navigation system
  // Each mode (addition, subtraction, multiplication, table practice)
  // sets its own handlers when activated via switchToXXX() functions
}

