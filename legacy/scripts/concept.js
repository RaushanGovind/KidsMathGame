/* =========================================================
   CONCEPT MODE (Age 8-9) LOGIC
   Conceptual Math: Arrays, Fractions, Measurement, Logic
========================================================= */

let conceptState = {
    game: null,
    score: 0
};

function initConceptMode() {
    console.log("Initializing Concept Mode...");

    // Cleanup other modes
    if (typeof hideAllMathUI === 'function') {
        hideAllMathUI();
    } else {
        if (window.cleanupDivisionUI) window.cleanupDivisionUI();
        if (window.closeToddlerMode) window.closeToddlerMode();
        if (window.closePreschoolMode) window.closePreschoolMode();
        if (window.closeSchoolMode) window.closeSchoolMode();

        // Hide Standards
        const title = document.getElementById('mainTitle');
        const panel = document.querySelector('.mode-panel');
        if (title) title.style.display = 'none';
        if (panel) panel.style.display = 'none';
    }

    // Show Concept Area
    const wrapper = document.getElementById("conceptArea");
    if (wrapper) {
        wrapper.style.display = "flex";
        startConceptGame('arrays');
    }
}

function closeConceptMode() {
    const wrapper = document.getElementById("conceptArea");
    if (wrapper) wrapper.style.display = "none";

    // Restore Standards
    const title = document.getElementById('mainTitle');
    if (title) title.style.display = 'block';
}

