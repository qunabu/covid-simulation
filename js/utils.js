export function randomX(canvas, margin = 30) {
  let x = Math.floor(Math.random() * canvas.width);
  if (x < margin) {
    x = margin;
  } else if (x + margin > canvas.width) {
    x = canvas.width - margin;
  }
  return x;
}

export function randomY(canvas, margin = 30) {
  let y = Math.floor(Math.random() * canvas.height);
  if (y < margin) {
    y = margin;
  } else if (y + margin > canvas.height) {
    y = canvas.height - margin;
  }
  return y;
}

export function randomDx(speed = 10) {
  let r = Math.floor(Math.random() * speed - speed / 2);
  return r;
}

export function randomDy(speed = 10) {
  let r = Math.floor(Math.random() * speed - speed / 2);
  return r;
}

export function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
