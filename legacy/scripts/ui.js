/**
 * Displays text under answer box
 */
function showMessage(text) {
  const el = document.getElementById("resultMsg");
  if (el) el.innerText = text;
}

// Sound State
let isMuted = false;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();


/**
 * Generates synthetic sounds using Web Audio API
 * types: 'correct', 'error', 'pop', 'click', 'success'
 */
function playSound(type) {
  if (isMuted) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'correct' || type === 'success') {
    // High pitched "DING"
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  }
  else if (type === 'error') {
    // Low pitched "Buzz"
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.2);
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }
  else if (type === 'pop') {
    // Short "Pop"
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  }
  else if (type === 'click') {
    // Very short blip
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

function toggleMute() {
  isMuted = !isMuted;
  return isMuted;
}

/**
 * Validates result explicitly for Addition/Subtraction/Multiplication
 * This is a helper to centralize the "check" logic visuals
 */
function showResultFeedback(isCorrect) {
  if (isCorrect) {
    playSound('correct');
    const successMessages = ["Awesome!", "Great Job!", "Correct!", "Superb!"];
    const randomMsg = successMessages[Math.floor(Math.random() * successMessages.length)];
    openAnimatedPopup(true, randomMsg);
  } else {
    playSound('error');
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
}

// Export global hooks
window.playSound = playSound;
window.toggleMute = toggleMute;
window.showResultFeedback = showResultFeedback;
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

