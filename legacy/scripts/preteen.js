/* =========================================================
   PRE-TEEN MODE (Age 10-12) LOGIC
   Logic, Percentages, Data, Area
========================================================= */

let preteenState = {
    game: null,
    score: 0
};

function initPreteenMode() {
    console.log("Initializing PreTeen Mode...");

    // Cleanup other modes
    if (typeof hideAllMathUI === 'function') {
        hideAllMathUI();
    } else {
        if (window.cleanupDivisionUI) window.cleanupDivisionUI();
        if (window.closeToddlerMode) window.closeToddlerMode();
        if (window.closePreschoolMode) window.closePreschoolMode();
        if (window.closeSchoolMode) window.closeSchoolMode();
        if (window.closeConceptMode) window.closeConceptMode();

        // Hide Standards
        const title = document.getElementById('mainTitle');
        const panel = document.querySelector('.mode-panel');
        if (title) title.style.display = 'none';
        if (panel) panel.style.display = 'none';
    }

    // Show Preteen Area
    const wrapper = document.getElementById("preteenArea");
    if (wrapper) {
        wrapper.style.display = "flex";
        startPreteenGame('shopper');
    }
}

function closePreteenMode() {
    const wrapper = document.getElementById("preteenArea");
    if (wrapper) wrapper.style.display = "none";

    // Restore Standards
    const title = document.getElementById('mainTitle');
    if (title) title.style.display = 'block';
}

