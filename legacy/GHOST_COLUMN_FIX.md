# 🐛 Fixed: Ghost Column in Addition

## Issue
An extra empty column (ghost column) was appearing on the left side of addition problems when the generated numbers had fewer digits than the "Digits" setting (e.g., getting a 2-digit problem while in 3-digit mode). This often happens in "Without Carry" mode because numbers are simplified to avoid carries, sometimes reducing their digit count (e.g., 105 -> 095).

## Fix
Updated `scripts/addition.js` to calculate the number of columns based on the **actual** digits of the numbers generated, rather than forcing the "Digits" setting layout.

## Result
Now, if a 2-digit problem is generated (even in 3-digit mode), only 2 columns are shown. The layout is clean and matches the numbers (e.g., `23 + 08` will show 2 columns, not 3).

## Technical Details
Modified `renderAdditionColumns` in `scripts/addition.js`:
```javascript
// Calculate max input digits actually used
const inputMaxDigits = Math.max(...additionRows.map(n => String(n).length));

// Use the maximum of: actual input digits OR sum digits (to handle carry overflow)
const len = Math.max(inputMaxDigits, sumDigits);
```
