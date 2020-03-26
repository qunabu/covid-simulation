import { STATES } from "./consts.js";
import { AGES } from "./config.js";
import { getAgeRangeKeyByAge } from "./utils.js";

const DEFAULT_OPTS = {
  frictionAir: 0,
  friction: 0,
  frictionStatic: 0,
  inertia: Infinity,
  restitution: 1.01,
  mass: 1000
};

export default class Ball {
  constructor(x, y, age = 15, config) {
    this._config = config;

    // physiscs
    this._body = Matter.Bodies.circle(x, y, 5, {
      ...DEFAULT_OPTS,
      render: {
        fillStyle: "#F35e66",
        strokeStyle: "black",
        lineWidth: 0
      }
    });
    this._body.data = this;

    Matter.Body.applyForce(this._body, this._body.position, {
      x: Matter.Common.random(
        -this._config.initialMaxXYSpeed,
        this._config.initialMaxXYSpeed
      ),
      y: Matter.Common.random(
        -this._config.initialMaxXYSpeed,
        this._config.initialMaxXYSpeed
      )
    });

    // initial states
    this._tick = 0;
    this.state = STATES.healthy;
    this._age = age;
    this._notMoving = false;

    this._probFatality =
      config[getAgeRangeKeyByAge(AGES)(age).replace("distr", "fatal")];
  }

  set notMoving(value) {
    Matter.Body.setVelocity(this.body, {
      x: value
        ? 0
        : Matter.Common.random(
            -this._config.initialMaxXYSpeed,
            this._config.initialMaxXYSpeed
          ),
      y: value
        ? 0
        : Matter.Common.random(
            -this._config.initialMaxXYSpeed,
            this._config.initialMaxXYSpeed
          )
    });
    Matter.Body.setMass(this.body, value ? Infinity : DEFAULT_OPTS.mass);

    this._notMoving = value;
  }

  get age() {
    return this._age;
  }

  get body() {
    return this._body;
  }

  set state(value) {
    if (this._state !== value) {
      this._state = value;
      this.color = this._config.colors[value];
      this.onChange();
      switch (value) {
        case STATES.sick:
        case STATES.infected:
        case STATES.healthy:
          this._tick = 0;
          break;
        case STATES.dead:
          new Audio(this._config.sounds[value]).play();
          this.die();
          break;
        default:
          break;
      }
    }
  }

  get state() {
    return this._state;
  }

  set color(value) {
    this._color = value;
    this._body.render.fillStyle = value;
  }

  get color() {
    return this._color;
  }

  die() {
    this.notMoving = true;
  }

  tick() {
    if (this.state !== STATES.healthy) {
      this._tick++;
    }

    if (this.state === STATES.infected) {
      if (
        this._tick++ > this._config.cyclesToRecoverOrDie &&
        Math.random() > 0.8
      ) {
        if (Math.random() <= this._config.probInfectionSick) {
          this.state = STATES.sick;
        }
      }
    }

    if (this.state === STATES.sick) {
      if (
        this._tick++ > this._config.cyclesToRecoverOrDie &&
        Math.random() > 0.8
      ) {
        this.state =
          Matter.Common.random(0, 1) < this._probFatality
            ? STATES.dead
            : STATES.recovered;
      }
    }
  }

  collide(ballB) {
    if (
      this.state === STATES.healthy &&
      (ballB.state === STATES.infected || ballB.state === STATES.sick)
    ) {
      /** TODO probability of sicknes, based on age */
      if (
        Math.random() <
        this._config.probInfection * this._config.hygieneLevel
      ) {
        this.state = STATES.infected;
      }
    }
  }

  onChange() {
    // console.log("change interanal");
  }
}
