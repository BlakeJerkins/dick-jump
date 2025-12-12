const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database file path
const dbFile = path.join(__dirname, 'highscore.json');

// Initialize database if it doesn't exist
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ globalHighScore: 0, lastUpdated: new Date().toISOString() }, null, 2));
}

// Get global high score
app.get('/api/highscore', (req, res) => {
    try {
        const data = fs.readFileSync(dbFile, 'utf8');
        const scoreData = JSON.parse(data);
        res.json(scoreData);
    } catch (error) {
        console.error('Error reading high score:', error);
        res.status(500).json({ error: 'Failed to read high score' });
    }
});

// Update global high score
app.post('/api/highscore', (req, res) => {
    try {
        const { score } = req.body;
        
        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({ error: 'Invalid score' });
        }
        
        const data = fs.readFileSync(dbFile, 'utf8');
        const scoreData = JSON.parse(data);
        
        // Only update if new score is higher
        if (score > scoreData.globalHighScore) {
            scoreData.globalHighScore = score;
            scoreData.lastUpdated = new Date().toISOString();
            fs.writeFileSync(dbFile, JSON.stringify(scoreData, null, 2));
            res.json({ 
                globalHighScore: scoreData.globalHighScore, 
                updated: true,
                message: 'Global high score updated!'
            });
        } else {
            res.json({ 
                globalHighScore: scoreData.globalHighScore, 
                updated: false,
                message: 'Score not high enough'
            });
        }
    } catch (error) {
        console.error('Error updating high score:', error);
        res.status(500).json({ error: 'Failed to update high score' });
    }
});

app.listen(PORT, () => {
    console.log(`🎮 Platformer Game Server running at http://localhost:${PORT}`);
    console.log(`High scores API available at http://localhost:${PORT}/api/highscore`);
});
