var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

// c.fillStyle = "rgba(255, 0, 0, 0.5)";
// c.fillRect(100, 100, 100, 100);
// c.fillStyle = "rgba(0, 0, 255, 0.5)";
// c.fillRect(400, 100, 100, 100);
// c.fillStyle = "rgba(255, 0, 255, 0.5)";
// c.fillRect(300, 300, 100, 100);
// console.log(canvas);

// Line
// c.beginPath();
// c.moveTo(50, 300);
// c.lineTo(300, 100);
// c.lineTo(400, 300);
// c.strokeStyle = "#fa23a3";
// c.stroke();

// Arc / Circle
// c.beginPath();
// c.arc(300, 300, 30, 0, Math.PI * 2, false);
// c.strokeStyle = "blue";
// c.stroke();

// for (var i = 0; i < 100; i++) {
//   var x = Math.random() * window.innerWidth;
//   var y = Math.random() * window.innerHeight;
//   var color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
//     Math.random() * 255
//   })`;
//   c.beginPath();
//   c.arc(x, y, 30, 0, Math.PI * 2, false);
//   c.strokeStyle = color;
//   c.stroke();
// }

function Circle(x, y, dx, dy, radius, red, green, blue, dred) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.red = red;
  this.green = green;
  this.blue = blue;
  this.dred = dred;

  this.draw = function () {
    c.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = "blue";
    c.stroke();
    c.fill();
  };

  this.update = function () {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    if (this.red > 255 || this.red < 0) {
      this.dred = -this.dred;
    }

    this.x += this.dx;
    this.y += this.dy;
    console.log("dred", dred);
    this.red += this.dred;
    // console.log(red);

    this.draw();
  };
}

var circleArray = [];

for (var i = 0; i < 100; i++) {
  var radius = 30;
  var x = Math.random() * (innerWidth - radius * 2) + radius;
  var y = Math.random() * (innerHeight - radius * 2) + radius;
  var dx = Math.random() - 0.5;
  var dy = Math.random() - 0.5;
  var red = Math.random() * 255;
  var green = Math.random() * 255;
  var blue = Math.random() * 255;
  var dred = 1;

  circleArray.push(new Circle(x, y, dx, dy, radius, red, dred, green, blue));
}

console.log(circleArray);

var circle = new Circle(200, 200, 3, 3, 30);

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  for (var i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }
}

animate();
