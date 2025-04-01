// const updateButton = document.getElementById("updateDetails");
const cancelButton = document.getElementById("cancel");
const dialog = document.getElementById("favDialog");
dialog.returnValue = "favAnimal";

function openCheck(dialog) {
  if (dialog.open) {
    console.log("Dialog open");
  } else {
    console.log("Dialog closed");
  }
}

// Update button opens a modal dialog
// updateButton.addEventListener("click", () => {
//   dialog.showModal();
//   openCheck(dialog);
// });
dialog.showModal();
openCheck(dialog);

// Form cancel button closes the dialog box
cancelButton.addEventListener("click", () => {
  dialog.close("animalNotChosen");
  openCheck(dialog);
  init();
});

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

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  // console.log(mouse);
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

var sendCircles = [];

window.addEventListener("click", function () {
  // console.log("clicked", mouse.x);
  circleArray.forEach((item, index, object) => {
    if (
      Math.abs(item.x - mouse.x + 2) < 20 &&
      Math.abs(item.y - mouse.y - 4) < 20
    ) {
      object.splice(index, 1);
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
        var disappear = true;

        sendCircles.push(
          new Circle(
            x,
            y,
            dx,
            dy,
            radius,
            red,
            green,
            blue,
            dred,
            dgreen,
            dblue,
            0,
            disappear
          )
        );
      }
    }
  });
});

function Circle(
  x,
  y,
  dx,
  dy,
  radius,
  red,
  green,
  blue,
  dred,
  dgreen,
  dblue,
  subCircles,
  disappear
) {
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
    if (!this.disappear) {
      if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }

      if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }
    }

    // // Toggle direction for red
    // if (this.red > 255 || this.red < 0) {
    //   this.dred = -this.dred;
    // }
    // // Toggle direction for green
    // if (this.green > 255 || this.green < 0) {
    //   this.dgreen = -this.dgreen;
    // }
    // // Toggle direction for blue
    // if (this.blue > 255 || this.blue < 0) {
    //   this.dblue = -this.dblue;
    // }

    this.x += this.dx * (this.disappear ? 40 : 1.5);
    this.y += this.dy * (this.disappear ? 50 : 2);

    this.counter++;
    // console.log("x", this.x, "y", this.y);
    // console.log("subCircles", this.subCircles);

    // // Update colors
    // this.red += this.dred;
    // this.green += this.dgreen;
    // this.blue += this.dblue;

    this.draw();
  };
}
var circleArray = [];
function init() {
  circleArray = [];
  for (var i = 0; i < 5; i++) {
    var radius = Math.random() * 3 + 10;
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
      new Circle(x, y, dx, dy, radius, red, green, blue, dred, dgreen, dblue, 1)
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

animate();

const myAudio = document.createElement("audio");
myAudio.src = "tetris.mp3";
// myAudio.play() ;
