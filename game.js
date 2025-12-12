// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let platforms;
let coins;
let coinsCollected = 0;
let coinsText;
let highScoreText;
let globalHighScore = 0;  // Global high score from server
let highScore = 0;  // Session high score
let gameWon = false;
let collectedCoins = new Set();
let spacePressed = false;
let canRespawn = true;
let jumpsRemaining = 2;  // Double jump: 2 jumps available
let worldX = 0;
let lastPlatformX = 200;
let platformDistance = 0;
let platformSizeMultiplier = 1.0;  // Starts at 100%, decreases with coins (min 5%)
let bullets; // bullet group
let fireCooldown = 250; // ms between shots
let lastFireTime = 0;

function preload() {
    // Load any assets if needed
}

function create() {
    this.scene = this;
    
    // Create platforms using graphics
    platforms = this.physics.add.staticGroup();
    
    // Create platform textures with different sizes
    // Small platform (50% size)
    const smallPlatGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    smallPlatGraphics.fillStyle(0x8B4513, 1);
    smallPlatGraphics.fillRect(0, 0, 60, 20);
    smallPlatGraphics.generateTexture('platformSmall', 60, 20);
    smallPlatGraphics.destroy();
    
    // Medium platform (75% size)
    const mediumPlatGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    mediumPlatGraphics.fillStyle(0x8B4513, 1);
    mediumPlatGraphics.fillRect(0, 0, 90, 20);
    mediumPlatGraphics.generateTexture('platformMedium', 90, 20);
    mediumPlatGraphics.destroy();
    
    // Large platform (100% size)
    const largePlatGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    largePlatGraphics.fillStyle(0x8B4513, 1);
    largePlatGraphics.fillRect(0, 0, 120, 20);
    largePlatGraphics.generateTexture('platformLarge', 120, 20);
    largePlatGraphics.destroy();
    
    // Create player sprite (funny 2D penis and balls)
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0xffb366, 1);  // Skin tone color
    
    // Draw balls (two circles at bottom)
    playerGraphics.fillCircle(10, 35, 8);
    playerGraphics.fillCircle(22, 35, 8);
    
    // Draw shaft (rectangle in middle - doubled width)
    playerGraphics.fillRect(12, 18, 8, 17);
    
    // Draw head (circle at top)
    playerGraphics.fillCircle(16, 14, 6);
    
    // Draw eyes (simple black dots for character)
    playerGraphics.fillStyle(0x000000, 1);
    playerGraphics.fillCircle(14, 12, 1.5);
    playerGraphics.fillCircle(18, 12, 1.5);
    
    // Draw a small pixel glock (black) attached to the right side
    // handle
    playerGraphics.fillRect(22, 22, 3, 6);
    // trigger guard
    playerGraphics.fillRect(21, 22, 2, 2);
    // slide/barrel
    playerGraphics.fillRect(20, 18, 10, 4);
    // muzzle highlight
    playerGraphics.fillStyle(0x444444, 1);
    playerGraphics.fillRect(29, 18, 1, 4);
    
    playerGraphics.generateTexture('playerTexture', 32, 48);
    playerGraphics.destroy();
    
    player = this.add.sprite(100, 450, 'playerTexture');
    this.physics.add.existing(player);
    player.body.setBounce(0);
    
    // Create coin texture (gold condom wrapper)
    const coinGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Draw gold square wrapper
    coinGraphics.fillStyle(0xffd700, 1);  // Gold
    coinGraphics.fillRect(4, 4, 24, 24);
    
    // Draw dark yellow donut shape inside
    coinGraphics.fillStyle(0xdaa520, 1);  // Dark goldenrod outer
    coinGraphics.fillCircle(16, 16, 10);
    
    // Cut out the center to make it a donut
    coinGraphics.fillStyle(0xffd700, 1);  // Gold (same as square)
    coinGraphics.fillCircle(16, 16, 5);
    
    // Add rippled edges at top
    coinGraphics.fillStyle(0xdaa520, 1);
    coinGraphics.beginPath();
    coinGraphics.moveTo(4, 4);
    coinGraphics.lineTo(6, 2);
    coinGraphics.lineTo(8, 4);
    coinGraphics.lineTo(10, 2);
    coinGraphics.lineTo(12, 4);
    coinGraphics.lineTo(14, 2);
    coinGraphics.lineTo(16, 4);
    coinGraphics.lineTo(18, 2);
    coinGraphics.lineTo(20, 4);
    coinGraphics.lineTo(22, 2);
    coinGraphics.lineTo(24, 4);
    coinGraphics.lineTo(26, 2);
    coinGraphics.lineTo(28, 4);
    coinGraphics.lineTo(28, 5);
    coinGraphics.lineTo(4, 5);
    coinGraphics.fill();
    
    // Add rippled edges at bottom
    coinGraphics.fillStyle(0xdaa520, 1);
    coinGraphics.beginPath();
    coinGraphics.moveTo(4, 28);
    coinGraphics.lineTo(6, 30);
    coinGraphics.lineTo(8, 28);
    coinGraphics.lineTo(10, 30);
    coinGraphics.lineTo(12, 28);
    coinGraphics.lineTo(14, 30);
    coinGraphics.lineTo(16, 28);
    coinGraphics.lineTo(18, 30);
    coinGraphics.lineTo(20, 28);
    coinGraphics.lineTo(22, 30);
    coinGraphics.lineTo(24, 28);
    coinGraphics.lineTo(26, 30);
    coinGraphics.lineTo(28, 28);
    coinGraphics.lineTo(28, 27);
    coinGraphics.lineTo(4, 27);
    coinGraphics.fill();
    
    // Add subtle border
    coinGraphics.lineStyle(1, 0xcc8800, 1);
    coinGraphics.strokeRect(4, 4, 24, 24);
    
    coinGraphics.generateTexture('coinTexture', 32, 32);
    coinGraphics.destroy();
    
    // Coins
    coins = this.physics.add.group();

    // Bullets (white)
    const bulletGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    bulletGraphics.fillStyle(0xffffff, 1);
    bulletGraphics.fillRect(0, 0, 6, 2);
    bulletGraphics.generateTexture('bulletTexture', 6, 2);
    bulletGraphics.destroy();
    bullets = this.physics.add.group({
        defaultKey: 'bulletTexture',
        maxSize: 50
    });
    
    // Create initial platforms
    platforms.create(100, 500, 'platformMedium');
    lastPlatformX = 100;
    platformDistance = 0;
    
    // Generate more platforms
    for (let i = 0; i < 2; i++) {
        generateNextPlatform(this);
    }
    
    // Collisions
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(coins, platforms);
    this.physics.add.overlap(player, coins, collectCoin, null, this);
    
    // Input
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
    // UI
    coinsText = this.add.text(16, 50, 'Coins: 0', {
        fontSize: '32px',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    });
    coinsText.setScrollFactor(0);
    coinsText.setDepth(100);
    
    highScoreText = this.add.text(16, 16, 'Global High Score: 0', {
        fontSize: '32px',
        fill: '#ffff00',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 }
    });
    highScoreText.setScrollFactor(0);
    highScoreText.setDepth(100);
    
    // Fetch global high score from server
    fetchGlobalHighScore();

    // Bullet-coin overlap: bullets collect coins
    this.physics.add.overlap(bullets, coins, (bullet, coin) => {
        collectCoin(player, coin);
        bullet.destroy();
    });
    
    // Camera follow player with horizontal bounds
    this.cameras.main.startFollow(player);
    this.cameras.main.setLerp(1, 0);  // Only follow horizontally, not vertically
    
    // Store scene reference for platform generation
    this.gameScene = this;
}

