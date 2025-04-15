// Get DOM elements
const cancelButton = document.getElementById("cancel");
const dialog = document.getElementById("favDialog");
dialog.returnValue = "favAnimal";

// Show the game instructions modal on load
dialog.showModal();

// Debug log to check modal status
function openCheck(dialog) {
  if (dialog.open) {
    console.log("Dialog open");
  } else {
    console.log("Dialog closed");
  }
}
openCheck(dialog);

// When Start Game button is clicked
cancelButton.addEventListener("click", () => {
  dialog.close("animalNotChosen");
  openCheck(dialog);

  init();              // Set up the game balls
  animationActive = true;
  animate();           // Start animation loop
});

// Canvas setup
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");

// Track mouse position
const mouse = { x: undefined, y: undefined };

// Animation control flag
let animationActive = true;

// Config
const maxRadius = 30;
const minRadius = 10;
const colorArray = ["#012030", "#13678A", "#45C4B0", "#9AEBA3", "#DAFDBA"];

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Resize canvas and restart game
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

// Array for explosion particle effects
let sendCircles = [];

// When user clicks the canvas
window.addEventListener("click", () => {
  circleArray.forEach((item, index, object) => {
    // Check if clicked near the circle
    if (Math.abs(item.x - mouse.x + 2) < 20 && Math.abs(item.y - mouse.y - 4) < 20) {
      // Play random SFX
      const themes = ["badnik", "collapse", "jump", "spring", "tally"];
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];
      new Audio(`music/${randomTheme}.mp3`).play();

      // Remove the ball
      object.splice(index, 1);

      // Create explosion particles
      for (let i = 0; i < 100; i++) {
        createParticle(mouse.x, mouse.y);
      }

      // If no balls left, game won
      if (circleArray.length === 0) {
        playMusic("music/finished.mp3");
        setTimeout(() => {
          document.getElementById("passedModal").showModal();
        }, 3000);

        // Big explosion from center
        for (let i = 0; i < 10000; i++) {
          createParticle(canvas.width / 2, canvas.height / 2);
        }
      }
    }
  });
});

// Particle + Circle generator function
function createParticle(x, y) {
  const radius = Math.random() * 3 + 10;
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 50;
  const dx = Math.random() - 0.5;
  const dy = Math.random() - 0.5;
  const red = Math.random() * 255;
  const green = Math.random() * 255;
  const blue = Math.random() * 255;
  const dred = 1.5;
  const dgreen = -2;
  const dblue = 2.5;
  const disappear = true;

  sendCircles.push(
    new Circle(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, dx, dy, radius, red, green, blue, dred, dgreen, dblue, 0, disappear)
  );
}

// Ball or particle object
function Circle(x, y, dx, dy, radius, red, green, blue, dred, dgreen, dblue, subCircles, disappear) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.originalRadius = radius;
  this.minRadius = minRadius;
  this.red = red;
  this.green = green;
  this.blue = blue;
  this.dred = dred;
  this.dgreen = dgreen;
  this.dblue = dblue;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  this.subCircles = subCircles;
  this.counter = 0;
  this.disappear = disappear;

  // Draw the circle
  this.draw = function () {
    c.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fill();
  };

  // Update position
  this.update = function () {
    if (!this.disappear) {
      if (this.x + this.radius > innerWidth || this.x - this.radius < 0) this.dx = -this.dx;
      if (this.y + this.radius > innerHeight || this.y - this.radius < 0) this.dy = -this.dy;
    }

    // Move faster if it's an explosion
    this.x += this.dx * (this.disappear ? 40 : 1.5);
    this.y += this.dy * (this.disappear ? 50 : 2);

    this.draw();
  };
}

// Array of main balls
let circleArray = [];

// Initialize main game balls
function init() {
  circleArray = [];
  for (let i = 0; i < 7; i++) {
    const radius = Math.random() * 3 + 10;
    const x = Math.random() * (innerWidth - radius * 2) + radius;
    const y = Math.random() * (innerHeight - radius * 2) + radius;
    const dx = Math.random() - 0.5;
    const dy = Math.random() - 0.5;
    const red = Math.random() * 255;
    const green = Math.random() * 255;
    const blue = Math.random() * 255;
    const dred = 3;
    const dgreen = -4;
    const dblue = 5;

    circleArray.push(new Circle(x, y, dx, dy, radius, red, green, blue, dred, dgreen, dblue, 1));
  }
}

// Main animation loop
function animate() {
  if (!animationActive) return;
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  // Draw main balls
  for (let i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }

  // Draw explosion particles
  for (let i = 0; i < sendCircles.length; i++) {
    sendCircles[i].update();
  }
}

// Start the animation
animate();

// Music player
const myAudio = new Audio();
function playMusic(src) {
  myAudio.src = src;
  myAudio.currentTime = 0;
  myAudio.muted = false;
  myAudio.play().catch((err) => console.log("Playback error:", err));
}
function muteMusic() {
  myAudio.muted = true;
}

// Handle passedModal click (restart)
const passedModal = document.getElementById("passedModal");
passedModal.addEventListener("click", () => {
  passedModal.close();
  animationActive = false;
  c.clearRect(0, 0, canvas.width, canvas.height);
  circleArray = [];
  sendCircles = [];

  setTimeout(() => {
    dialog.showModal();
    openCheck(dialog);
  }, 100);
});
