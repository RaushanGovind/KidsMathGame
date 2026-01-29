/* =========================================================
   SCHOOL MODE (Age 6-7) LOGIC
   Early Operations, Place Value, Logical Thinking
========================================================= */

let schoolState = {
    game: null,
    score: 0,
    currentLevel: 1
};

function initSchoolMode() {
    console.log("Initializing School Mode...");

    // Cleanup other modes
    if (typeof hideAllMathUI === 'function') {
        hideAllMathUI();
    } else {
        if (window.cleanupDivisionUI) window.cleanupDivisionUI();
        if (window.closeToddlerMode) window.closeToddlerMode();
        if (window.closePreschoolMode) window.closePreschoolMode();

        // Hide Standards
        const title = document.getElementById('mainTitle');
        const panel = document.querySelector('.mode-panel');
        if (title) title.style.display = 'none';
        if (panel) panel.style.display = 'none';
    }

    // Show School Area
    const wrapper = document.getElementById("schoolArea");
    if (wrapper) {
        wrapper.style.display = "flex";
        startSchoolGame('placevalue');
    }
}

function closeSchoolMode() {
    const wrapper = document.getElementById("schoolArea");
    if (wrapper) wrapper.style.display = "none";

    // Restore Standards
    const title = document.getElementById('mainTitle');
    if (title) title.style.display = 'block';
}

function startSchoolGame(gameType) {
    schoolState.game = gameType;
    const canvas = document.getElementById("schoolGameCanvas");
    canvas.innerHTML = ''; // Clear

    // Update buttons visual
    document.querySelectorAll('.school-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.school-btn[data-game="${gameType}"]`)?.classList.add('active');

    if (gameType === 'placevalue') runPlaceValueGame();
    else if (gameType === 'bonds') runNumberBondsGame();
    else if (gameType === 'shop') runShopGame();
    else if (gameType === 'story') runStoryGame();
}

/* ---------------------------------------------------------
   GAME 1: Place Value Builder (Tens & Ones)
--------------------------------------------------------- */
function runPlaceValueGame() {
    const canvas = document.getElementById("schoolGameCanvas");
    const target = Math.floor(Math.random() * 40) + 10; // 10 to 49

    let currentTens = 0;
    let currentOnes = 0;

    const instruction = document.createElement('div');
    instruction.className = 's-instruction';
    instruction.innerHTML = `Build the number <b>${target}</b> using blocks!`;
    canvas.appendChild(instruction);

    const gameArea = document.createElement('div');
    gameArea.className = 'pv-game-area';

    // Display Current Value
    const display = document.createElement('div');
    display.className = 'pv-display';
    display.innerHTML = `Current: <span>0</span>`;

    // Blocks Container (Visuals)
    const blocksArea = document.createElement('div');
    blocksArea.className = 'pv-blocks-area';

    function updateDisplay() {
        const val = (currentTens * 10) + currentOnes;
        display.innerHTML = `Current: <span style="color:${val === target ? 'green' : '#333'}">${val}</span>`;

        // Render blocks
        blocksArea.innerHTML = '';
        for (let i = 0; i < currentTens; i++) {
            const bar = document.createElement('div');
            bar.className = 'block-ten';
            blocksArea.appendChild(bar);
        }
        for (let i = 0; i < currentOnes; i++) {
            const cube = document.createElement('div');
            cube.className = 'block-one';
            blocksArea.appendChild(cube);
        }

        if (val === target) {
            playSuccessSound();
            showMessage("You built it! 🏗️");
            setTimeout(runPlaceValueGame, 2000);
        }
    }

    // Controls
    const controls = document.createElement('div');
    controls.className = 'pv-controls';

    // Add Ten
    const btnTen = document.createElement('button');
    btnTen.className = 'pv-btn';
    btnTen.innerHTML = '<div class="block-ten-icon"></div> Add 10';
    btnTen.onclick = () => { currentTens++; updateDisplay(); playSound('click'); };

    // Add One
    const btnOne = document.createElement('button');
    btnOne.className = 'pv-btn';
    btnOne.innerHTML = '<div class="block-one-icon"></div> Add 1';
    btnOne.onclick = () => { currentOnes++; updateDisplay(); playSound('click'); };

    // Reset
    const btnReset = document.createElement('button');
    btnReset.className = 'pv-btn reset';
    btnReset.innerText = 'Start Over 🔄';
    btnReset.onclick = () => { currentTens = 0; currentOnes = 0; updateDisplay(); };

    controls.appendChild(btnTen);
    controls.appendChild(btnOne);
    controls.appendChild(btnReset);

    gameArea.appendChild(display);
    gameArea.appendChild(blocksArea);
    gameArea.appendChild(controls);

    canvas.appendChild(gameArea);
}

/* ---------------------------------------------------------
   GAME 2: Number Bonds to 10/20
--------------------------------------------------------- */
function runNumberBondsGame() {
    const canvas = document.getElementById("schoolGameCanvas");
    const total = 10;
    const given = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const missing = total - given;

    const instruction = document.createElement('div');
    instruction.className = 's-instruction';
    instruction.innerHTML = `Complete the Number Bond to <b>${total}</b>!`;
    canvas.appendChild(instruction);

    const bondContainer = document.createElement('div');
    bondContainer.className = 'bond-container';

    // Visual Grid (Ten Frame style)
    const frame = document.createElement('div');
    frame.className = 'ten-frame';
    for (let i = 0; i < 10; i++) {
        const dot = document.createElement('div');
        dot.className = 'frame-dot';
        if (i < given) dot.classList.add('filled');
        frame.appendChild(dot);
    }

    const equation = document.createElement('div');
    equation.className = 'bond-equation';
    equation.innerHTML = `${given} + <span class="missing-box">?</span> = ${total}`;

    bondContainer.appendChild(frame);
    bondContainer.appendChild(equation);
    canvas.appendChild(bondContainer);

    // Options
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'bond-options';

    // Generate options including correct answer
    let opts = [missing];
    while (opts.length < 3) {
        let r = Math.floor(Math.random() * 9) + 1;
        if (!opts.includes(r)) opts.push(r);
    }
    opts.sort(() => Math.random() - 0.5);

    opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'bond-opt-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            if (opt === missing) {
                document.querySelector('.missing-box').innerText = opt;
                document.querySelector('.missing-box').style.color = 'green';

                // Anim fill logic
                const dots = document.querySelectorAll('.frame-dot:not(.filled)');
                dots.forEach(d => d.style.backgroundColor = '#4CAF50'); // Fill rest green

                playSuccessSound();
                showMessage("Correct Bond! 🔗");
                setTimeout(runNumberBondsGame, 1500);
            } else {
                playErrorSound();
                btn.style.opacity = '0.5';
            }
        }
        optionsDiv.appendChild(btn);
    });

    canvas.appendChild(optionsDiv);
}