function generateNextPlatform(scene) {
    // Player jump physics: velocity -358, gravity 600
    // Max reachable height above starting position: ~213 pixels
    // But we need margin for safety, so we'll limit to 60 pixels above previous platform
    const maxJumpHeightAbovePlatform = 60;  // Strict limit - can only go 60px higher
    const maxVerticalDrop = 180;  // Max vertical drop to still make next platform
    
    // Generate next platform at a reasonable distance
    const minDistance = 140;
    const maxDistance = 210;
    const randomDistance = Phaser.Math.Between(minDistance, maxDistance);
    let platformX = lastPlatformX + randomDistance;
    
    // Get the last platform Y position
    const lastPlatform = platforms.children.entries[platforms.children.entries.length - 1];
    const lastPlatformY = lastPlatform ? lastPlatform.y : 500;
    
    // Generate Y with STRICT height limits
    let platformY;
    let isReachable = false;
    let attempts = 0;
    
    while (!isReachable && attempts < 30) {
        const rand = Math.random();
        if (rand < 0.50) {
            // 50% chance: platform at similar height (within 50 pixels) - SAFE
            platformY = lastPlatformY + Phaser.Math.Between(-50, 50);
        } else if (rand < 0.80) {
            // 30% chance: platform lower (safe drop)
            platformY = lastPlatformY + Phaser.Math.Between(50, maxVerticalDrop);
        } else {
            // 20% chance: platform higher BUT strictly limited
            // Can ONLY go up by maxJumpHeightAbovePlatform (60px) maximum
            platformY = lastPlatformY + Phaser.Math.Between(-maxJumpHeightAbovePlatform, -10);
        }
        
        // Constrain within reasonable bounds
        platformY = Phaser.Math.Clamp(platformY, 250, 500);
        
        // Calculate vertical distances
        const verticalRise = lastPlatformY > platformY ? lastPlatformY - platformY : 0;
        const verticalDrop = platformY > lastPlatformY ? platformY - lastPlatformY : 0;
        
        // STRICT reachability check
        // Platform can never be higher than what player can jump to
        if ((verticalRise <= maxJumpHeightAbovePlatform) && (verticalDrop <= maxVerticalDrop)) {
            isReachable = true;
        }
        
        attempts++;
    }
    
    // If we couldn't find a reachable position, force it to be at same height
    if (!isReachable) {
        platformY = lastPlatformY;
    }
    
    // Check for overlapping platforms
    let hasCollision = true;
    let yAdjustments = 0;
    
    while (hasCollision && yAdjustments < 20) {
        hasCollision = false;
        
        platforms.children.entries.forEach(platform => {
            const dx = Math.abs(platform.x - platformX);
            const dy = Math.abs(platform.y - platformY);
            
            // If platforms are too close, adjust Y
            if (dx < 170 && dy < 90) {
                hasCollision = true;
                // Try going down first
                let newY = platformY + Phaser.Math.Between(70, 120);
                if (newY > 500) {
                    newY = platformY - Phaser.Math.Between(50, 80);
                }
                platformY = Phaser.Math.Clamp(newY, 250, 500);
            }
        });
        
        yAdjustments++;
    }
    
    // Choose random platform size (50%, 75%, or 100%) with dynamic scaling
    const sizeRand = Math.random();
    let platformTexture;
    let scaleX;
    
    if (sizeRand < 0.33) {
        platformTexture = 'platformSmall';  // 50% base size
        scaleX = 0.5 * platformSizeMultiplier;
    } else if (sizeRand < 0.66) {
        platformTexture = 'platformMedium';  // 75% base size
        scaleX = 0.75 * platformSizeMultiplier;
    } else {
        platformTexture = 'platformLarge';  // 100% base size
        scaleX = 1.0 * platformSizeMultiplier;
    }
    
    const newPlatform = platforms.create(platformX, platformY, platformTexture);
    newPlatform.setScale(scaleX, 1);  // Only scale width, keep height same
    newPlatform.refreshBody();
    lastPlatformX = platformX;
    platformDistance = randomDistance;
    
    // Randomly add a coin on some platforms
    if (Math.random() < 0.4) {
        const coin = coins.create(platformX, platformY - 40, 'coinTexture');
        coin.coinId = Math.random();
        coin.body.setGravityY(-300);
    }
}

