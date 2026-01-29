/* =========================================================
   PRESCHOOL MODE (Age 4-5) LOGIC
   Patterns, Sequencing, Counting 1-20
========================================================= */

let preschoolState = {
    game: null,
    score: 0,
    currentLevel: 1
};

function initPreschoolMode() {
    console.log("Initializing Preschool Mode...");

    // Cleanup other modes
    if (window.cleanupDivisionUI) window.cleanupDivisionUI();
    if (window.cleanupComparisonUI) window.cleanupComparisonUI();
    if (window.cleanupTimeUI) window.cleanupTimeUI();
    if (window.cleanupFractionsUI) window.cleanupFractionsUI();
    if (window.closeToddlerMode) window.closeToddlerMode();

    // Hide Standards
    if (typeof hideAllMathUI === 'function') {
        hideAllMathUI();
    } else {
        // Fallback if not loaded
        const title = document.getElementById('mainTitle');
        const panel = document.querySelector('.mode-panel');
        const addCols = document.getElementById("additionColumns");
        const bubbleSec = document.querySelector(".bubble-section");
        const actionBtns = document.getElementById("mainActionButtons");

        if (title) title.style.display = 'none';
        if (panel) panel.style.display = 'none';
        if (addCols) addCols.style.display = 'none';
        if (bubbleSec) bubbleSec.style.display = 'none';
        if (actionBtns) actionBtns.style.display = 'none';
    }

    // Show Preschool Area
    const wrapper = document.getElementById("preschoolArea");
    if (wrapper) {
        wrapper.style.display = "flex";
        startPreschoolGame('beads');
    }
}

function closePreschoolMode() {
    const wrapper = document.getElementById("preschoolArea");
    if (wrapper) wrapper.style.display = "none";
    // Show standard game box again if leaving
    const title = document.getElementById('mainTitle');
    if (title) title.style.display = 'block';
}

