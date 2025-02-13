var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

var mouse = {
  x: undefined,
  y: undefined,
};

var maxRadius = 30;
var minRadius = 10;

var colorArray = ["#012030", "#13678A", "#45C4B0", "#9AEBA3", "#DAFDBA"];

console.log();

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  console.log(mouse);
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

var sendCircles = [];

window.addEventListener("click", function () {
  console.log("clicked", mouse.x);

  for (var i = 0; i < 100; i++) {
    var radius = Math.random() * 3 + 10;
    var angle = Math.random() * Math.PI * 2;
    var distance = Math.random() * 50; // Adjust 50 for the desired spread radius
    var x = mouse.x + Math.cos(angle) * distance;
    var y = mouse.y + Math.sin(angle) * distance;

    var dx = Math.random() - 0.5;
    var dy = Math.random() - 0.5;
    var red = Math.random() * 255;
    var green = Math.random() * 255;
    var blue = Math.random() * 255;
    var dred = 1.5;
    var dgreen = -2; // Step for green
    var dblue = 2.5; // Step for blue

    sendCircles.push(
      new Circle(x, y, dx, dy, radius, red, green, blue, dred, dgreen, dblue)
    );
  }
});

function Circle(x, y, dx, dy, radius, red, green, blue, dred, dgreen, dblue) {
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

  this.draw = function () {
    c.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // c.strokeStyle = "blue";
    // c.stroke();
    // c.fillStyle = this.color;
    c.fill();
  };

  this.update = function () {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    // Toggle direction for red
    if (this.red > 255 || this.red < 0) {
      this.dred = -this.dred;
    }
    // Toggle direction for green
    if (this.green > 255 || this.green < 0) {
      this.dgreen = -this.dgreen;
    }
    // Toggle direction for blue
    if (this.blue > 255 || this.blue < 0) {
      this.dblue = -this.dblue;
    }

    this.x += this.dx;
    this.y += this.dy;

    // Update colors
    this.red += this.dred;
    this.green += this.dgreen;
    this.blue += this.dblue;

    this.draw();
  };
}
var circleArray = [];
function init() {
  circleArray = [];
  for (var i = 0; i < 10; i++) {
    var radius = Math.random() * 3 + 1;
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2) + radius;
    var dx = Math.random() - 0.5;
    var dy = Math.random() - 0.5;
    var red = Math.random() * 255;
    var green = Math.random() * 255;
    var blue = Math.random() * 255;
    var dred = 3;
    var dgreen = -4; // Step for green
    var dblue = 5; // Step for blue

    circleArray.push(
      new Circle(x, y, dx, dy, radius, red, green, blue, dred, dgreen, dblue)
    );
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  for (var i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }
  for (var i = 0; i < sendCircles.length; i++) {
    sendCircles[i].update();
  }
}

init();

animate();