function update() {
    // Horizontal movement
    let isMoving = false;
    if (cursors.left.isDown || this.input.keyboard.keys[65].isDown) { // Left arrow or A
        player.body.setVelocityX(-160);
        isMoving = true;
    } else if (cursors.right.isDown || this.input.keyboard.keys[68].isDown) { // Right arrow or D
        player.body.setVelocityX(160);
        isMoving = true;
    } else {
        player.body.setVelocityX(0);
    }
    
    // Constrain camera to only move right, never left
    if (this.cameras.main.scrollX < player.x - 512) {
        this.cameras.main.scrollX = player.x - 512;
    }
    // Store the maximum camera position we've reached
    if (!this.maxCameraX) {
        this.maxCameraX = this.cameras.main.scrollX;
    }
    if (this.cameras.main.scrollX < this.maxCameraX) {
        this.cameras.main.scrollX = this.maxCameraX;
    } else {
        this.maxCameraX = this.cameras.main.scrollX;
    }
    
    // Jump - allow when touching ground OR when jumps remaining
    const spaceJustPressed = (cursors.space.isDown || this.input.keyboard.keys[32].isDown);
    
    if (spaceJustPressed && !spacePressed) {
        // Jump from ground
        if (player.body.touching.down) {
            player.body.setVelocityY(-358);
            jumpsRemaining = 1;  // Reset to 1 remaining after ground jump
            spacePressed = true;
        }
        // Double jump in air
        else if (jumpsRemaining > 0) {
            player.body.setVelocityY(-358);
            jumpsRemaining--;
            spacePressed = true;
        }
    }
    
    // Reset jump when space is released
    if (!spaceJustPressed) {
        spacePressed = false;
    }

    // Shooting with E key
    const eKey = this.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.E];
    if (eKey && eKey.isDown) {
        const now = this.time.now;
        if (now - lastFireTime >= fireCooldown) {
            lastFireTime = now;
            shootBullet.call(this);
        }
    }
    
    // Generate new platforms as player moves forward
    if (player.x > lastPlatformX - 400) {
        generateNextPlatform(this);
    }
    
    // Check if player fell off the screen - DEATH
    if (player.y > 600 && canRespawn) {
        canRespawn = false;
        
        // Submit score to server if it's higher than global high score
        if (coinsCollected > 0) {
            submitScore(coinsCollected);
        }
        
        // Reset player
        coinsCollected = 0;
        collectedCoins.clear();
        coinsText.setText('Coins: 0');
        platformSizeMultiplier = 1.0;  // Reset platform sizes on respawn
        jumpsRemaining = 2;  // Reset double jump on respawn
        player.x = 100;
        player.y = 450;
        player.body.setVelocity(0, 0);
        
        // Regenerate coins on all platforms
        coins.children.entries.forEach(coin => coin.destroy());
        coins.clear();
        platforms.children.entries.forEach(platform => {
            if (Math.random() < 0.4) {
                const coin = coins.create(platform.x, platform.y - 40, 'coinTexture');
                coin.coinId = Math.random();
                coin.body.setGravityY(-300);
            }
        });
        
        // Allow respawn again after a short delay
        this.time.delayedCall(500, () => {
            canRespawn = true;
        });
    }
}

