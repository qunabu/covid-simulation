import { randomX, randomY, distance } from "./utils.js";

import Ball from "./person.js";

const CONFIG = {
  radius: 3,
  amount: 100,
  width: 900,
  height: 400
};

const main = (wrapper = document.body, config = CONFIG) => {
  let canvas = document.createElement("canvas");
  canvas.setAttribute("width", config.width);
  canvas.setAttribute("height", config.height);
  wrapper.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const objArray = [];
  let paused = false;
  let lastTime = new Date().getTime();
  let currentTime = 0;
  let dt = 0;

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function canvasBackground() {
    canvas.style.backgroundColor = "rgb(215, 235, 240)";
  }

  function wallCollision(ball) {
    if (
      ball.x - ball.radius + ball.dx < 0 ||
      ball.x + ball.radius + ball.dx > canvas.width
    ) {
      ball.dx *= -1;
    }
    if (
      ball.y - ball.radius + ball.dy < 0 ||
      ball.y + ball.radius + ball.dy > canvas.height
    ) {
      ball.dy *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
      ball.y = canvas.height - ball.radius;
    }
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
    }
    if (ball.x + ball.radius > canvas.width) {
      ball.x = canvas.width - ball.radius;
    }
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
    }
  }

  function ballCollision() {
    for (let i = 0; i < objArray.length - 1; i++) {
      for (let j = i + 1; j < objArray.length; j++) {
        let ob1 = objArray[i];
        let ob2 = objArray[j];
        let dist = distance(ob1, ob2);

        if (dist < ob1.radius + ob2.radius) {
          let theta1 = ob1.angle();
          let theta2 = ob2.angle();
          let phi = Math.atan2(ob2.y - ob1.y, ob2.x - ob1.x);
          let m1 = ob1.mass;
          let m2 = ob2.mass;
          let v1 = ob1.speed();
          let v2 = ob2.speed();

          const ob1Dx = ob1.dx;
          const ob1Dy = ob1.dy;
          const ob2Dx = ob2.dx;
          const ob2Dy = ob2.dy;

          let dx1F =
            ((v1 * Math.cos(theta1 - phi) * (m1 - m2) +
              2 * m2 * v2 * Math.cos(theta2 - phi)) /
              (m1 + m2)) *
              Math.cos(phi) +
            v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
          let dy1F =
            ((v1 * Math.cos(theta1 - phi) * (m1 - m2) +
              2 * m2 * v2 * Math.cos(theta2 - phi)) /
              (m1 + m2)) *
              Math.sin(phi) +
            v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
          let dx2F =
            ((v2 * Math.cos(theta2 - phi) * (m2 - m1) +
              2 * m1 * v1 * Math.cos(theta1 - phi)) /
              (m1 + m2)) *
              Math.cos(phi) +
            v2 * Math.sin(theta2 - phi) * Math.cos(phi + Math.PI / 2);
          let dy2F =
            ((v2 * Math.cos(theta2 - phi) * (m2 - m1) +
              2 * m1 * v1 * Math.cos(theta1 - phi)) /
              (m1 + m2)) *
              Math.sin(phi) +
            v2 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);

          ob1.dx = dx1F;
          ob1.dy = dy1F;
          ob2.dx = dx2F;
          ob2.dy = dy2F;

          if (
            ob1.dx !== ob1Dx ||
            ob1.dy !== ob1Dy ||
            ob2.dx !== ob2Dx ||
            ob2.dy !== ob2Dy
          ) {
            ob1.collide(ob2);
            ob2.collide(ob1);
          }

          staticCollision(ob1, ob2);
        }
      }
      wallCollision(objArray[i]);
    }

    if (objArray.length > 0) wallCollision(objArray[objArray.length - 1]);
  }

  function staticCollision(ob1, ob2, emergency = false) {
    let overlap = ob1.radius + ob2.radius - distance(ob1, ob2);
    let smallerObject = ob1.radius < ob2.radius ? ob1 : ob2;
    let biggerObject = ob1.radius > ob2.radius ? ob1 : ob2;

    // When things go normally, this line does not execute.
    // "Emergency" is when staticCollision has run, but the collision
    // still hasn't been resolved. Which implies that one of the objects
    // is likely being jammed against a corner, so we must now move the OTHER one instead.
    // in other words: this line basically swaps the "little guy" role, because
    // the actual little guy can't be moved away due to being blocked by the wall.
    if (emergency)
      [smallerObject, biggerObject] = [biggerObject, smallerObject];

    let theta = Math.atan2(
      biggerObject.y - smallerObject.y,
      biggerObject.x - smallerObject.x
    );
    smallerObject.x -= overlap * Math.cos(theta);
    smallerObject.y -= overlap * Math.sin(theta);

    if (distance(ob1, ob2) < ob1.radius + ob2.radius) {
      // we don't want to be stuck in an infinite emergency.
      // so if we have already run one emergency round; just ignore the problem.
      if (!emergency) staticCollision(ob1, ob2, true);
    }
  }

  function moveObjects() {
    for (let i = 0; i < objArray.length; i++) {
      let ob = objArray[i];
      ob.x += ob.dx * dt;
      ob.y += ob.dy * dt;
    }
  }

  function drawObjects() {
    for (let obj in objArray) {
      objArray[obj].draw();
    }
  }

  function draw() {
    currentTime = new Date().getTime();
    dt = (currentTime - lastTime) / 1000; // delta time in seconds

    // dirty and lazy solution
    // instead of scaling up every velocity vector the program
    // we increase the speed of time
    dt *= 50;

    clearCanvas();
    canvasBackground();

    if (!paused) {
      moveObjects();
      ballCollision();
    }

    drawObjects();

    lastTime = currentTime;
    window.requestAnimationFrame(draw);
  }

  // spawn the initial small thingies.
  for (let i = 0; i < config.amount; i++) {
    objArray[objArray.length] = new Ball(
      randomX(config),
      randomY(config),
      ctx,
      config.radius
    );
  }

  // one is sick

  objArray[0].state = "sick";

  draw();
};

main();
