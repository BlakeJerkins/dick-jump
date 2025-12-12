# Dick Jump

A simple 2D platformer built with Phaser and a Node.js backend for global high scores.

## How to Play

1. **Move**: Use arrow keys (← →) or A/D keys
2. **Jump**: Press SPACEBAR (double jump available!)
3. **Objective**: Collect coins for a high score!

## Game Features


## How to Run

### Option 1: Quick Start (Easiest - Local Only)
Simply open `index.html` in your web browser. That's it!
*Note: Without the backend server, high scores will save locally in your browser only.*

### Option 2: Run with Global High Score Tracking (Recommended)

#### Prerequisites

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

## Technical Details


## Tips for Sharing

Share this link with your friends - they can play it right in their browser with no setup!

Enjoy! 🎮

## Deploying to Render (Auto-deploy on push)

The app is configured for Render via `render.yaml` and `server.js` uses `process.env.PORT`.

Steps:
- Push to the `main` branch on GitHub. Render will auto-deploy.
- Initial setup (one-time):
   - Create a Web Service on Render and connect your GitHub repo `BlakeJerkins/dick-jump`.
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
   - Plan: Free
   - Auto-deploy: Enabled

After each push to `main`, your service redeploys automatically. Check status at the Render dashboard under Deploys.

## Copilot Instructions (Deploy Helper)

- Use relative API paths in the frontend (e.g., `fetch('/api/highscore')`) so deployment works on any host.
- Ensure the server binds to `process.env.PORT`.
- To deploy updates: commit to `main` and push; confirm on Render dashboard.
- Trouble? Verify logs on Render, and confirm build/start commands match `package.json` scripts.
