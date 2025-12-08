# Simple 2D Platformer Game

A fun, easy-to-play 2D platformer game built with Phaser and JavaScript. No installation required!

## How to Play

1. **Move**: Use arrow keys (← →) or A/D keys
2. **Jump**: Press SPACEBAR (double jump available!)
3. **Objective**: Collect coins for a high score!

## Game Features

- Infinite procedurally-generated platforms
- Double jump mechanics for advanced platforming
- Coins to collect for points
- Progressive difficulty - platforms shrink as you collect coins
- **Global High Score Tracking** - Compete with all players!
- Variable platform sizes for increased challenge

## How to Run

### Option 1: Quick Start (Easiest - Local Only)
Simply open `index.html` in your web browser. That's it!
*Note: Without the backend server, high scores will save locally in your browser only.*

### Option 2: Run with Global High Score Tracking (Recommended)

#### Prerequisites
- Node.js installed ([Download here](https://nodejs.org/))

#### Setup
1. Open a terminal in this folder
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Visit `http://localhost:3000` in your browser

The game will now track a global high score that all players on the same server will see!

### Option 3: Local Server (Python)
If you have Python installed:
```bash
# Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```
Then visit `http://localhost:8000` in your browser.
*Note: High scores will save locally in your browser only.*

## How to Host Online

Choose any of these free hosting options:

1. **GitHub Pages** (Easiest)
   - Push your files to a GitHub repository
   - Go to Settings → Pages → Select main branch
   - Your game will be live at `https://yourusername.github.io/platformer`

2. **Netlify** (Drag & Drop)
   - Go to netlify.com
   - Drag and drop your project folder
   - Get a live URL instantly

3. **Vercel**
   - Go to vercel.com
   - Import your repository
   - Automatically deployed!

4. **itch.io**
   - Create an account at itch.io
   - Create a new project
   - Upload your HTML/JS files
   - Set to play in browser

## File Structure

```
platformer/
├── index.html    # Main HTML file
├── game.js       # Game logic using Phaser
└── README.md     # This file
```

## Customization Ideas

Want to make it your own? Try:
- Change player color: Modify `0xff0000` in game.js
- Add more platforms: Add more `platforms.create()` calls
- Change coin positions: Modify the `coinPositions` array
- Adjust gravity: Change `gravity: { y: 300 }` value
- Add sound effects: Use Phaser's audio system
- Create different levels: Duplicate the game and change layouts

## Technical Details

- **Framework**: Phaser 3
- **Language**: JavaScript (ES6)
- **Browser**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Dependencies**: None! (Phaser loaded from CDN)

## Tips for Sharing

Share this link with your friends - they can play it right in their browser with no setup!

Enjoy! 🎮