/* ---------------------------------------------------------
   GAME 3: Little Shop (Money)
--------------------------------------------------------- */
function runShopGame() {
    const canvas = document.getElementById("schoolGameCanvas");

    const items = [
        { name: 'Teddy', price: 15, icon: '🧸' },
        { name: 'Ball', price: 12, icon: '⚽' },
        { name: 'Car', price: 23, icon: '🏎️' },
        { name: 'Candy', price: 6, icon: '🍬' }
    ];
    const item = items[Math.floor(Math.random() * items.length)];

    let paid = 0;

    const instruction = document.createElement('div');
    instruction.className = 's-instruction';
    instruction.innerHTML = `Buy the <b>${item.name}</b> for <b>$${item.price}</b> coins!`;
    canvas.appendChild(instruction);

    const shopArea = document.createElement('div');
    shopArea.className = 'shop-area';

    // Item Display
    const itemCard = document.createElement('div');
    itemCard.className = 'shop-item';
    itemCard.innerHTML = `<div style="font-size:60px">${item.icon}</div><div>$${item.price}</div>`;

    // Wallet / Register
    const wallet = document.createElement('div');
    wallet.className = 'shop-wallet';
    wallet.innerHTML = `<div>Paid: $<span>0</span></div>`;

    const paidDisplay = wallet.querySelector('span');

    // Coins
    const coinsArea = document.createElement('div');
    coinsArea.className = 'shop-coins';

    // $10 Coin
    const coin10 = document.createElement('div');
    coin10.className = 'coin coin-10';
    coin10.innerText = '10';
    coin10.onclick = () => pay(10);

    // $5 Coin
    const coin5 = document.createElement('div');
    coin5.className = 'coin coin-5';
    coin5.innerText = '5';
    coin5.onclick = () => pay(5);

    // $1 Coin
    const coin1 = document.createElement('div');
    coin1.className = 'coin coin-1';
    coin1.innerText = '1';
    coin1.onclick = () => pay(1);

    coinsArea.appendChild(coin10);
    coinsArea.appendChild(coin5);
    coinsArea.appendChild(coin1);

    function pay(amount) {
        if (paid + amount <= item.price) {
            paid += amount;
            paidDisplay.innerText = paid;

            // Visual feedback of coin flying? (Simplified: just add to Paid)

            if (paid === item.price) {
                playSuccessSound();
                showMessage("Sold! Here is your toy! 🎁");
                setTimeout(runShopGame, 2000);
            }
        } else {
            // Overpay check? For now prevent overpay implies exact change game
            showMessage("That's too much!");
        }
    }

    const reset = document.createElement('button');
    reset.className = 'shop-reset';
    reset.innerText = "Clear Cash";
    reset.onclick = () => { paid = 0; paidDisplay.innerText = 0; };

    shopArea.appendChild(itemCard);
    shopArea.appendChild(wallet);
    shopArea.appendChild(coinsArea);
    shopArea.appendChild(reset);

    canvas.appendChild(shopArea);
}

