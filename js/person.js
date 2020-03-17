import { randomDx, randomDy } from "./utils.js";

const COLORS = {
  healthy: "#AAC6CA",
  sick: "#BB641D",
  recovered: "#CB8AC0",
  dead: "#333333"
};

const TICK_RECOVER = 100;

export default class Ball {
  constructor(x, y, ctx, radius = 10, speed = 5, age = 15) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.ctx = ctx;

    this._tick = 0;

    this.maxspeed = 1;

    /** speed & age are related */

    this.dx = randomDx(speed);
    this.dy = randomDy(speed);

    // mass is that of a sphere as opposed to circle
    // it *does* make a difference in how realistic it looks
    this.mass = this.radius * this.radius * this.radius;
    this.state = "healthy";
  }

  set dx(value) {
    this._dx = value > this.maxspeed ? this.maxspeed : value;
    this._dx = value < -this.maxspeed ? -this.maxspeed : value;
  }

  get dx() {
    return this._state === "dead" ? 0 : this._dx;
  }

  set dy(value) {
    this._dy = value > this.maxspeed ? this.maxspeed : value;
    this._dy = value < -this.maxspeed ? -this.maxspeed : value;
  }

  get dy() {
    return this._state === "dead" ? 0 : this._dy;
  }

  set state(value) {
    if (this._state !== value) {
      this._state = value;
      this.color = COLORS[value];
      this.onChange();
    }
  }

  get state() {
    return this._state;
  }

  set color(value) {
    this._color = value;
    this.ctx.beginPath();
    this.ctx.arc(
      Math.round(this.x),
      Math.round(this.y),
      this.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = value;
    this.ctx.fill();
    this.ctx.closePath();
  }

  get color() {
    return this._color;
  }

  tick() {
    if (this.state === "sick") {
      /** ADD dead state  */
      if (this._tick++ > TICK_RECOVER) {
        const rnd = Math.random();
        if (rnd > 0.5) {
          this.state = "recovered";
        } else {
          this.state = "dead";
        }
      }
    }
  }

  collide(person) {
    if (this.state === "healthy" && person.state === "sick") {
      /** TODO propability of sicknes, based on age */
      if (Math.random() > 0.5) {
        this.state = "sick";
      }
    }
    //this.color = "rgba(255,255,0,1)";
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(
      Math.round(this.x),
      Math.round(this.y),
      this.radius,
      0,
      2 * Math.PI
    );
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();

    this.tick();
  }

  onChange() {
    console.log("change interanal");
  }

  speed() {
    // magnitude of velocity vector
    return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  }
  angle() {
    // velocity's angle with the x axis
    return Math.atan2(this.dy, this.dx);
  }
  onGround() {
    return this.y + this.radius >= canvas.height;
  }
}