function startPreschoolGame(gameType) {
    preschoolState.game = gameType;
    const canvas = document.getElementById("preschoolGameCanvas");
    canvas.innerHTML = ''; // Clear

    // Update buttons visual
    document.querySelectorAll('.preschool-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.preschool-btn[data-game="${gameType}"]`)?.classList.add('active');

    if (gameType === 'beads') runBeadGame();
    else if (gameType === 'patterns') runPatternGame();
    else if (gameType === 'missing') runMissingNumGame();
    else if (gameType === 'sequence') runSequenceGame();
    else if (gameType === 'leftright') runLeftRightGame();
    else if (gameType === 'sorting') runSortingGame();
    else if (gameType === 'weight') runWeightGame();
}

/* ---------------------------------------------------------
   GAME 1: Bead/Snack Counting (Story-Based) - Expanded to 20
--------------------------------------------------------- */
function runBeadGame() {
    const canvas = document.getElementById("preschoolGameCanvas");
    const target = Math.floor(Math.random() * 20) + 1; // Expanded to 1-20
    let currentCount = 0;

    // THEME: Randomize between Beads, Cookies, Stars, Apples
    const themes = [
        { name: 'beads', icon: '📿', grid: 'radial-gradient(circle at 30% 30%, #ff9a9e, #ff6b6b)' },
        { name: 'cookies', icon: '🍪', grid: '#D2691E' },
        { name: 'stars', icon: '⭐', grid: '#FFD700' },
        { name: 'apples', icon: '🍎', grid: '#ff0000' }
    ];
    const theme = themes[Math.floor(Math.random() * themes.length)];

    const instruction = document.createElement('div');
    instruction.className = 'p-instruction';
    instruction.innerHTML = `Collect <b>${target}</b> ${theme.icon} in the box!`;
    canvas.appendChild(instruction);

    const targetDisplay = document.createElement('div');
    targetDisplay.className = 'bead-target-display';
    targetDisplay.innerText = `${currentCount} / ${target}`;
    canvas.appendChild(targetDisplay);

    const beadContainer = document.createElement('div');
    beadContainer.className = 'bead-container';

    // Create button to add items
    const addBtn = document.createElement('button');
    addBtn.className = 'start-button'; // Reuse
    addBtn.style.fontSize = '20px';
    addBtn.innerText = ` + Add ${theme.icon} `;
    addBtn.onclick = () => {
        if (currentCount < target) {
            const item = document.createElement('div');
            item.className = 'bead';

            // Custom styling based on icon
            item.style.background = 'none';
            item.innerText = theme.icon;
            item.style.fontSize = '28px';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'center';
            item.style.boxShadow = 'none';

            beadContainer.appendChild(item);
            currentCount++;
            targetDisplay.innerText = `${currentCount} / ${target}`;
            playSound('pop');

            if (currentCount === target) {
                setTimeout(() => {
                    playSuccessSound();
                    showMessage("Yummy! Great Counting! 🎉");
                    setTimeout(runBeadGame, 1500);
                }, 500);
            }
        }
    };

    canvas.appendChild(beadContainer);
    canvas.appendChild(addBtn);
}

/* ---------------------------------------------------------
   GAME 2: Pattern Builder (A B A ?)
--------------------------------------------------------- */
function runPatternGame() {
    const canvas = document.getElementById("preschoolGameCanvas");

    // Generator logic: AABB or ABAB
    const type = Math.random() > 0.5 ? 'ABAB' : 'AABB';
    let seq = [];
    // Shapes logic
    const shapes = ['🔴', '🔵', '🟢', '🟡', '🔺', '⬛', '🔷', '🔶'];
    const shapeA = shapes[Math.floor(Math.random() * shapes.length)];
    let shapeB = shapes[Math.floor(Math.random() * shapes.length)];
    while (shapeA === shapeB) shapeB = shapes[Math.floor(Math.random() * shapes.length)];

    if (type === 'ABAB') seq = [shapeA, shapeB, shapeA]; // Answer B
    else seq = [shapeA, shapeA, shapeB]; // Answer B

    const answer = shapeB;

    const instruction = document.createElement('div');
    instruction.className = 'p-instruction';
    instruction.innerText = "Complete the Pattern!";
    canvas.appendChild(instruction);

    const row = document.createElement('div');
    row.className = 'pattern-row';

    seq.forEach(s => {
        const item = document.createElement('div');
        item.className = `pattern-item`;
        item.innerText = s;
        row.appendChild(item);
    });

    const slot = document.createElement('div');
    slot.className = 'pattern-slot';
    row.appendChild(slot);

    canvas.appendChild(row);

    // Options
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'pattern-options';

    // Shuffle options
    let opts = [shapeA, shapeB].sort(() => Math.random() - 0.5);

    opts.forEach(s => {
        const item = document.createElement('div');
        item.className = `pattern-item pattern-option`;
        item.innerText = s;
        item.onclick = () => {
            if (s === answer) {
                slot.innerText = s;
                slot.style.border = 'none';
                playSuccessSound();
                showMessage("Correct Pattern! 🎨");
                setTimeout(runPatternGame, 1500);
            } else {
                playErrorSound();
                item.style.opacity = '0.3';
            }
        };
        optionsDiv.appendChild(item);
    });

    canvas.appendChild(optionsDiv);
}

/* ---------------------------------------------------------
   GAME 3: Missing Number (Sequence)
--------------------------------------------------------- */
function runMissingNumGame() {
    const canvas = document.getElementById("preschoolGameCanvas");
    const start = Math.floor(Math.random() * 10) + 1; // 1 to 10 start
    // simple sequence start, start+1, start+2, start+3
    let numbers = [start, start + 1, start + 2, start + 3];

    const missingIdx = Math.floor(Math.random() * 4); // 0 to 3
    const correctAnswer = numbers[missingIdx];

    const instruction = document.createElement('div');
    instruction.className = 'p-instruction';
    instruction.innerText = "Which number is missing?";
    canvas.appendChild(instruction);

    const container = document.createElement('div');
    container.className = 'missing-num-container';

    numbers.forEach((n, idx) => {
        const card = document.createElement('div');
        if (idx === missingIdx) {
            card.className = 'num-card missing';
            card.innerText = '?';
        } else {
            card.className = 'num-card';
            card.innerText = n;
        }
        container.appendChild(card);
    });
    canvas.appendChild(container);

    const choices = document.createElement('div');
    choices.className = 'choices-container';

    // Generate options
    let opts = [correctAnswer, correctAnswer + Math.floor(Math.random() * 2) + 1, correctAnswer - Math.floor(Math.random() * 2) - 1];
    opts = opts.filter(n => n > 0).sort(() => Math.random() - 0.5).slice(0, 3);
    if (!opts.includes(correctAnswer)) opts[0] = correctAnswer;
    opts.sort(() => Math.random() - 0.5);

    opts.forEach(n => {
        const btn = document.createElement('div');
        btn.className = 'choice-chip';
        btn.innerText = n;
        btn.onclick = () => {
            if (n === correctAnswer) {
                document.querySelector('.missing').innerText = n;
                document.querySelector('.missing').classList.remove('missing');
                playSuccessSound();
                showMessage("You found it! 🌟");
                setTimeout(runMissingNumGame, 1500);
            } else {
                playErrorSound();
                btn.style.opacity = '0.5';
            }
        };
        choices.appendChild(btn);
    });

    canvas.appendChild(choices);
}

/* ---------------------------------------------------------
   GAME 4: Sequence Sorting (Small to Big) - Visual
--------------------------------------------------------- */
function runSequenceGame() {
    const canvas = document.getElementById("preschoolGameCanvas");

    // Use visual sizes of a flower
    const items = [
        { size: 1, icon: '🌱', label: 'Tiny' },
        { size: 2, icon: '🌿', label: 'Small' },
        { size: 3, icon: '🌳', label: 'Big' },
        { size: 4, icon: '🌲', label: 'Huge' } // Optional 4th
    ];

    // Only take 3 items random subset or just 3 sequential
    let subset = items.slice(0, 3);

    // Shuffle
    let shuffled = [...subset].sort(() => Math.random() - 0.5);

    let currentNeedIndex = 0; // 0 = Smallest

    const instruction = document.createElement('div');
    instruction.className = 'p-instruction';
    instruction.innerText = "Tap from Smallest to Biggest";
    canvas.appendChild(instruction);

    const container = document.createElement('div');
    container.className = 'sequence-container';

    shuffled.forEach(obj => {
        const item = document.createElement('div');
        item.className = 'seq-visual-item';
        // Base size logic
        const scale = 1 + (obj.size * 0.4);
        item.style.fontSize = `${30 * scale}px`;
        item.innerText = obj.icon;

        item.onclick = () => {
            if (obj.size === subset[currentNeedIndex].size) {
                item.classList.add('selected'); // Turns green
                item.style.opacity = '0.5'; // Visual feedback
                currentNeedIndex++;
                playSound('pop');

                if (currentNeedIndex === 3) {
                    playSuccessSound();
                    showMessage("Good Growing! 🌱➡️🌲");
                    setTimeout(runSequenceGame, 1500);
                }
            } else {
                playErrorSound();
                item.classList.add('shake');
                setTimeout(() => item.classList.remove('shake'), 400);
            }
        };

        container.appendChild(item);
    });

    canvas.appendChild(container);
}

/* ---------------------------------------------------------
   GAME 5: Left vs Right (Spatial Awareness)
--------------------------------------------------------- */
function runLeftRightGame() {
    const canvas = document.getElementById("preschoolGameCanvas");
    const targetSide = Math.random() > 0.5 ? 'Left' : 'Right';
    const animal = ['🐶', '🐱', '🦁', '🐵'][Math.floor(Math.random() * 4)];

    const instruction = document.createElement('div');
    instruction.className = 'p-instruction';
    instruction.innerHTML = `Tap the animal on the <b>${targetSide}</b>!`;
    canvas.appendChild(instruction);

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '150px';
    container.style.marginTop = '40px';

    // Left Item
    const leftItem = document.createElement('div');
    leftItem.style.fontSize = '80px';
    leftItem.style.cursor = 'pointer';
    leftItem.innerText = animal;
    leftItem.style.transition = 'transform 0.2s';
    leftItem.onmouseover = () => leftItem.style.transform = 'scale(1.1)';
    leftItem.onmouseout = () => leftItem.style.transform = 'scale(1)';
    leftItem.onclick = () => {
        if (targetSide === 'Left') {
            playSuccessSound();
            showMessage("Correct! That's Left! ⬅️");
            setTimeout(runLeftRightGame, 1500);
        } else {
            playErrorSound();
            leftItem.style.opacity = '0.3';
        }
    }

    // Right Item
    const rightItem = document.createElement('div');
    rightItem.style.fontSize = '80px';
    rightItem.style.cursor = 'pointer';
    rightItem.innerText = animal;
    rightItem.style.transition = 'transform 0.2s';
    rightItem.onmouseover = () => rightItem.style.transform = 'scale(1.1)';
    rightItem.onmouseout = () => rightItem.style.transform = 'scale(1)';
    rightItem.onclick = () => {
        if (targetSide === 'Right') {
            playSuccessSound();
            showMessage("Correct! That's Right! ➡️");
            setTimeout(runLeftRightGame, 1500);
        } else {
            playErrorSound();
            rightItem.style.opacity = '0.3';
        }
    }

    container.appendChild(leftItem);
    container.appendChild(rightItem);
    canvas.appendChild(container);
}

/* ---------------------------------------------------------
   GAME 6: Sorting Fun (Classification)
--------------------------------------------------------- */
function runSortingGame() {
    const canvas = document.getElementById("preschoolGameCanvas");
    // Mode: 'color' or 'shape'
    const mode = Math.random() > 0.5 ? 'color' : 'shape';

    let box1, box2;
    let targetItem; // The object that needs sorting

    if (mode === 'color') {
        box1 = { label: 'Red', color: '#ffadad', match: 'red' };
        box2 = { label: 'Blue', color: '#a0c4ff', match: 'blue' };
        // Randomly pick what our current item is
        const isRed = Math.random() > 0.5;
        targetItem = {
            type: isRed ? 'red' : 'blue',
            symbol: isRed ? '🍎' : '🚙'
        };
    } else {
        box1 = { label: 'Circle', color: '#ffd6a5', match: 'circle' };
        box2 = { label: 'Square', color: '#caffbf', match: 'square' };
        const isCircle = Math.random() > 0.5;
        targetItem = {
            type: isCircle ? 'circle' : 'square',
            symbol: isCircle ? '🔵' : '⬛'
        };
    }

    const instruction = document.createElement('div');
    instruction.className = 'p-instruction';
    instruction.innerText = `Put the ${targetItem.type} in the correct box!`;
    canvas.appendChild(instruction);

    const gameArea = document.createElement('div');
    gameArea.className = 'sorting-game-area';

    // Baskets Container
    const baskets = document.createElement('div');
    baskets.className = 'sorting-baskets';

    [box1, box2].forEach(box => {
        const bin = document.createElement('div');
        bin.className = 'sorting-bin';
        bin.style.backgroundColor = box.color;
        bin.innerText = box.label;
        bin.onclick = () => {
            // Check if user clicked correct bin for current object
            if (box.match === targetItem.type) {
                playSuccessSound();
                showMessage("Good Sorting! 🧺");
                setTimeout(runSortingGame, 1500);
            } else {
                playErrorSound();
                bin.classList.add('shake');
                setTimeout(() => bin.classList.remove('shake'), 500);
            }
        };
        baskets.appendChild(bin);
    });

    // The Object to sort
    const itemDiv = document.createElement('div');
    itemDiv.className = 'sorting-item';
    itemDiv.innerText = targetItem.symbol;
    itemDiv.style.fontSize = '80px';

    gameArea.appendChild(itemDiv);
    gameArea.appendChild(baskets);
    canvas.appendChild(gameArea);
}

/* ---------------------------------------------------------
   GAME 7: Heavy vs Light (Balance Scale Logic)
--------------------------------------------------------- */
function runWeightGame() {
    const canvas = document.getElementById("preschoolGameCanvas");

    const isFindHeavy = Math.random() > 0.5;

    // Define Pairs (Heavy, Light)
    const pairs = [
        { h: '🐘', l: '🐁', hn: 'Elephant', ln: 'Mouse' },
        { h: '🚗', l: '🪶', hn: 'Car', ln: 'Feather' },
        { h: '🪨', l: '🍃', hn: 'Rock', ln: 'Leaf' },
        { h: '🍉', l: '🍇', hn: 'Watermelon', ln: 'Grape' }
    ];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];

    const instruction = document.createElement('div');
    instruction.className = 'p-instruction';
    instruction.innerHTML = isFindHeavy ?
        `Which one is <b>HEAVY</b>?` : `Which one is <b>LIGHT</b>?`;
    canvas.appendChild(instruction);

    const scaleContainer = document.createElement('div');
    scaleContainer.className = 'scale-container';

    // Heavy item (goes lower)
    const heavyDiv = document.createElement('div');
    heavyDiv.className = 'scale-plate scale-heavy';
    heavyDiv.innerText = pair.h;

    // Light item (goes higher)
    const lightDiv = document.createElement('div');
    lightDiv.className = 'scale-plate scale-light';
    lightDiv.innerText = pair.l;

    // Interaction
    [heavyDiv, lightDiv].forEach(div => {
        div.onclick = () => {
            const isHeavyChoice = div === heavyDiv;
            const correct = (isFindHeavy && isHeavyChoice) || (!isFindHeavy && !isHeavyChoice);

            if (correct) {
                playSuccessSound();
                showMessage(isFindHeavy ? "Yes! It's Heavy! 💪" : "Yes! It's Light! 🎈");
                setTimeout(runWeightGame, 1500);
            } else {
                playErrorSound();
                div.classList.add('shake');
            }
        };
    });

    // Visual Structure (Simple CSS balance representation)
    // We can swap sides randomly
    if (Math.random() > 0.5) {
        scaleContainer.appendChild(heavyDiv);
        scaleContainer.appendChild(lightDiv); // Heavy will sit lower via CSS
    } else {
        scaleContainer.appendChild(lightDiv);
        scaleContainer.appendChild(heavyDiv);
    }

    canvas.appendChild(scaleContainer);
}


function playSound(type) {
    // Placeholder
}

// Global Hooks
window.switchToPreschool = initPreschoolMode;
window.closePreschoolMode = closePreschoolMode;
window.startPreschoolGame = startPreschoolGame;
