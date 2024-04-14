//I am the best coder of all time . No one can ever beat me in terms of code .
const canvas = document.querySelector("canvas");
console.log(canvas);
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(c);

//lec 2 creating player i.e triangle
class Player {
  constructor({ position, velocity }) {
    this.position = position; //in terms of {x,y}
    this.velocity = velocity;
    this.rotation = 0;
  }
  draw() {
    c.save();
    c.translate(this.position.x, this.position.y);
    c.rotate(this.rotation);
    c.translate(-this.position.x, -this.position.y);
    c.beginPath();
    c.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
    c.fillStyle = "red";
    c.fill();
    c.closePath();

    c.moveTo(this.position.x + 30, this.position.y);
    c.lineTo(this.position.x - 10, this.position.y - 10);
    c.lineTo(this.position.x - 10, this.position.y + 10);
    c.closePath();
    c.strokeStyle = "white";
    c.stroke();
    c.restore();
  }
  //to update position
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
  getVertices() {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);

    return [
      {
        x: this.position.x + cos * 30 - sin * 0,
        y: this.position.y + sin * 30 + cos * 0,
      },
      {
        x: this.position.x + cos * -10 - sin * 10,
        y: this.position.y + sin * -10 + cos * 10,
      },
      {
        x: this.position.x + cos * -10 - sin * -10,
        y: this.position.y + sin * -10 + cos * -10,
      },
    ];
  }
}
class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 5;
  }
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.closePath();
    c.fillStyle = "white";
    c.fill();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
//class for asteroid

class Asteroid {
  constructor({ position, velocity, radius }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 30 * Math.random() + 10;
  }
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    c.closePath();
    c.strokeStyle = "white";
    c.stroke();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

const player = new Player({
  position: { x: canvas.width / 2, y: canvas.height / 2 },
  velocity: { x: 0, y: 0 },
});

console.log(player);
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },

  e: {
    pressed: false,
  },
};

const SPEED = 4;
const ROTATIONAL_SPEED = 0.5;
const FRICTION = 0.97;

const projectiles = [];
const asteroids = [];
// const asteroid = new Asteroid;
let intervalId=window.setInterval(
  () => {
    const index = Math.floor(Math.random() * 4);
    let x, y;
    let vx, vy;
    let radius = 50 * Math.floor(Math.random() * 4);
    switch (index) {
      case 0: //left
        x = 0 - radius;
        y = Math.random() * canvas.height;
        vx = 1;
        vy = 0;
        break;
      case 1: //bottom
        x = Math.random() * canvas.width;
        y = canvas.height + radius;
        vx = 0;
        vy = -1;
        break;
      case 2: //right
        x = canvas.width + radius;
        y = Math.random() * canvas.height;
        vx = -1;
        vy = 0;
        break;
      case 3: //top
        x = Math.random() * canvas.width;
        y = 0 - radius;
        vx = 0;
        vy = 1;
        break;
    }
    asteroids.push(
      new Asteroid({
        position: {
          x: x,
          y: y,
        },
        velocity: {
          x: vx,
          y: vy,
        },
        radius,
      })
    );
  },

  2000
);

function collision(circle1, circle2) {
  const xDiff = circle2.position.x - circle1.position.x;
  const yDiff = circle2.position.y - circle1.position.y;
  const final = Math.sqrt(xDiff * xDiff - yDiff * yDiff);
  if (final <= circle1.radius + circle2.radius) {
    console.log("two have collided");
    return true;
  } else return false;
}
function circleTriangleCollision(circle, triangle) {
  // Check if the circle is colliding with any of the triangle's edges
  for (let i = 0; i < 3; i++) {
    let start = triangle[i];
    let end = triangle[(i + 1) % 3];

    let dx = end.x - start.x;
    let dy = end.y - start.y;
    let length = Math.sqrt(dx * dx + dy * dy);

    let dot =
      ((circle.position.x - start.x) * dx +
        (circle.position.y - start.y) * dy) /
      Math.pow(length, 2);

    let closestX = start.x + dot * dx;
    let closestY = start.y + dot * dy;

    if (!isPointOnLineSegment(closestX, closestY, start, end)) {
      closestX = closestX < start.x ? start.x : end.x;
      closestY = closestY < start.y ? start.y : end.y;
    }

    dx = closestX - circle.position.x;
    dy = closestY - circle.position.y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= circle.radius) {
      return true;
    }
  }

  // No collision
  return false;
}

