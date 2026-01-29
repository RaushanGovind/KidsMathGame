/* =========================================================
   TODDLER MODE (Age 2-3) LOGIC
   Playground: Ball Pit, Sandpit, Music, Counting
========================================================= */

let toddlerState = {
    game: null,
    score: 0
};

function initToddlerMode() {
    console.log("Initializing Toddler Mode...");
    // Hide OTHER wrappers
    if (typeof hideAllMathUI === 'function') {
        hideAllMathUI();
    } else {
        if (window.cleanupDivisionUI) window.cleanupDivisionUI();
        if (window.cleanupComparisonUI) window.cleanupComparisonUI();
        if (window.cleanupTimeUI) window.cleanupTimeUI();
        if (window.cleanupFractionsUI) window.cleanupFractionsUI();
        if (window.closePreschoolMode) window.closePreschoolMode();
        if (window.closeSchoolMode) window.closeSchoolMode();
        if (window.closeConceptMode) window.closeConceptMode();
        if (window.closePreteenMode) window.closePreteenMode();

        // Hide Standards
        const title = document.getElementById('mainTitle');
        const panel = document.querySelector('.mode-panel');
        if (title) title.style.display = 'none';
        if (panel) panel.style.display = 'none';
    }

    // Show Toddler Area
    const wrapper = document.getElementById("toddlerArea");
    if (wrapper) {
        wrapper.style.display = "flex";
        startToddlerGame('ballpit');
    }
}

function closeToddlerMode() {
    const wrapper = document.getElementById("toddlerArea");
    if (wrapper) wrapper.style.display = "none";

    // Restore Standards
    const title = document.getElementById('mainTitle');
    const panel = document.querySelector('.mode-panel');
    if (title) title.style.display = 'block';
    // Panel visibility depends on mode, maybe default to none or check logic. 
    // Safer to leave panel hidden or let other modes handle it.
    // For now, let's just restore title. Panel usually handled by specific modes.
    if (title) title.innerText = "Kids Math Game";
}

