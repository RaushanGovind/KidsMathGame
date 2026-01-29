# 🗺️ Age-Wise Learning System Design

## 1. Age Categories & Feature Mapping

We will organize the existing features into these 5 progressive stages.

### 👶 **Stage 1: Toddlers (Age 2-3)**
*Focus: recognition, big/small, shapes*
- **Comparison:** "Big vs Small" Mode (Identify the bigger/smaller item)
- **Comparison:** "Number Comparison" (Simple 1-digit)
- **Time:** "Learn Mode" (Just playing with the clock hands)

### 🧒 **Stage 2: Preschool (Age 4-5)**
*Focus: Counting, ordering, basic patterns*
- **Comparison:** "Ordering" (Ascending/Descending)
- **Addition:** 1-Digit (No carry)
- **Subtraction:** 1-Digit (No borrow)
- **Fractions:** "Pizza Mode" (Visual only - Learn Mode)

### 🎒 **Stage 3: Early School (Age 6-7)**
*Focus: arithmetic, time, money*
- **Addition:** 2-Digit (Column addition)
- **Subtraction:** 2-Digit (Column subtraction)
- **Time:** "Question Mode" (Reading the clock)
- **Table Practice:** Tables 1-5

### 🧠 **Stage 4: Concept Building (Age 8-9)**
*Focus: multiplication, division, fractions*
- **Multiplication:** Basic & Carry
- **Division:** Long Division basic
- **Fractions:** "Question Mode" (identifying usage)
- **Table Practice:** Tables 6-12

### 🎓 **Stage 5: Pre-Teen (Age 10-12)**
*Focus: complex ops, speed*
- **Multiplication:** Multi-digit (2x2, 3x2)
- **Division:** Remainder logic
- **Table Practice:** Tables 13-20
- **Advanced Challenges:** (Mixed modes)

## 2. Implementation Plan

### A. New Age Selection Screen (Welcome)
- Appears on first load.
- Child-friendly cards with avatars for each age group.
- Saves selection to `localStorage`.

### B. Dynamic Menu System
- The main menu (`menuPopup`) will now only show relevant activities for the selected age.
- "Unlock All" option for parents/teachers.

### C. Reward System (Gamification)
- Simple "Star Jar" or "Badge" system.
- Points are stored per age profile.

## 3. Technical Changes
- **`index.html`**: Add `#ageSelectionPopup`.
- **`scripts/age-manager.js`**: Logic to handle selection, storage, and config.
- **`scripts/menu.js`**: Update to render buttons dynamically based on `AgeManager.getConfig()`.
