/** one Tick 100ms */
const TICK_RECOVER = 50;

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
        lineWidth: 1
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
    this.state = "healthy";
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
        case "sick":
        case "healthy":
          this._tick = 0;
          break;
        case "dead":
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
    if (this.state !== "healthy") {
      this._tick++;
    }

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

  collide(ballB) {
    if (this.state === "healthy" && ballB.state === "sick") {
      /** TODO propability of sicknes, based on age */
      if (Math.random() > 0.5) {
        this.state = "sick";
      }
    }
  }

  onChange() {
    // console.log("change interanal");
  }
}