function startToddlerGame(gameType) {
    toddlerState.game = gameType;
    const canvas = document.getElementById("toddlerGameCanvas");
    canvas.innerHTML = '';

    // Update buttons
    document.querySelectorAll('.toddler-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.toddler-btn[data-game="${gameType}"]`)?.classList.add('active');

    if (gameType === 'counting') runCountingGame();
    else if (gameType === 'ballpit') runBallPitGame();
    else if (gameType === 'sandpit') runSandpitGame();
    else if (gameType === 'music') runMusicGame();
    else if (gameType === 'shapes') runShapeGame(); // Standard shapes
}

/* ---------------------------------------------------------
   GAME 1: Ball Pit (Color Recognition & Motor Skills)
--------------------------------------------------------- */
function runBallPitGame() {
    const canvas = document.getElementById("toddlerGameCanvas");

    // Colors
    const colors = [
        { name: 'Red', hex: '#FF5252' },
        { name: 'Blue', hex: '#448AFF' },
        { name: 'Green', hex: '#69F0AE' },
        { name: 'Yellow', hex: '#FFD740' }
    ];
    const target = colors[Math.floor(Math.random() * colors.length)];

    // Instruction
    const instruction = document.createElement('div');
    instruction.className = 't-instruction';
    instruction.innerHTML = `Pop the <span style="color:${target.hex}; font-weight:bold">${target.name}</span> Balls!`;
    canvas.appendChild(instruction);

    const pit = document.createElement('div');
    pit.className = 'ball-pit-container';

    // Generate balls
    let remaining = 0;

    for (let i = 0; i < 15; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const isTarget = color.name === target.name;
        if (isTarget) remaining++;

        const ball = document.createElement('div');
        ball.className = 'pit-ball';
        ball.style.backgroundColor = color.hex;
        // Random position wobble
        ball.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`;

        ball.onclick = () => {
            if (isTarget) {
                ball.style.transform = 'scale(1.5) rotate(20deg)';
                ball.style.opacity = '0';
                setTimeout(() => ball.style.visibility = 'hidden', 300);
                playSound('pop');
                remaining--;
                if (remaining === 0) {
                    playSuccessSound();
                    showMessage("Yay! All popped! 🎈");
                    setTimeout(runBallPitGame, 2000);
                }
            } else {
                ball.classList.add('shake');
                setTimeout(() => ball.classList.remove('shake'), 400);
                // Gentle error sound
            }
        };

        pit.appendChild(ball);
    }

    canvas.appendChild(pit);

    if (remaining === 0) runBallPitGame(); // Retry if none generated
}

/* ---------------------------------------------------------
   GAME 2: Sandpit Surprise (Sensory & Discovery)
--------------------------------------------------------- */
function runSandpitGame() {
    const canvas = document.getElementById("toddlerGameCanvas");

    // Hidden treasure
    const treasures = ['⭐', '🐚', '🦀', '🚗', '🦕', '💎'];
    const treasure = treasures[Math.floor(Math.random() * treasures.length)];

    const instruction = document.createElement('div');
    instruction.className = 't-instruction';
    instruction.innerHTML = `Dig in the sand! What is hiding?`;
    canvas.appendChild(instruction);

    const container = document.createElement('div');
    container.className = 'sand-container';

    // The buried item
    const item = document.createElement('div');
    item.className = 'buried-item';
    item.innerText = treasure;
    container.appendChild(item);

    // Sand patches covering it
    let patchesLeft = 9;

    const grid = document.createElement('div');
    grid.className = 'sand-grid';

    for (let i = 0; i < 9; i++) {
        const sand = document.createElement('div');
        sand.className = 'sand-patch';
        sand.onclick = () => {
            if (sand.style.opacity !== '0') {
                sand.style.opacity = '0';
                playSound('dig');
                patchesLeft--;
                if (patchesLeft === 0) {
                    item.classList.add('found');
                    playSuccessSound();
                    showMessage(`You found a ${treasure}! 🎉`);
                    setTimeout(runSandpitGame, 2500);
                }
            }
        };
        grid.appendChild(sand);
    }

    container.appendChild(grid);
    canvas.appendChild(container);
}

/* ---------------------------------------------------------
   GAME 3: Jungle Dance (Movement & Animals)
--------------------------------------------------------- */
function runMusicGame() {
    const canvas = document.getElementById("toddlerGameCanvas");

    const moves = [
        { animal: '🐘', name: 'Elephant', action: 'STOMP', sound: 'thump' },
        { animal: '🐸', name: 'Frog', action: 'JUMP', sound: 'boing' },
        { animal: '🐵', name: 'Monkey', action: 'WIGGLE', sound: 'ooh-ooh' },
        { animal: '🦁', name: 'Lion', action: 'ROAR', sound: 'roar' }
    ];

    const move = moves[Math.floor(Math.random() * moves.length)];

    const instruction = document.createElement('div');
    instruction.className = 't-instruction';
    instruction.innerHTML = `Tap the ${move.name}... Let's <b>${move.action}</b>!`;
    canvas.appendChild(instruction);

    const stage = document.createElement('div');
    stage.className = 'dance-stage';

    const actor = document.createElement('div');
    actor.className = 'dance-animal';
    actor.innerText = move.animal;

    actor.onclick = () => {
        actor.classList.add('dancing'); // CSS animation

        // Simulate sound text visual
        const soundTxt = document.createElement('div');
        soundTxt.className = 'sound-text';
        soundTxt.innerText = `${move.action}!`;
        stage.appendChild(soundTxt);

        setTimeout(() => {
            actor.classList.remove('dancing');
            soundTxt.remove();
            playSuccessSound();
            setTimeout(runMusicGame, 2000);
        }, 1500);
    };

    stage.appendChild(actor);
    canvas.appendChild(stage);
}


/* ---------------------------------------------------------
   GAME 4: 123 Counting (Classic)
   (Preserved simplified version)
--------------------------------------------------------- */
function runCountingGame() {
    const canvas = document.getElementById("toddlerGameCanvas");
    const target = Math.floor(Math.random() * 5) + 1;
    const isReady = false;

    const instruction = document.createElement('div');
    instruction.className = 't-instruction';
    instruction.innerHTML = `Can you find <b>${target}</b> Apples? 🍎`;
    canvas.appendChild(instruction);

    const row = document.createElement('div');
    row.className = 'counting-stage';

    let count = 0;
    for (let i = 0; i < target; i++) {
        const item = document.createElement('div');
        item.className = 'count-object';
        item.innerText = '🍎';
        item.onclick = () => {
            if (!item.classList.contains('clicked')) {
                item.classList.add('clicked');
                count++;
                speakNumber(count);
                if (count === target) {
                    setTimeout(() => {
                        playSuccessSound();
                        showMessage("Good Counting! 🍎");
                        setTimeout(runCountingGame, 1500);
                    }, 500);
                }
            }
        };
        row.appendChild(item);
    }
    canvas.appendChild(row);
}

/* ---------------------------------------------------------
   GAME 5: Big Shapes (Classic)
--------------------------------------------------------- */
function runShapeGame() {
    const canvas = document.getElementById("toddlerGameCanvas");
    const shapes = [
        { type: 'circle', color: '#FF6B6B', name: 'Circle' },
        { type: 'square', color: '#4ECDC4', name: 'Square' }
    ];
    const target = shapes[Math.floor(Math.random() * shapes.length)];

    const instruction = document.createElement('div');
    instruction.className = 't-instruction';
    instruction.innerHTML = `Find the <b>${target.name}</b>`;
    canvas.appendChild(instruction);

    const grid = document.createElement('div');
    grid.className = 'shape-grid';

    shapes.forEach(s => {
        const el = document.createElement('div');
        el.className = `shape-btn shape-${s.type}`;
        el.style.background = s.color;
        el.onclick = () => {
            if (s.name === target.name) {
                playSuccessSound();
                showMessage("You found it! 🌟");
                setTimeout(runShapeGame, 1500);
            } else {
                playErrorSound();
                el.style.opacity = '0.5';
            }
        };
        grid.appendChild(el);
    });
    canvas.appendChild(grid);
}

// Helpers
function speakNumber(n) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(n.toString());
        window.speechSynthesis.speak(msg);
    }
}
function playSuccessSound() { console.log("Ding!"); }
function playErrorSound() { console.log("Buzz!"); }
function playSound(t) { console.log(t); }

// Hooks
window.switchToToddler = initToddlerMode;
window.closeToddlerMode = closeToddlerMode;
window.startToddlerGame = startToddlerGame;