function startPreteenGame(gameType) {
    preteenState.game = gameType;
    const canvas = document.getElementById("preteenGameCanvas");
    canvas.innerHTML = ''; // Clear

    // Update buttons visual
    document.querySelectorAll('.preteen-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.preteen-btn[data-game="${gameType}"]`)?.classList.add('active');

    if (gameType === 'shopper') runShopperGame();
    else if (gameType === 'room') runRoomDesignerGame();
    else if (gameType === 'data') runDataDetectiveGame();
    else if (gameType === 'logic') runLogicPuzzleGame();
}

/* ---------------------------------------------------------
   GAME 1: Smart Shopper (Percentages & Decimals)
--------------------------------------------------------- */
function runShopperGame() {
    const canvas = document.getElementById("preteenGameCanvas");

    const items = [
        { name: 'Sneakers', price: 80, discount: 25, img: '👟' },
        { name: 'Headphones', price: 50, discount: 10, img: '🎧' },
        { name: 'Backpack', price: 40, discount: 50, img: '🎒' },
        { name: 'Game', price: 60, discount: 20, img: '🎮' }
    ];
    const item = items[Math.floor(Math.random() * items.length)];

    // Calc correct answer
    const discountAmount = (item.price * item.discount) / 100;
    const finalPrice = item.price - discountAmount;

    const instruction = document.createElement('div');
    instruction.className = 'pt-instruction';
    instruction.innerHTML = `Calculate the <b>Final Price</b> after discount.`;
    canvas.appendChild(instruction);

    const scene = document.createElement('div');
    scene.className = 'shopper-scene';

    scene.innerHTML = `
        <div class="shopper-card">
            <div class="shopper-icon">${item.img}</div>
            <div class="shopper-tag">Price: $${item.price}</div>
            <div class="shopper-discount">Discount: ${item.discount}% OFF</div>
            <div class="shopper-hint">Hint: Save $${discountAmount}</div>
        </div>
    `;

    const inputArea = document.createElement('div');
    inputArea.className = 'shopper-input-area';
    inputArea.innerHTML = `<span>Final Price: $</span>`;

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'pt-input';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'pt-action-btn';
    checkBtn.innerText = "Check";
    checkBtn.onclick = () => {
        if (parseFloat(input.value) === finalPrice) {
            playSuccessSound();
            showMessage(`Great Deal! You pay $${finalPrice}. 🛍️`);
            setTimeout(runShopperGame, 2000);
        } else {
            playErrorSound();
            showMessage("Check your math! Price - Discount.");
        }
    };

    inputArea.appendChild(input);
    inputArea.appendChild(checkBtn);

    canvas.appendChild(scene);
    canvas.appendChild(inputArea);
}

/* ---------------------------------------------------------
   GAME 2: Room Designer (Area & Perimeter)
--------------------------------------------------------- */
function runRoomDesignerGame() {
    const canvas = document.getElementById("preteenGameCanvas");

    // Task: Build a rectangle with specific Area/Perimeter
    const targetArea = Math.floor(Math.random() * 10) + 6; // 6 to 15
    // Actually simpler: Given dimensions, calc Area
    const w = Math.floor(Math.random() * 5) + 3;
    const h = Math.floor(Math.random() * 4) + 2;
    const isAreaTask = Math.random() > 0.5;

    const instruction = document.createElement('div');
    instruction.className = 'pt-instruction';
    instruction.innerHTML = isAreaTask ?
        `Calculate the <b>AREA</b> (Space inside)` :
        `Calculate the <b>PERIMETER</b> (Distance around)`;
    canvas.appendChild(instruction);

    const roomContainer = document.createElement('div');
    roomContainer.className = 'room-container';

    // Visual Grid Room
    const grid = document.createElement('div');
    grid.className = 'room-grid';
    grid.style.width = `${w * 40}px`;
    grid.style.height = `${h * 40}px`;
    grid.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${h}, 1fr)`;

    for (let i = 0; i < w * h; i++) {
        const tile = document.createElement('div');
        tile.className = 'room-tile';
        grid.appendChild(tile);
    }

    // Labels
    const wLabel = document.createElement('div');
    wLabel.className = 'room-label horizontal';
    wLabel.innerText = `${w} m`;

    const hLabel = document.createElement('div');
    hLabel.className = 'room-label vertical';
    hLabel.innerText = `${h} m`;

    roomContainer.appendChild(wLabel);
    roomContainer.appendChild(grid);
    roomContainer.appendChild(hLabel);

    canvas.appendChild(roomContainer);

    // Input
    const inputArea = document.createElement('div');
    inputArea.className = 'shopper-input-area'; // Reuse class

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'pt-input';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'pt-action-btn';
    checkBtn.innerText = "Check";
    checkBtn.onclick = () => {
        const correct = isAreaTask ? (w * h) : (2 * (w + h));
        if (parseInt(input.value) === correct) {
            playSuccessSound();
            showMessage(isAreaTask ? "Correct Area! 🟦" : "Correct Perimeter! 📏");
            setTimeout(runRoomDesignerGame, 2000);
        } else {
            playErrorSound();
        }
    };

    inputArea.appendChild(input);
    inputArea.appendChild(checkBtn);
    canvas.appendChild(inputArea);
}

/* ---------------------------------------------------------
   GAME 3: Data Detective (Graph Interpretation)
--------------------------------------------------------- */
function runDataDetectiveGame() {
    const canvas = document.getElementById("preteenGameCanvas");

    // Simple bar chart data
    const data = [
        { label: 'Mon', val: Math.floor(Math.random() * 10) + 5 },
        { label: 'Tue', val: Math.floor(Math.random() * 10) + 5 },
        { label: 'Wed', val: Math.floor(Math.random() * 10) + 5 }
    ];

    // Random Question
    const qType = Math.floor(Math.random() * 3);
    let question = "";
    let answer = 0;

    if (qType === 0) {
        question = "What is the total for all 3 days?";
        answer = data[0].val + data[1].val + data[2].val;
    } else if (qType === 1) {
        // Find Max
        const max = data.reduce((prev, curr) => (prev.val > curr.val) ? prev : curr);
        question = `Which day had the most?`;
        answer = max.label; // Note: String answer here
    } else {
        question = `How much more on ${data[0].label} than ${data[1].label}?`;
        answer = data[0].val - data[1].val; // Could be negative, let's keep it abstract math or fix logic
        // Let's ensure simple difference
        if (data[0].val >= data[1].val) {
            answer = data[0].val - data[1].val;
            question = `How much more on ${data[0].label} than ${data[1].label}?`;
        } else {
            answer = data[1].val - data[0].val;
            question = `How much more on ${data[1].label} than ${data[0].label}?`;
        }
    }

    const instruction = document.createElement('div');
    instruction.className = 'pt-instruction';
    instruction.innerText = question;
    canvas.appendChild(instruction);

    // Render Chart
    const chart = document.createElement('div');
    chart.className = 'data-chart';

    data.forEach(d => {
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-col';

        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${d.val * 15}px`;
        bar.innerText = d.val;

        const lbl = document.createElement('div');
        lbl.innerText = d.label;

        barContainer.appendChild(bar);
        barContainer.appendChild(lbl);
        chart.appendChild(barContainer);
    });

    if (typeof answer === 'string') {
        // Multiple choice for Day names
        const optsDiv = document.createElement('div');
        optsDiv.className = 'pt-options';
        data.forEach(d => {
            const btn = document.createElement('button');
            btn.className = 'pt-opt-btn';
            btn.innerText = d.label;
            btn.onclick = () => {
                if (d.label === answer) {
                    playSuccessSound();
                    showMessage("Data Detected! 🕵️");
                    setTimeout(runDataDetectiveGame, 2000);
                } else {
                    playErrorSound();
                }
            };
            optsDiv.appendChild(btn);
        });
        canvas.appendChild(chart);
        canvas.appendChild(optsDiv);
    } else {
        // Number Input
        canvas.appendChild(chart);
        const inputArea = document.createElement('div');
        inputArea.className = 'shopper-input-area';
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'pt-input';
        const checkBtn = document.createElement('button');
        checkBtn.className = 'pt-action-btn';
        checkBtn.innerText = "Check";
        checkBtn.onclick = () => {
            if (parseInt(input.value) === answer) {
                playSuccessSound();
                showMessage("Correct Analysis! 📈");
                setTimeout(runDataDetectiveGame, 2000);
            } else {
                playErrorSound();
            }
        };
        inputArea.appendChild(input);
        inputArea.appendChild(checkBtn);
        canvas.appendChild(inputArea);
    }
}