function isPointOnLineSegment(x, y, start, end) {
  return (
    x >= Math.min(start.x, end.x) &&
    x <= Math.max(start.x, end.x) &&
    y >= Math.min(start.y, end.y) &&
    y <= Math.max(start.y, end.y)
  );
}

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  console.log("successfully animinated");
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();

  console.log(projectiles.length);

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    projectile.update();
    //wastage collection
    if (
      projectile.position.x + projectile.radius < 0 ||
      projectile.position.x - projectile.radius > canvas.width ||
      projectile.position.y - projectile.radius > canvas.height ||
      projectile.position.y + projectile.radius < 0
    ) {
      projectiles.splice(i, 1);
    }
  }

  //this lloop is for asteroid manage
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    asteroid.update();
    if(circleTriangleCollision(asteroid , player.getVertices())){
      console.log("GAME OVER!!");
      window.cancelAnimationFrame(animationId)
      window.clearInterval(intervalId)
    }



         

    //adding splice fucntion
    if (
      asteroid.position.x + asteroid.radius < 0 ||
      asteroid.position.x - asteroid.radius > canvas.width ||
      asteroid.position.y - asteroid.radius > canvas.height ||
      asteroid.position.y + asteroid.radius < 0
    ) {
      asteroids.splice(i, 1);
    }

    //for loop for projectile inside loop with i they have put j
    for (let j = projectiles.length - 1; j >= 0; j--) {
      const projectile = projectiles[j];

      if (collision(asteroid, projectile)) {
        console.log("successfully done");
        asteroids.splice(i, 1);
        projectiles.splice(j, 1);
      }
    }
  }

  if (keys.w.pressed) player.velocity.x = Math.cos(player.rotation) * SPEED;
  player.velocity.y = Math.sin(player.rotation) * SPEED;
  if (!keys.w.pressed) {
    player.velocity.x = player.velocity.x * FRICTION;
    player.velocity.y = player.velocity.y * FRICTION;
  }

  if (keys.d.pressed) player.rotation += 0.05 * ROTATIONAL_SPEED;
  if (keys.e.pressed) player.rotation -= 0.05 * ROTATIONAL_SPEED;
  if (keys.a.pressed) player.velocity.x = -1 * FRICTION;
}

animate();

window.addEventListener("keydown", (event) => {
  console.log(event);
  switch (event.code) {
    case "KeyW":
      console.log("w was pressed");
      keys.w.pressed = true;
      break;
    case "KeyA":
      console.log("A was pressed");
      keys.a.pressed = true;
      break;
    case "KeyD":
      console.log("D was pressed");
      keys.d.pressed = true;
      break;
    case "KeyE":
      console.log("e was pressed");
      keys.e.pressed = true;
      break;
    case "Space":
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + Math.cos(player.rotation) * 30,
            y: player.position.y + Math.sin(player.rotation) * 30,
          },
          velocity: {
            x: Math.cos(player.rotation) * 3,
            y: Math.sin(player.rotation) * 3,
          },
        })
      );
      console.log("projectiled");
      break;
  }
});

window.addEventListener("keyup", (event) => {
  console.log(event);
  switch (event.code) {
    case "KeyW":
      console.log("w was pressed");
      keys.w.pressed = false;
      break;
    case "KeyA":
      console.log("A was pressed");
      keys.a.pressed = false;
      break;
    case "KeyD":
      console.log("D was pressed");
      keys.d.pressed = false;
      break;
    case "KeyE":
      console.log("e was pressed");
      keys.e.pressed = false;
      break;
  }
});
