/* =========================================================
   AGE MANAGER - Handles Progressive Learning System
========================================================= */

const AgeManager = {
    selectedAge: null,

    // Age Configurations
    // Age Configurations
    stages: {
        'toddler': {
            label: 'Toddler (2-3)',
            icon: '👶',
            desc: 'Shapes, Big vs Small',
            modes: ['toddler', 'time'] // Added 'toddler' mode
        },
        'preschool': {
            label: 'Preschool (4-5)',
            icon: '🧒',
            desc: 'Counting, Simple Math',
            modes: ['preschool', 'addition', 'subtraction', 'comparison']
        },
        'school': {
            label: 'Early School (6-7)',
            icon: '🎒',
            desc: 'Math Basics, Time',
            modes: ['school', 'addition', 'subtraction', 'time', 'table']
        },
        'concept': {
            label: 'Concept (8-9)',
            icon: '🧠',
            desc: 'Mult, Div, Fractions',
            modes: ['concept', 'multiplication', 'division', 'fractions', 'table']
        },
        'preteen': {
            label: 'Pre-Teen (10-12)',
            icon: '🎓',
            desc: 'Advanced Challenge',
            modes: ['preteen', 'all'] // All unlocked
        }
    },

    init() {
        // Check if age is already selected
        const savedAge = localStorage.getItem('kidsMath_ageGroup');
        if (savedAge) {
            this.selectedAge = savedAge;
            this.applyAgeConfig();
        }
        // Don't auto-show here. Wait for Start button.
    },

    /**
     * Called by main.js after Landing Page fades out
     * Returns true if age is already selected (ready to go)
     * Returns false if showed selection screen
     */
    checkAndStartJourney() {
        if (this.selectedAge) {
            this.applyAgeConfig();
            return true;
        } else {
            this.showSelectionScreen();
            return false;
        }
    },

    showSelectionScreen() {
        // Create Overlay if not exists
        if (!document.getElementById('ageOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'ageOverlay';
            overlay.className = 'age-overlay';

            let cardsHTML = '';
            for (const [key, data] of Object.entries(this.stages)) {
                cardsHTML += `
                    <div class="age-card" onclick="AgeManager.selectAge('${key}', this)">
                        <div class="age-icon">${data.icon}</div>
                        <div class="age-label">${data.label}</div>
                        <div class="age-desc">${data.desc}</div>
                    </div>
                `;
            }

            overlay.innerHTML = `
                <div class="age-card-container">
                    <h1 class="age-title">👋 Welcome! How old are you?</h1>
                    <p class="age-subtitle">We'll customize the games for you.</p>
                    
                    <div class="age-grid">
                        ${cardsHTML}
                    </div>

                    <button class="start-journey-btn" onclick="AgeManager.confirmSelection()">Start Adventure 🚀</button>
                </div>
            `;

            document.body.appendChild(overlay);
        }
    },

    selectAge(key, element) {
        this.selectedAge = key;

        // UI Update
        document.querySelectorAll('.age-card').forEach(c => c.classList.remove('selected'));
        element.classList.add('selected');
    },

    confirmSelection() {
        if (!this.selectedAge) {
            alert("Please pick an age group!");
            return;
        }

        // Save
        localStorage.setItem('kidsMath_ageGroup', this.selectedAge);

        // Hide screen
        const overlay = document.getElementById('ageOverlay');
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);

        // Apply
        this.applyAgeConfig();

        // Proceed to Menu
        if (window.openMenuPopup) window.openMenuPopup();
    },

    applyAgeConfig() {
        console.log("Applying Age Config:", this.selectedAge);
        window.currentAgeGroup = this.selectedAge;

        // We will update the menu system to respect this
        if (window.setupMenuControls) {
            // Re-run setup to filter buttons if needed (improving menu.js next)
            // For now, we rely on the menu render logic to check AgeManager
        }

        // Auto-configure game complexity based on Age (Optional advanced feature)
        this.configureGameDefaults();
    },

    configureGameDefaults() {
        console.log("Configuring defaults for:", this.selectedAge);

        // TODDLER: Force learn modes, visual only
        if (this.selectedAge === 'toddler') {
            if (window.setTimeMode) window.setTimeMode('learn');
            // Force comparisons to be basic
            // We can add more specific flags here
        }

        // PRESCHOOL: Simple addition
        if (this.selectedAge === 'preschool') {
            // Set default addition to 1 digit if possible by DOM manipulation
            const digitSel = document.getElementById('digitCount');
            if (digitSel) digitSel.value = "1";
        }
    },

    getAllowedModes() {
        if (!this.selectedAge) return ['all']; // Default fallback
        const stage = this.stages[this.selectedAge];
        if (!stage) return ['all'];

        if (stage.modes.includes('all')) {
            return ['all'];
        }
        return stage.modes;
    },
};

// Expose to window for inline HTML onclick handlers
window.AgeManager = AgeManager;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    AgeManager.init();
});
