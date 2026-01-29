# 🎮 Fast Math Fun - Kids Mental Math Game

<div align="center">

![Fast Math Fun](https://img.shields.io/badge/Fast_Math_Fun-v1.0-FFD700?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A joyful, cartoon-themed educational math game for children ages 5-12**

[Features](#features) • [Getting Started](#getting-started) • [Game Modes](#game-modes) • [Tech Stack](#tech-stack) • [Contributing](#contributing)

</div>

---

## 📋 Overview

**Fast Math Fun** is an engaging, mobile-first web application designed to make math learning enjoyable for children. With a playful "Cartoon Adventure" theme, colorful animations, and rewarding progress tracking, kids develop essential math skills while having fun!

### ✨ Key Highlights

- 🎨 **Beautiful Cartoon UI** - Vibrant pastel colors & gentle animations
- 🎯 **6 Math Game Modes** - Addition, Subtraction, Multiplication, Division, Time Reading, Fractions
- 🏆 **Achievement System** - Earn stars, unlock badges, progress through levels
- 👨‍👩‍👧 **Parent Dashboard** - Track progress, set screen time limits, view strengths
- 💾 **Auto-Save Progress** - All progress saved to browser localStorage
- 🔊 **Sound Effects** - Engaging audio feedback (Web Audio API)
- 📱 **Mobile-First Design** - Optimized for tablets and smartphones

---

## 🚀 Features

### 🎮 Game Modes

| Mode | Description | Key Features |
|------|-------------|--------------|
| **Addition** | Practice adding numbers | Column alignment, flying carry animation |
| **Subtraction** | Learn borrowing concepts | Interactive borrow visualization |
| **Multiplication** | Master times tables | Partial products, carry system |
| **Division** | Step-by-step long division | Box-style layout, guided steps |
| **Time Reading** | Analog clock practice | Animated clock hands |
| **Fractions** | Visual fraction learning | SVG pie charts |

### 🏅 Progress & Achievements

- **Star System**: Earn stars for correct answers
- **Level Progression**: Unlock new levels (20 total)
- **Badge Collection**: 6 unique achievement badges
- **Statistics**: Track performance per game mode
- **Play Time Tracking**: Monitor total learning time

### ⚙️ Settings

**Kid Zone:**
- Sound & Music toggles
- Theme selector (Sky, Space, Fantasy)
- Mascot choice (Owl, Robot, Bunny)

**Parent Dashboard:**
- View total stars, current level, play time
- Weekly progress graph
- Strengths & needs-practice insights
- Screen time limit control
- Reset progress option

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 18+ (Download from [nodejs.org](https://nodejs.org))
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd KidsMathGame
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The optimized production files will be in the `dist/` folder.

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--sky-blue: #87CEEB;
--sunshine-yellow: #FFD700;
--mint-green: #98FB98;
--candy-pink: #FFB6C1;

/* Accents */
--orange: #FFA500;
--lavender: #E6E6FA;

/* Functional */
--text-dark: #2C3E50;
--success: #4CAF50;
--error: #FF6B6B;
```

### Typography

- **Font:** Fredoka (Google Fonts)
- **Sizes:** 0.9rem - 3.5rem
- **Weights:** 400 (regular), 700 (bold)

### Animation Principles

- **Gentle & Slow**: 2-3 second loops
- **Smooth Transitions**: 0.3s duration
- **Floating Elements**: `y: [0, -15px, 0]`
- **Button Feedback**: Scale transforms on hover/tap

---

## 📂 Project Structure

```
KidsMathGame/
├── src/
│   ├── components/           # React components
│   │   ├── Home.jsx         # Landing screen
│   │   ├── Menu.jsx         # Game selection
│   │   ├── LevelMap.jsx     # Challenge mode
│   │   ├── Progress.jsx     # Rewards screen
│   │   ├── Settings.jsx     # Settings & parent dashboard
│   │   ├── AdditionGame.jsx
│   │   ├── SubtractionGame.jsx
│   │   ├── MultiplicationGame.jsx
│   │   ├── DivisionGame.jsx
│   │   ├── TimeGame.jsx
│   │   └── FractionsGame.jsx
│   ├── context/
│   │   └── GameContext.jsx  # Global state management
│   ├── utils/
│   │   └── sounds.js        # Sound effects system
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                   # Static assets
├── DESIGN_MASTER.md         # Complete design documentation
├── package.json
└── vite.config.js
```

---

## 🧩 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Framer Motion** | Animations |
| **Web Audio API** | Sound effects |
| **Context API** | State management |
| **localStorage** | Progress persistence |
| **CSS3** | Styling |

---

## 🎯 Roadmap

### ✅ Completed
- [x] All 6 game modes functional
- [x] Home screen & navigation
- [x] Level map system
- [x] Progress & rewards screen
- [x] Settings & parent dashboard
- [x] localStorage persistence
- [x] Sound system foundation
- [x] Responsive mobile design

### 🚧 In Progress
- [ ] Time Trial mode
- [ ] More sound effects
- [ ] Background music
- [ ] Confetti celebrations
- [ ] More achievement badges

### 📅 Future Enhancements
- [ ] Multiplayer challenges
- [ ] Leaderboards
- [ ] Print worksheets
- [ ] Additional themes
- [ ] More game modes (fractions operations, word problems)
- [ ] Progress reports for parents
- [ ] PWA (installable app)

---

## 📖 How to Play

1. **Start at Home**: Tap the owl mascot and explore!
2. **Practice Mode**: Choose any math operation to practice
3. **Challenge Mode**: Progress through 20 levels, unlock as you go
4. **Earn Rewards**: Collect stars ⭐ and unlock badges 🏅
5. **Track Progress**: Check the Progress & Rewards screen

### For Parents

- Tap the ⚙️ icon on the Home screen
- Scroll down to "Parent Dashboard"
- View stats, set screen time, check strengths

---

## 🐛 Known Issues

- Sound effects use oscillator tones (placeholder for actual audio files)
- Parent dashboard graph uses dummy data
- Screen time limit not enforced (UI only)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing design system (see `DESIGN_MASTER.md`)
- Keep components child-friendly (zero reading required)
- Add gentle animations, not jarring ones
- Test on mobile devices
- Maintain the cartoon adventure theme

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspired by Khan Kids & Duolingo
- Icons: Unicode Emojis
- Fonts: [Google Fonts (Fredoka)](https://fonts.google.com/specimen/Fredoka)
- Animation: [Framer Motion](https://www.framer.com/motion/)

---

## 📧 Contact & Support

For questions, suggestions, or issues:
- 📝 Open an issue on GitHub
- 📧 Email: [your-email@example.com]

---

<div align="center">

**Made with ❤️ for kids who love learning**

⭐ Star this repo if you find it helpful! ⭐

</div>
