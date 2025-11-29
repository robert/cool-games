# GEO QUIZ MASTERS

A retro arcade-style geography quiz game built with React and Vite.

## Features

- **4 Game Modes:**
  - Country → Flag: Identify the correct flag for a given country
  - Flag → Country: Identify the country from its flag
  - Country → Capital: Name the capital of a given country
  - Capital → Country: Identify the country from its capital

- **Classic Arcade Experience:**
  - Retro pixel font and neon color scheme
  - Old-school CRT screen effect
  - Glowing buttons and animations

- **Gameplay:**
  - 20 questions per round
  - Stopwatch timer tracks your speed
  - 10-second penalty for wrong answers
  - Try to beat your fastest time!

- **High Scores:**
  - Top 10 scores saved in localStorage
  - Classic 3-character name entry
  - View high scores from the start screen

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at http://localhost:5173

### Build

```bash
# Build for production
npm run build
```

### Deploy to GitHub Pages

```bash
# Deploy to GitHub Pages
npm run deploy
```

**Note:** Before deploying, make sure to:
1. Update the `homepage` field in `package.json` with your GitHub username
2. Update the `base` field in `vite.config.js` to match your repository name
3. Enable GitHub Pages in your repository settings (use the `gh-pages` branch)

## Tech Stack

- React 19
- Vite 7
- CSS3 with custom arcade styling
- REST Countries API for country data
- Press Start 2P font (Google Fonts)
- localStorage for high score persistence

## Data Source

Country, flag, and capital data is fetched from the [REST Countries API](https://restcountries.com/).