function collectCoin(player, coin) {
    if (!collectedCoins.has(coin.coinId)) {
        collectedCoins.add(coin.coinId);
        coinsCollected++;
        coin.destroy();
        coinsText.setText(`Coins: ${coinsCollected}`);
        
        // Reduce platform size by 1% per coin collected (minimum 5%)
        platformSizeMultiplier = Math.max(0.05, 1.0 - (coinsCollected * 0.01));
    }
}

function shootBullet() {
    if (!bullets) return;
    const bullet = bullets.get(player.x + 20, player.y - 10, 'bulletTexture');
    if (!bullet) return;
    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.body.allowGravity = false;
    bullet.body.setVelocityX(500);
    bullet.setDepth(50);
    
    // Auto-destroy after 1500ms
    this.time.delayedCall(1500, () => {
        if (bullet.active) bullet.destroy();
    });
}

function winGame(player, flag) {
    gameWon = true;
    const winText = this.add.text(512, 300, `YOU WIN!\nCoins Collected: ${coinsCollected}`, {
        fontSize: '48px',
        fill: '#00ff00',
        backgroundColor: '#000000',
        align: 'center',
        padding: { x: 20, y: 20 }
    });
    winText.setOrigin(0.5);
    winText.setScrollFactor(0);
    winText.setDepth(101);
}

// Fetch global high score from server
async function fetchGlobalHighScore() {
    try {
        const response = await fetch('/api/highscore');
        const data = await response.json();
        globalHighScore = data.globalHighScore;
        if (highScoreText) {
            highScoreText.setText(`Global High Score: ${globalHighScore}`);
        }
    } catch (error) {
        console.log('Server not available - running in local mode');
        // Fallback to local storage if server is not available
        const savedScore = localStorage.getItem('platformerGlobalHighScore');
        if (savedScore) {
            globalHighScore = parseInt(savedScore);
            if (highScoreText) {
                highScoreText.setText(`Global High Score: ${globalHighScore}`);
            }
        }
    }
}

// Submit score to server
async function submitScore(score) {
    try {
        const response = await fetch('/api/highscore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ score: score })
        });
        
        const data = await response.json();
        
        if (data.updated) {
            globalHighScore = data.globalHighScore;
            if (highScoreText) {
                highScoreText.setText(`Global High Score: ${globalHighScore}`);
            }
            console.log('🎉 New global high score:', globalHighScore);
        }
        
        // Save to local storage as backup
        localStorage.setItem('platformerGlobalHighScore', globalHighScore);
    } catch (error) {
        console.log('Could not submit to server - saving locally instead');
        // Fallback to local storage
        if (score > globalHighScore) {
            globalHighScore = score;
            localStorage.setItem('platformerGlobalHighScore', globalHighScore);
            if (highScoreText) {
                highScoreText.setText(`Global High Score: ${globalHighScore}`);
            }
        }
    }
}