/* ---------------------------------------------------------
   GAME 4: Math Stories (Word Problems)
   Interactive Visual Stories
--------------------------------------------------------- */
function runStoryGame() {
    const canvas = document.getElementById("schoolGameCanvas");

    // Scenarios
    const stories = [
        {
            text: "There are 5 birds on the wire. 2 fly away. How many are left?",
            total: 5,
            remove: 2,
            icon: '🐦',
            type: 'subtraction'
        },
        {
            text: "You have 4 red apples and 3 green apples. How many apples total?",
            group1: 4,
            group2: 3,
            icon1: '🍎',
            icon2: '🍏',
            type: 'addition'
        }
    ];

    const story = stories[Math.floor(Math.random() * stories.length)];

    const instruction = document.createElement('div');
    instruction.className = 's-instruction';
    instruction.innerText = story.text;
    canvas.appendChild(instruction);

    const scene = document.createElement('div');
    scene.className = 'story-scene';

    let answer = 0;

    if (story.type === 'subtraction') {
        answer = story.total - story.remove;
        // Render total items. User clicks to 'remove' them visually.
        // Or render animation.
        // Interactive: Click 2 birds to make them fly.

        const feedback = document.createElement('div');
        feedback.className = 'story-hint';
        feedback.innerText = `Click ${story.remove} ${story.icon} to make them fly away!`;
        canvas.appendChild(feedback);

        let removedCount = 0;

        for (let i = 0; i < story.total; i++) {
            const item = document.createElement('div');
            item.className = 'story-item';
            item.innerText = story.icon;
            item.onclick = () => {
                if (!item.classList.contains('gone') && removedCount < story.remove) {
                    item.classList.add('gone'); // Fly away animation
                    removedCount++;
                    if (removedCount === story.remove) {
                        feedback.innerText = "Now count how many are left!";
                        showOptions(answer);
                    }
                }
            };
            scene.appendChild(item);
        }
    } else {
        answer = story.group1 + story.group2;
        // Addition: Simply count all
        for (let i = 0; i < story.group1; i++) {
            const item = document.createElement('div');
            item.className = 'story-item';
            item.innerText = story.icon1;
            scene.appendChild(item);
        }
        for (let i = 0; i < story.group2; i++) {
            const item = document.createElement('div');
            item.className = 'story-item';
            item.innerText = story.icon2;
            scene.appendChild(item);
        }
        showOptions(answer);
    }

    canvas.appendChild(scene);

    function showOptions(correctVal) {
        const optsContainer = document.createElement('div');
        optsContainer.className = 'bond-options'; // Reuse class
        optsContainer.style.marginTop = '20px';

        let vals = [correctVal, correctVal + 1, correctVal - 1].sort(() => Math.random() - 0.5);
        vals.forEach(v => {
            const btn = document.createElement('button');
            btn.className = 'bond-opt-btn';
            btn.innerText = v;
            btn.onclick = () => {
                if (v === correctVal) {
                    playSuccessSound();
                    showMessage("That's right! 📖");
                    setTimeout(runStoryGame, 2000);
                } else {
                    playErrorSound();
                }
            };
            optsContainer.appendChild(btn);
        });
        canvas.appendChild(optsContainer);
    }
}

function playSound(type) {
    // Placeholder
}

// Global Hooks
window.switchToSchool = initSchoolMode;
window.closeSchoolMode = closeSchoolMode;
window.startSchoolGame = startSchoolGame;