/* ---------------------------------------------------------
   GAME 4: Logic Puzzles
--------------------------------------------------------- */
function runLogicPuzzleGame() {
    const canvas = document.getElementById("preteenGameCanvas");

    // Simple logic riddles
    const puzzles = [
        { q: "I am an odd number. Take away one letter and I become even. What am I?", a: "Seven" },
        { q: "What comes next: 2, 4, 8, 16, ...?", a: "32" },
        { q: "I have 3 sides and 3 angles. Who am I?", a: "Triangle" }
    ];
    const p = puzzles[Math.floor(Math.random() * puzzles.length)];

    const instruction = document.createElement('div');
    instruction.className = 'pt-instruction';
    instruction.innerText = p.q;
    canvas.appendChild(instruction);

    const inputArea = document.createElement('div');
    inputArea.className = 'shopper-input-area';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'pt-input text-mode';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'pt-action-btn';
    checkBtn.innerText = "Solve";
    checkBtn.onclick = () => {
        if (input.value.toLowerCase().trim() === p.a.toLowerCase()) {
            playSuccessSound();
            showMessage("Genius Logic! 🧠");
            setTimeout(runLogicPuzzleGame, 2000);
        } else {
            playErrorSound();
            showMessage("Think harder... or check spelling!");
        }
    };

    inputArea.appendChild(input);
    inputArea.appendChild(checkBtn);
    canvas.appendChild(inputArea);
}

function playSound(type) {
    // Placeholder
}

// Global Hooks
window.switchToPreteen = initPreteenMode;
window.closePreteenMode = closePreteenMode;
window.startPreteenGame = startPreteenGame;