function startConceptGame(gameType) {
    conceptState.game = gameType;
    const canvas = document.getElementById("conceptGameCanvas");
    canvas.innerHTML = ''; // Clear

    // Update buttons visual
    document.querySelectorAll('.concept-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.concept-btn[data-game="${gameType}"]`)?.classList.add('active');

    if (gameType === 'arrays') runArrayGame();
    else if (gameType === 'fractions') runVisualFractionGame();
    else if (gameType === 'measure') runMeasureGame();
    else if (gameType === 'geometry') runGeometryGame();
}

/* ---------------------------------------------------------
   GAME 1: Multiplication Arrays (Visualizing Math)
--------------------------------------------------------- */
function runArrayGame() {
    const canvas = document.getElementById("conceptGameCanvas");
    const rows = Math.floor(Math.random() * 5) + 2; // 2-6
    const cols = Math.floor(Math.random() * 5) + 2; // 2-6
    const total = rows * cols;

    const instruction = document.createElement('div');
    instruction.className = 'c-instruction';
    instruction.innerHTML = `Build an array for: <b>${rows} × ${cols}</b>`;
    canvas.appendChild(instruction);

    const gameArea = document.createElement('div');
    gameArea.className = 'array-game-area';

    // Grid controls
    let currentRows = 1;
    let currentCols = 1;

    const gridContainer = document.createElement('div');
    gridContainer.className = 'array-grid-container';

    function renderGrid() {
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${currentCols}, 1fr)`;

        for (let r = 0; r < currentRows; r++) {
            for (let c = 0; c < currentCols; c++) {
                const dot = document.createElement('div');
                dot.className = 'array-dot';
                gridContainer.appendChild(dot);
            }
        }

        // Validation check
        if (currentRows === rows && currentCols === cols) {
            checkBtn.disabled = false;
            equationDisplay.innerText = `${currentRows} × ${currentCols} = ${currentRows * currentCols}`;
        } else {
            checkBtn.disabled = true;
            equationDisplay.innerText = `${currentRows} × ${currentCols}`;
        }
    }

    // Controls
    const controls = document.createElement('div');
    controls.className = 'array-controls';

    const addRowBtn = createBtn('Add Row ⬇️', () => { if (currentRows < 8) currentRows++; renderGrid(); });
    const subRowBtn = createBtn('Remove Row ⬆️', () => { if (currentRows > 1) currentRows--; renderGrid(); });
    const addColBtn = createBtn('Add Column ➡️', () => { if (currentCols < 8) currentCols++; renderGrid(); });
    const subColBtn = createBtn('Remove Column ⬅️', () => { if (currentCols > 1) currentCols--; renderGrid(); });

    const rowControls = document.createElement('div');
    rowControls.appendChild(subRowBtn);
    rowControls.appendChild(addRowBtn);

    const colControls = document.createElement('div');
    colControls.appendChild(subColBtn);
    colControls.appendChild(addColBtn);

    controls.appendChild(rowControls);
    controls.appendChild(colControls);

    // Display
    const equationDisplay = document.createElement('div');
    equationDisplay.className = 'array-equation';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'concept-action-btn';
    checkBtn.innerText = "Check Answer ✅";
    checkBtn.disabled = true;
    checkBtn.onclick = () => {
        playSuccessSound();
        showMessage(`Correct! ${rows} groups of ${cols} corresponds to ${total}!`);
        setTimeout(runArrayGame, 2000);
    };

    gameArea.appendChild(equationDisplay);
    gameArea.appendChild(gridContainer);
    gameArea.appendChild(controls);
    gameArea.appendChild(checkBtn);

    canvas.appendChild(gameArea);
    renderGrid();
}

function createBtn(text, onclick) {
    const b = document.createElement('button');
    b.className = 'array-ctrl-btn';
    b.innerText = text;
    b.onclick = onclick;
    return b;
}

/* ---------------------------------------------------------
   GAME 2: Fraction Slicer (Pizza Party)
--------------------------------------------------------- */
function runVisualFractionGame() {
    const canvas = document.getElementById("conceptGameCanvas");

    // Goal: Identify "1/2", "1/4", "3/4"
    const fractions = [
        { num: 1, den: 2, label: '1/2 (Half)' },
        { num: 1, den: 4, label: '1/4 (Quarter)' },
        { num: 3, den: 4, label: '3/4 (Three Quarters)' },
        { num: 1, den: 3, label: '1/3 (One Third)' }
    ];
    const target = fractions[Math.floor(Math.random() * fractions.length)];

    const instruction = document.createElement('div');
    instruction.className = 'c-instruction';
    instruction.innerHTML = `Select the pizza that shows <b>${target.label}</b>`;
    canvas.appendChild(instruction);

    const pizzaContainer = document.createElement('div');
    pizzaContainer.className = 'pizza-container';

    // Generate 3 random visual representations
    // One correct, two wrong
    let options = [];
    options.push({ correct: true, ...target });

    while (options.length < 3) {
        const r = fractions[Math.floor(Math.random() * fractions.length)];
        // Ensure unique denominators or unique numerator for variety
        if (options.every(o => o.num !== r.num || o.den !== r.den)) {
            options.push({ correct: false, ...r });
        }
    }
    options.sort(() => Math.random() - 0.5);

    options.forEach(opt => {
        const pizza = document.createElement('div');
        pizza.className = 'pizza-box';

        // Draw Pizza with CSS Conic Gradient
        const slice = document.createElement('div');
        slice.className = 'visual-pizza';
        const percent = (opt.num / opt.den) * 100;

        // CSS logic for pie chart
        // Basic implementation: highlight slices
        // Using conic-gradient
        slice.style.background = `conic-gradient(#FF7043 0% ${percent}%, #FFE0B2 ${percent}% 100%)`;

        // Overlay lines to show denominators
        const lines = document.createElement('div');
        lines.className = 'pizza-lines';
        // Add rotation lines based on denominator (simplified)

        pizza.appendChild(slice);

        const label = document.createElement('div');
        label.innerText = `?`;
        // We don't show the label, user has to guess by looking

        pizza.onclick = () => {
            if (opt.correct) {
                playSuccessSound();
                showMessage("Deliciously Correct! 🍕");
                setTimeout(runVisualFractionGame, 1500);
            } else {
                playErrorSound();
                pizza.style.opacity = '0.5';
            }
        };

        pizzaContainer.appendChild(pizza);
    });

    canvas.appendChild(pizzaContainer);
}

