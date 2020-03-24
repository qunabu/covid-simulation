/** one Tick 100ms */
import {STATES} from "./consts.js";

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

    /*
    Matter.Body.applyForce(this._body, this._body.position, {
      x: 1,
      y: 1
    });
    */

    this._tick = 0;
    this.state = STATES.healthy;
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
    Matter.Body.setVelocity(this.body, {
      x: 0,
      y: 0
    });
    Matter.Body.setMass(this.body, Infinity);
  }

  tick() {
    if (this.state !== STATES.healthy) {
      this._tick++;
    }

    //*** this is temporary to be replaced by better algortithm -start- */

    if (this.state === STATES.infected) {
      if (this._tick++ > this._config.cyclesToRecoverOrDie) {
        if (Math.random() <= this._config.probInfectionSick) {
          this.state = STATES.sick;
        }
      }
    }

    //*** this is temporary to be replaced by better algortithm -end- */

    if (this.state === STATES.sick) {
      if (this._tick++ > this._config.cyclesToRecoverOrDie) {
        this.state =
          Matter.Common.random(0, 1) < this._config.probFatality
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
      if (Math.random() < this._config.probInfection) {
        this.state = STATES.infected;
      }
    }
  }

  onChange() {
    // console.log("change interanal");
  }
}
