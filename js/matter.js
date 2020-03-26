import "./../assets/matter.min.js";
import Ball from "./ball.js";
import { config as CONFIG, AGES } from "./config.js";
import { getRandomAge, getAgeRangeKeyByAge } from "./utils.js";
import { STATES } from "./consts.js";

const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

export const main = (
  wrapper = document.body,
  config = CONFIG,
  onUpdate = () => {}, // on Tick
  onStop = () => {}, // on Stop
  onCreate = () => {} // on Created
) => {
  const balls = [];
  const walls = [];
  const qWalls = [];
  let avg = {
    healthy: 0,
    sick: 0,
    recovered: 0,
    dead: 0,
    infected: 0
  };

  const engine = Engine.create();

  engine.world.gravity.y = 0;

  const pushSeries = n => {
    onUpdate({ ...avg, n }, balls);
  };

  const onChange = () => {
    avg = balls.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.state]: acc[curr.state] + 1
      }),
      {
        healthy: 0,
        sick: 0,
        recovered: 0,
        dead: 0,
        infected: 0
      }
    );

    if (avg.sick === 0 && avg.infected === 0) {
      stop();
    }
  };

  const render = Render.create({
    element: wrapper,
    engine: engine,
    options: {
      width: config.width,
      height: config.height,
      wireframes: false,
      background: "#ddd"
    }
  });

  const wall_opts = {
    isStatic: true
    //restitution: 1,
    //inertia: 0
  };

  const createWalls = () => {
    while (walls.length) {
      World.remove(engine.world, walls.pop());
    }

    while (qWalls.length) {
      World.remove(engine.world, qWalls.pop());
    }

    const wall_bottom = Bodies.rectangle(
      config.width / 2,
      config.height,
      config.width + config.wall,
      config.wall,
      wall_opts
    );
    const wall_up = Bodies.rectangle(
      config.width / 2,
      0,
      config.width + config.wall,
      config.wall,
      wall_opts
    );
    const wall_left = Bodies.rectangle(
      0,
      config.height / 2,
      config.wall,
      config.height + config.wall,
      wall_opts
    );
    const wall_right = Bodies.rectangle(
      config.width,
      config.height / 2,
      config.wall,
      config.height + config.wall,
      wall_opts
    );

    walls.push(wall_bottom);
    walls.push(wall_up);
    walls.push(wall_left);
    walls.push(wall_right);

    /** quarantine options  */

    //const qWidth = 1 * (Math.hypot(config.width, config.height) / 2);
    //const angle = Math.atan(config.height / config.width);

    const height = config.height * 1;
    const step = config.width / (config.quarantineWalls + 1);

    for (let i = 1; i <= config.quarantineWalls; i++) {
      const qWall = Bodies.rectangle(
        i * step,
        config.height / 2,
        1,
        height,
        wall_opts
      );

      qWalls.push(qWall);
    }

    World.add(engine.world, walls);
    World.add(engine.world, qWalls);
  };

  const createBalls = () => {
    while (balls.length) {
      const ball = balls.pop();
      World.remove(engine.world, ball.body);
    }

    const infected = Math.ceil(config.amount * config.percInfected);

    /** create array of distrubites age */
    const ages = Array.from({ length: config.amount }, (v, i) =>
      getRandomAge(config, AGES)
    );

    ages.forEach((age, i) => {
      const ball = new Ball(
        Matter.Common.random(config.wall * 3, config.width - config.wall * 3),
        Matter.Common.random(config.wall * 3, config.height - config.wall * 3),
        age,
        config
      );

      if (i < infected) {
        ball.state = STATES.infected;
      } else {
        // initial infected are always moving
        if (Math.random() < config.quarantineNotMove) {
          ball.notMoving = true;
        }
      }

      ball.onChange = onChange;

      balls.push(ball);
    });

    World.add(
      engine.world,
      balls.map(ball => ball.body)
    );
  };

  const resize = () => {
    render.canvas.width = config.width;
    render.canvas.height = config.height;
  };

  function init() {
    resize();
    createWalls();
    createBalls();
    onCreate(balls);
    onChange();
  }

  Engine.run(engine);
  Render.run(render);

  Matter.Events.on(engine, "collisionEnd", function(event) {
    event.pairs.forEach(pair => {
      if (pair.bodyA.data && pair.bodyB.data) {
        pair.bodyA.data.collide(pair.bodyB.data);
        pair.bodyB.data.collide(pair.bodyA.data);
        //stop();
      }
    });
  });

  /** https://github.com/liabru/matter-js/issues/394 */
  Matter.Resolver._restingThresh = 0.001;

  const tick = i => {
    balls.forEach(ball => ball.tick(i));
    config.quarantineWallOpen &&
      i > 100 &&
      qWalls.forEach(qWall => Matter.Body.scale(qWall, 1, 0.998));
    pushSeries(i);
  };

  const stop = () => {
    balls.forEach(ball =>
      Matter.Body.setVelocity(ball.body, {
        x: 0,
        y: 0
      })
    );
    onStop();
  };

  init();

  return {
    init,
    tick,
    stop
  };
};