/* ---------------------------------------------------------
   GAME 3: Virtual Ruler (Measurement)
--------------------------------------------------------- */
function runMeasureGame() {
    const canvas = document.getElementById("conceptGameCanvas");

    // Random length in cm (visual scale)
    const lengthCm = Math.floor(Math.random() * 8) + 2; // 2 to 10cm

    const instruction = document.createElement('div');
    instruction.className = 'c-instruction';
    instruction.innerText = "How long is the pencil? (Drag the slider)";
    canvas.appendChild(instruction);

    const measureArea = document.createElement('div');
    measureArea.className = 'measure-area';

    // Object to measure
    const objContainer = document.createElement('div');
    objContainer.style.marginBottom = '20px';
    objContainer.style.position = 'relative';

    const object = document.createElement('div');
    object.className = 'measure-object';
    object.style.width = `${lengthCm * 40}px`; // 40px per cm scale
    object.innerHTML = '✏️';

    // Ruler Background
    const ruler = document.createElement('div');
    ruler.className = 'visual-ruler';

    objContainer.appendChild(object);
    objContainer.appendChild(ruler);

    // Interactive Slider/Input
    const inputArea = document.createElement('div');
    inputArea.innerHTML = `Length: <span id="measureVal">0</span> cm`;
    inputArea.style.fontSize = '24px';
    inputArea.style.fontWeight = 'bold';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '12';
    slider.value = '0';
    slider.step = '1';
    slider.className = 'measure-slider';

    slider.oninput = (e) => {
        document.getElementById('measureVal').innerText = e.target.value;
    };

    const checkBtn = document.createElement('button');
    checkBtn.className = 'concept-action-btn';
    checkBtn.innerText = "Check Length";
    checkBtn.onclick = () => {
        if (parseInt(slider.value) === lengthCm) {
            playSuccessSound();
            showMessage(`Spot on! It is ${lengthCm} cm. 📏`);
            setTimeout(runMeasureGame, 2000);
        } else {
            playErrorSound();
            showMessage("Try again! Look closely.");
        }
    };

    measureArea.appendChild(objContainer);
    measureArea.appendChild(inputArea);
    measureArea.appendChild(slider);
    measureArea.appendChild(checkBtn);

    canvas.appendChild(measureArea);
}


/* ---------------------------------------------------------
   GAME 4: Geometry Match (Conceptual)
--------------------------------------------------------- */
function runGeometryGame() {
    const canvas = document.getElementById("conceptGameCanvas");

    const concepts = [
        { name: 'Right Angle', icon: '∟', desc: 'Like a corner of a square' },
        { name: 'Parallel Lines', icon: '║', desc: 'Never touch each other' },
        { name: 'Triangle', icon: '△', desc: 'Has 3 sides' },
        { name: 'Circle', icon: '○', desc: 'No corners, perfectly round' }
    ];

    const target = concepts[Math.floor(Math.random() * concepts.length)];

    const instruction = document.createElement('div');
    instruction.className = 'c-instruction';
    instruction.innerHTML = `Find the: <b>${target.name}</b>`;
    canvas.appendChild(instruction);

    const grid = document.createElement('div');
    grid.className = 'geo-grid';

    let options = concepts.sort(() => Math.random() - 0.5);

    options.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'geo-card';
        card.innerHTML = `<div style="font-size:50px">${opt.icon}</div>`;

        card.onclick = () => {
            if (opt.name === target.name) {
                playSuccessSound();
                showMessage(`Correct! ${opt.desc}`);
                setTimeout(runGeometryGame, 2000);
            } else {
                playErrorSound();
                card.style.opacity = '0.5';
            }
        };
        grid.appendChild(card);
    });

    canvas.appendChild(grid);
}

function playSound(type) {
    // Placeholder
}

// Global Hooks
window.switchToConcept = initConceptMode;
window.closeConceptMode = closeConceptMode;
window.startConceptGame = startConceptGame;
