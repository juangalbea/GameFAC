// ==============================
// DOM Elements and Initial Setup
// ==============================
const startGameButton = document.getElementById("startGameButton");
const instructionsModal = document.getElementById("instructionsModal");
const winModal = document.getElementById("winModal");
const lostModal = document.getElementById("lostModal");

// Show instructions when the page loads
instructionsModal.showModal();

// Setup canvas
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// ==============================
// Game State Variables
// ==============================
let animationActive = true;
let balls = [];
let particles = [];

const mouse = { x: undefined, y: undefined };
const CLICK_RADIUS = 20;
const gameAudio = new Audio();

let hundredthsLeft = 1000; // 10.00 seconds in hundredths
let countdownInterval;

// ==============================
// Audio Controls
// ==============================
function playMusic(src) {
  gameAudio.src = src;
  gameAudio.currentTime = 0;
  gameAudio.muted = false;
  gameAudio.play().catch((err) => console.log("Playback error:", err));
}

function muteMusic() {
  gameAudio.muted = true;
}

// ==============================
// Utility Functions
// ==============================
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// ==============================
// GameObject Constructor (Ball or Particle)
// ==============================
function GameObject(x, y, dx, dy, radius, red, green, blue, type = "ball") {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.red = red;
  this.green = green;
  this.blue = blue;
  this.type = type;

  this.draw = function () {
    ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  };

  this.update = function () {
    if (this.type === "ball") {
      // Bounce off canvas edges
      if (this.x + this.radius > innerWidth || this.x - this.radius < 0)
        this.dx = -this.dx;
      if (this.y + this.radius > innerHeight || this.y - this.radius < 0)
        this.dy = -this.dy;
      this.x += this.dx * 1.5;
      this.y += this.dy * 2;
    } else {
      // Particle movement
      this.x += this.dx * 40;
      this.y += this.dy * 50;
    }

    this.draw();
  };
}

// ==============================
// Game Initialization
// ==============================
function startNewGame() {
  balls = [];
  for (let i = 0; i < 7; i++) {
    const radius = Math.random() * 3 + 10;
    const x = Math.random() * (innerWidth - radius * 2) + radius;
    const y = Math.random() * (innerHeight - radius * 2) + radius;
    const dx = Math.random() - 0.5;
    const dy = Math.random() - 0.5;
    const red = Math.random() * 255;
    const green = Math.random() * 255;
    const blue = Math.random() * 255;
    balls.push(new GameObject(x, y, dx, dy, radius, red, green, blue));
  }
}

// ==============================
// Explosion Effect Generator
// ==============================
function createExplosion(x, y, count = 1000) {
  for (let i = 0; i < count; i++) {
    const radius = Math.random() * 3 + 10;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50;
    const dx = Math.random() - 0.5;
    const dy = Math.random() - 0.5;
    const red = Math.random() * 255;
    const green = Math.random() * 255;
    const blue = Math.random() * 255;
    particles.push(
      new GameObject(
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance,
        dx,
        dy,
        radius,
        red,
        green,
        blue,
        "particle"
      )
    );
  }
}

// ==============================
// Main Animation Loop
// ==============================
function animate() {
  if (!animationActive) return;
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, innerWidth, innerHeight);

  // ✅ Calculate and draw timer
  const timeLeft = (hundredthsLeft / 100).toFixed(2);
  ctx.fillStyle = "#00ff88";
  ctx.font = "bold 28px Arial";
  ctx.fillText(`⏱️ ${timeLeft}`, 20, 45);

  // ✅ Draw game objects
  balls.forEach((b) => b.update());
  particles.forEach((p) => p.update());
}


// ==============================
// Event Listeners
// ==============================

// Start Game button clicked
startGameButton.addEventListener("click", () => {
  instructionsModal.close();
  startNewGame();
  hundredthsLeft = 1000;
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    hundredthsLeft--;
    if (hundredthsLeft <= 0) {
      console.log('cuscus')
      clearInterval(countdownInterval);
      animationActive = false;
      setTimeout(() => {
        playMusic("music/game-over.mp3"); // ✅ your loss sound here
        lostModal.showModal();
      }, 500);
    }
  }, 10);

  animationActive = true;
  animate();
});

// Track mouse position
window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

// Resize canvas and reset game
window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  startNewGame();
});

// Canvas click: check if user clicked on a ball
window.addEventListener("click", () => {
  balls.forEach((ball, index) => {
    if (getDistance(ball.x, ball.y, mouse.x, mouse.y) < ball.radius + CLICK_RADIUS) {
      // Play random SFX
      const sounds = ["badnik", "collapse", "jump", "spring", "tally"];
      const sfx = sounds[Math.floor(Math.random() * sounds.length)];
      new Audio(`music/${sfx}.mp3`).play();

      // Remove ball and explode
      balls.splice(index, 1);
      createExplosion(mouse.x, mouse.y);

      // Win condition
      if (balls.length === 0) {
        clearInterval(countdownInterval);
        playMusic("music/finished.mp3");
        setTimeout(() => winModal.showModal(), 3000);
        createExplosion(canvas.width / 2, canvas.height / 2, 10000);
      }
    }
  });
});

// Restart game when clicking win modal
winModal.addEventListener("click", () => {
  winModal.close();
  animationActive = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls = [];
  particles = [];

  setTimeout(() => instructionsModal.showModal(), 100);
});

// Restart game when clicking lost modal
lostModal.addEventListener("click", () => {
  lostModal.close();
  animationActive = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls = [];
  particles = [];

  setTimeout(() => instructionsModal.showModal(), 100);
});