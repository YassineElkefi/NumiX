# 📞 NumiX

**A Wordle-style game where you guess an 8-digit Tunisian phone number.**

Built with Next.js 15, TypeScript, and Tailwind CSS.

---

## 🎮 How to Play

1. You have **8 attempts** to guess the secret Tunisian phone number.
2. Type directly into the board — digits appear in the cells as you type.
3. Press **Enter** (or tap ↵ on mobile) to submit your guess.
4. After each guess, the cells reveal colour-coded feedback:

| Colour | Meaning |
|--------|---------|
| 🟩 **Green** | Right digit, right position |
| 🟨 **Yellow** | Right digit, wrong position |
| ⬛ **Grey** | Digit not in the number at all |

### Valid Tunisian Prefixes

| Prefix | Operator |
|--------|----------|
| `2x` | Ooredoo |
| `3x` | Ooredoo |
| `5x` | Orange |
| `71` / `72` | Tunisie Télécom |
| `9x` | Tunisie Télecom |

> Numbers starting with `7` must have `1` or `2` as the second digit (71… or 72…).

---

## ✨ Features

- **In-cell typing** — digits appear directly inside the board cells, Wordle-style
- **Blinking cursor** on the active cell
- **Flip animations** when a row is revealed
- **Shake animation** on invalid input
- **Confetti burst** when you win 🎉
- **Light / Dark mode** toggle — persisted to localStorage
- **Stats tracking** — games played, wins, win rate, streak (persisted to localStorage)
- **Live progress bar** showing how far through each guess you are
- **Mobile numpad** — appears automatically on small screens
- **Keyboard support** — type digits and press Enter on desktop
- **Phone number grouping** — digits displayed as `XX XXX XXX` for readability
- **Duplicate digit logic** — correct Wordle-style handling (e.g. only one yellow if the digit appears once in the secret)

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider + Footer
│   ├── page.tsx            # Main game page
│   └── globals.css         # CSS variables for dark/light themes
├── components/
│   ├── Board.tsx           # Grid of 8 rows
│   ├── Cell.tsx            # Individual digit cell with animations
│   ├── Row.tsx             # One guess row, grouped as 2-3-3
│   ├── Numpad.tsx          # Mobile number pad
│   └── Footer.tsx          # "Made by Yassine with ♥"
├── contexts/
│   └── ThemeContext.tsx    # Light/dark theme state + toggle
└── utils/
    ├── generateNumber.ts   # Random valid Tunisian number generator
    └── checkGuess.ts       # Guess evaluation with duplicate-aware logic
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
git clone https://github.com/YassineElkefi/NumiX.git
cd numix
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🧠 Game Logic

### Number Generation (`generateNumber.ts`)

- Randomly selects a valid Tunisian prefix: `2`, `3`, `5`, `9`, or `7`
- Numbers starting with `7` always have `1` or `2` as the second digit
- The remaining digits are random (0–9)

### Guess Checking (`checkGuess.ts`)

Uses a **two-pass algorithm** — the same approach used by the original Wordle:

1. **Pass 1** — scan for exact matches (`correct`). Count remaining unmatched secret digits.
2. **Pass 2** — scan remaining guessed digits. Mark as `present` (yellow) only if the secret still has an unaccounted copy of that digit.

This ensures that if you type `55` and the secret contains only one `5`, only the first `5` gets yellow — the second is grey.

---

## 🎨 Theming

All colours are driven by CSS custom properties defined in `globals.css`:

```css
/* Dark (default) */
html.dark {
  --bg: #09090b;
  --bg-card: rgba(24, 24, 27, 0.7);
  --text-primary: #ffffff;
  /* ... */
}

/* Light */
html.light {
  --bg: #f4f4f8;
  --bg-card: rgba(255, 255, 255, 0.85);
  --text-primary: #09090b;
  /* ... */
}
```

The theme is toggled via `ThemeContext`, persisted in `localStorage`, and applied instantly on load via an inline `<script>` in `layout.tsx` to prevent flash-of-wrong-theme.

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| [Next.js 15](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first styling |
| CSS Custom Properties | Theme switching (dark/light) |
| Canvas API | Confetti animation |
| localStorage | Stats + theme persistence |

---

## 📱 Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Mobile (`< lg`) | Board centered, numpad shown below, legend above |
| Desktop (`lg+`) | 3-column: How to Play · Board · Stats |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 👨‍💻 Author

Made with ♥ by **Yassine**