Tile Clicker

Overview
- A simple click/timer game built with HTML, CSS and vanilla JavaScript.
- Click black tiles to score points before the time runs out.

Files
- index.html — game entry page.
- game.js — main game logic (timers, scoring, tiles, audio).
- style.css — basic styles and layout.
- sound/ — sound effects used by the game (combo sounds, etc.).

How to run
1. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
2. Click any black tile to start the game.

Controls
- Click an active (black) tile to score.
- The game starts on the first valid click and runs for 10 seconds.
- A remaining-time bar visually shows time left for a combo, below the red line will reset the combo to 0.

Scoring & Combo
- Score per click is calculated from the remaining-time bar; clicking earlier earns more points.
- Combo increases when you click multiple tiles quickly; combo sounds play from the `sound/` folder.

Notes & Troubleshooting
- No build step or external dependencies — just open the HTML file.
- If the timer or bar appears to behave too fast or persists after game end, see `game.js` for interval handling. The project uses `setInterval` for the countdown and bar — both must be cleared when the game ends to avoid overlapping timers.

Suggested next steps
- Add an explicit game-over UI and a restart button, more info about the gameplay after end(cps etc.).
- Customizable sounds and tiles.
