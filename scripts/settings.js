/* =========================================================
   SETTINGS PANEL & THEME CONTROLS
========================================================= */

function setupSettingsPanel() {

    const settingsPanel = document.getElementById("settingsPanel");
    const openBtn = document.getElementById("settingsBtn");
    const closeBtn = document.getElementById("closeSettings");

    // Open settings panel
    openBtn.addEventListener("click", () => {
        settingsPanel.style.right = "0px";
    });

    // Close settings panel
    closeBtn.addEventListener("click", () => {
        settingsPanel.style.right = "-320px";
    });
}


/* ---------- THEME SWITCH ---------- */

function setupThemeControl() {

    document.getElementById("themeSelect").onchange = function () {

        if (this.value === "dark") {

            document.documentElement.style.setProperty("--bg-color", "#1f2937");
            document.documentElement.style.setProperty("--text-color", "#ffffff");
            document.documentElement.style.setProperty("--panel-color", "#374151");

        } else {

            document.documentElement.style.setProperty("--bg-color", "#ffffff");
            document.documentElement.style.setProperty("--text-color", "#222");
            document.documentElement.style.setProperty("--panel-color", "#f5f5f5");
        }
    };
}


/* ---------- FONT SETTINGS ---------- */

function setupFontControls() {

    // Font family
    document.getElementById("fontSelect").onchange = function () {
        document.body.style.fontFamily = this.value;
    };

    // Font size
    document.getElementById("fontSizeInput").oninput = function () {
        document.body.style.fontSize = this.value + "px";
    };

    // Font color
    document.getElementById("fontColorInput").oninput = function () {
        document.body.style.color = this.value;
    };
}
