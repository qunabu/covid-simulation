import Ball from "./ball.js";
import { config as CONFIG, ConfigGui, AGES } from "./config.js";
import { getRandomAge } from "./utils.js";

const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

const main = (wrapper = document.body, config = CONFIG) => {
  const balls = [];
  const walls = [];
  const series = [];

  const engine = Engine.create();

  engine.world.gravity.y = 0;
  engine.world.gravity.y = 0;

  const pushSeries = row => {
    series.push(row);
  };

  const onChange = () => {
    const avg = balls.reduce(
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

    Object.keys(avg).forEach(
      key => (document.getElementById(`value-${key}`).innerText = avg[key])
    );

    pushSeries(avg);

    if (avg.sick === 0 && avg.infected === 0) {
      stop();
    }
  };

  const render = Render.create({
    element: document.getElementById("app"),
    engine: engine,
    options: {
      width: config.width,
      height: config.height,
      wireframes: false
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

    World.add(engine.world, walls);
  };

  const createBalls = () => {
    while (balls.length) {
      const ball = balls.pop();
      World.remove(engine.world, ball.body);
    }

    const infected = Math.ceil(config.amount * config.percInfected);

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
      ball.onChange = onChange;

      if (i < infected) {
        ball.state = "sick";
      }

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
    while (series.length) {
      series.pop();
    }
    resize();
    createWalls();
    createBalls();
  }

  Engine.run(engine);
  Render.run(render);

  Matter.Events.on(engine, "collisionEnd", function(event) {
    event.pairs.forEach(pair => {
      if (pair.bodyA.data && pair.bodyB.data) {
        pair.bodyA.data.collide(pair.bodyB.data);
        pair.bodyB.data.collide(pair.bodyA.data);
      }
    });
  });

  /** https://github.com/liabru/matter-js/issues/394 */
  Matter.Resolver._restingThresh = 0.001;

  const tick = i => {
    balls.forEach(ball => ball.tick(i));
  };

  const stop = () => {
    balls.forEach(ball =>
      Matter.Body.setVelocity(ball.body, {
        x: 0,
        y: 0
      })
    );
  };

  init();

  return {
    init,
    tick
  };
};

const app = main();

let timer = setInterval(() => app.tick(timer++), 100);

ConfigGui(CONFIG, app.init);
