/* =========================================================
   CUSTOM NUMBER PAD FUNCTIONALITY
========================================================= */

let currentFocusedInput = null;

/**
 * Initialize number pad functionality
 */
function initNumberPad() {
    const numberPad = document.getElementById('numberPad');
    if (!numberPad) return;

    const toggleBtn = document.getElementById('toggleNumPad');
    const showBtn = document.getElementById('showNumPad');

    // Hide button handler
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            numberPad.classList.add('hidden');
            if (showBtn) {
                showBtn.classList.remove('hidden');
            }
        });
    }

    // Show button handler
    if (showBtn) {
        showBtn.addEventListener('click', () => {
            numberPad.classList.remove('hidden');
            showBtn.classList.add('hidden');
        });
    }

    // Track currently focused input
    document.addEventListener('focusin', (e) => {
        if (e.target.matches('input[type="text"], input.answer-input, input.table-answer-input, input.mult-input, input.carry-input')) {
            currentFocusedInput = e.target;
        }
    });

    // Number pad button click handlers
    const numButtons = document.querySelectorAll('.num-btn');
    numButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleNumberPadClick(btn);
        });
    });
}

/**
 * Handle number pad button clicks
 */
function handleNumberPadClick(button) {
    // If no input is focused, find the first empty input
    if (!currentFocusedInput) {
        currentFocusedInput = findNextEmptyInput();
        if (currentFocusedInput) {
            currentFocusedInput.focus();
        } else {
            return; // No input available
        }
    }

    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value !== undefined) {
        // Number button clicked
        insertNumber(value);
    } else if (action === 'backspace') {
        // Delete/Backspace button
        deleteLastChar();
    } else if (action === 'clear') {
        // Clear button
        clearInput();
    }
}

/**
 * Insert a number into the focused input
 */
function insertNumber(num) {
    if (!currentFocusedInput) return;

    const maxLength = currentFocusedInput.getAttribute('maxlength') || 3;
    const currentValue = currentFocusedInput.value;

    if (currentValue.length < maxLength) {
        currentFocusedInput.value = currentValue + num;

        // Trigger input event for any listeners
        currentFocusedInput.dispatchEvent(new Event('input', { bubbles: true }));

        // Auto-move to next input if maxlength reached
        if (currentFocusedInput.value.length >= maxLength) {
            moveToNextInput();
        }
    }
}

/**
 * Delete the last character from the focused input
 */
function deleteLastChar() {
    if (!currentFocusedInput) return;

    const currentValue = currentFocusedInput.value;
    if (currentValue.length > 0) {
        currentFocusedInput.value = currentValue.slice(0, -1);
        currentFocusedInput.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
        // If current input is empty, move to previous input and delete
        moveToPreviousInput();
        if (currentFocusedInput && currentFocusedInput.value.length > 0) {
            currentFocusedInput.value = currentFocusedInput.value.slice(0, -1);
            currentFocusedInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
}

/**
 * Clear the focused input
 */
function clearInput() {
    if (!currentFocusedInput) return;

    currentFocusedInput.value = '';
    currentFocusedInput.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Move to the next input field
 */
function moveToNextInput() {
    const allInputs = Array.from(document.querySelectorAll(
        'input[type="text"], input.answer-input, input.table-answer-input, input.mult-input, input.carry-input'
    ));

    const currentIndex = allInputs.indexOf(currentFocusedInput);
    if (currentIndex !== -1 && currentIndex < allInputs.length - 1) {
        const nextInput = allInputs[currentIndex + 1];
        nextInput.focus();
        currentFocusedInput = nextInput;
    }
}

/**
 * Move to the previous input field
 */
function moveToPreviousInput() {
    const allInputs = Array.from(document.querySelectorAll(
        'input[type="text"], input.answer-input, input.table-answer-input, input.mult-input, input.carry-input'
    ));

    const currentIndex = allInputs.indexOf(currentFocusedInput);
    if (currentIndex > 0) {
        const prevInput = allInputs[currentIndex - 1];
        prevInput.focus();
        currentFocusedInput = prevInput;
    }
}

/**
 * Find the next empty input field
 */
function findNextEmptyInput() {
    const allInputs = document.querySelectorAll(
        'input[type="text"], input.answer-input, input.table-answer-input, input.mult-input, input.carry-input'
    );

    for (let input of allInputs) {
        if (input.value === '' && !input.disabled && input.offsetParent !== null) {
            return input;
        }
    }

    // If no empty input, return the first visible input
    for (let input of allInputs) {
        if (!input.disabled && input.offsetParent !== null) {
            return input;
        }
    }

    return null;
}

// Initialize number pad when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNumberPad);
} else {
    initNumberPad();
}
