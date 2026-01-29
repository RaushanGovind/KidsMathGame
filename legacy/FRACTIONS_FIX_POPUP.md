# 🐛 Fixed: Fractions Mode Cleanup & New Popup

## Issues Fixed
1. **Multiplication Cleanup:** The previously played multiplication game (or addition/subtraction) was still visible in the background when switching to Fractions mode.
   - **Fix:** Added precise cleanup logic to `scripts/fractions.js` to clear `additionColumns` and hide the bubble matrix when entering Fractions mode.

2. **Fraction Options Popup:**
   - **New Feature:** Added a configuration popup for Fractions mode, similar to other game modes.
   - **Options per User Request:** allows selecting "Activity" (Learn vs Question) and "Shape" (Circle, Pizza, Bar).
   - **Auto-Open:** The popup opens automatically when selecting "Fractions" from the menu.

## Files Modified
- `scripts/fractions.js`: Enhanced `initFractionsMode` cleanup and added popup logic (`setupFractPopup`, `openFractPopup`).
- `index.html`: Added the `#fractPopup` HTML structure.
- `scripts/navigation.js`: Trigger `openFractPopup()` when switching to Fractions.

## Verification
- Switching from Multiplication to Fractions now shows a clean screen (no leftover columns).
- Clicking "Fractions" opens the new "Fraction Options" popup.
- Users can select "Learn Mode" or "Question Mode" and choose their preferred shape before starting.
