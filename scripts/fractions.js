/* =========================================================
   FRACTIONS LEARNING - LOGIC
========================================================= */

let fractionState = {
    mode: 'learn', // learn, question
    currentNum: 1,
    currentDen: 2,
    shapeType: 'circle' // circle, rectangle, pizza, chocolate
};

function initFractionsMode() {
    console.log("Initializing Fractions Mode...");
    const wrapper = document.getElementById("fractionsArea");

    // Hide others
    if (window.cleanupDivisionUI) window.cleanupDivisionUI();
    if (window.cleanupComparisonUI) window.cleanupComparisonUI();
    if (window.cleanupTimeUI) window.cleanupTimeUI();

    wrapper.style.display = "flex";
    updateFractionDisplay();
    renderPreviews();
}

function cleanupFractionsUI() {
    const wrapper = document.getElementById("fractionsArea");
    if (wrapper) wrapper.style.display = "none";
}

/**
 * Main render function
 */
function updateFractionDisplay() {
    const visual = document.getElementById("fractionVisual");
    visual.innerHTML = "";

    const { currentNum, currentDen, shapeType } = fractionState;
    const svg = createFractionSVG(currentNum, currentDen, shapeType);
    visual.appendChild(svg);

    // Update Card
    document.getElementById("fractNumerator").innerText = currentNum;
    document.getElementById("fractDenominator").innerText = currentDen;
    document.getElementById("fractMeaning").innerText = `${currentNum} part out of ${currentDen} equal parts`;

    if (fractionState.mode === 'question') {
        renderQuestionChoices();
    }
}

/**
 * SVG Generator for Circles and Rectangles
 */
function createFractionSVG(num, den, type) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 200 200");
    svg.className.baseVal = "fraction-svg";

    if (type === 'circle' || type === 'pizza') {
        const cx = 100, cy = 100, r = 80;
        for (let i = 0; i < den; i++) {
            const startAngle = (i * 360) / den;
            const endAngle = ((i + 1) * 360) / den;
            const path = createPieSlice(cx, cy, r, startAngle, endAngle);
            const slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
            slice.setAttribute("d", path);
            slice.className.baseVal = `fraction-part ${type} ${i < num ? 'shaded' : ''}`;
            svg.appendChild(slice);
        }
    } else {
        // Rectangle / Chocolate
        const width = 160, height = 80, x = 20, y = 60;
        const partWidth = width / den;
        for (let i = 0; i < den; i++) {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", x + (i * partWidth));
            rect.setAttribute("y", y);
            rect.setAttribute("width", partWidth);
            rect.setAttribute("height", height);
            rect.className.baseVal = `fraction-part ${i < num ? 'shaded' : ''}`;
            rect.style.stroke = "#fff";
            rect.style.strokeWidth = "2";
            svg.appendChild(rect);
        }
    }
    return svg;
}

function createPieSlice(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", cx, cy,
        "L", start.x, start.y,
        "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
    ].join(" ");
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
    return {
        x: cx + (r * Math.cos(angleInRadians)),
        y: cy + (r * Math.sin(angleInRadians))
    };
}

/**
 * Previews / Level selection
 */
function renderPreviews() {
    const container = document.getElementById("fractionPreviews");
    container.innerHTML = "";
    const levels = [[1, 2], [1, 3], [1, 4], [2, 4], [3, 4], [2, 5]];

    levels.forEach(([n, d]) => {
        const tile = document.createElement("div");
        tile.className = "preview-tile";
        if (fractionState.currentNum === n && fractionState.currentDen === d) tile.classList.add("active");

        tile.onclick = () => {
            fractionState.currentNum = n;
            fractionState.currentDen = d;
            updateFractionDisplay();
            renderPreviews();
        };

        const previewVisual = document.createElement("div");
        previewVisual.className = "preview-visual";
        // Simple circle preview
        const svg = createFractionSVG(n, d, 'circle');
        svg.setAttribute("viewBox", "0 0 200 200");
        previewVisual.appendChild(svg);

        const text = document.createElement("span");
        text.innerText = `${n}/${d}`;
        text.style.fontSize = "12px";
        text.style.fontWeight = "bold";

        tile.appendChild(previewVisual);
        tile.appendChild(text);
        container.appendChild(tile);
    });
}

/**
 * Question Mode
 */
function setFractionMode(m) {
    fractionState.mode = m;
    const btns = document.querySelectorAll(".fract-btn");
    btns.forEach(b => b.classList.remove("active"));

    const uiCard = document.querySelector(".fraction-card");
    const choices = document.getElementById("fractionChoices");
    const prevs = document.getElementById("fractionPreviews");

    if (m === 'learn') {
        btns[0].classList.add("active");
        document.querySelector(".fraction-badge").innerText = "Learn Fractions";
        uiCard.style.visibility = "visible";
        choices.style.display = "none";
        prevs.style.display = "flex";
        showMessage("Click a fraction to learn!");
    } else {
        btns[1].classList.add("active");
        document.querySelector(".fraction-badge").innerText = "Question Mode";
        uiCard.style.visibility = "hidden";
        choices.style.display = "grid";
        prevs.style.display = "none";
        startFractionQuestion();
    }
}

function startFractionQuestion() {
    const den = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
    const num = Math.floor(Math.random() * (den - 1)) + 1;
    fractionState.currentNum = num;
    fractionState.currentDen = den;
    fractionState.shapeType = ['circle', 'rectangle', 'pizza'][Math.floor(Math.random() * 3)];

    updateFractionDisplay();
    renderQuestionChoices();
    showMessage("Look at the shape! Which fraction is shaded?");
}

function renderQuestionChoices() {
    const grid = document.getElementById("fractionChoices");
    grid.innerHTML = "";

    const correct = `${fractionState.currentNum}/${fractionState.currentDen}`;
    let options = [correct];

    while (options.length < 4) {
        let randD = [2, 3, 4, 5, 8][Math.floor(Math.random() * 5)];
        let randN = Math.floor(Math.random() * (randD - 1)) + 1;
        let opt = `${randN}/${randD}`;
        if (!options.includes(opt)) options.push(opt);
    }

    options.sort(() => Math.random() - 0.5);

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "choice-btn"; // Reuse choice-btn styles from time.css or general
        btn.innerText = opt;
        btn.onclick = () => checkFractionAnswer(btn, opt, correct);
        grid.appendChild(btn);
    });
}

function checkFractionAnswer(btn, selected, correct) {
    if (selected === correct) {
        btn.classList.add("correct");
        if (window.showResultFeedback) window.showResultFeedback(true);
        setTimeout(() => {
            if (fractionState.mode === 'question') startFractionQuestion();
        }, 1800);
    } else {
        btn.classList.add("wrong");
        if (window.showResultFeedback) window.showResultFeedback(false);
        setTimeout(() => btn.classList.remove("wrong"), 1000);
    }
}

function setFractionShape(type) {
    fractionState.shapeType = type;
    updateFractionDisplay();
}

// Global hooks
window.switchToFractions = initFractionsMode;
window.cleanupFractionsUI = cleanupFractionsUI;
window.setFractionMode = setFractionMode;
window.setFractionShape = setFractionShape;
