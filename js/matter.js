import "./../assets/matter.min.js";
import Ball from "./ball.js";
import { config as CONFIG, ConfigGui, AGES } from "./config.js";
import { Stats } from "./stats.js";
import { getRandomAge, getAgeRangeKeyByAge, timer } from "./utils.js";
import { STATES } from "./consts.js";

const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

const main = (
  wrapper = document.body,
  config = CONFIG,
  onUpdate = () => {},
  onStop = () => {}
) => {
  const balls = [];
  const walls = [];
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
    onUpdate({ ...avg, n });
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
      background: "#000"
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

    /** create array of distrubites age */
    const ages = Array.from({ length: config.amount }, (v, i) =>
      getRandomAge(config, AGES)
    );

    ages.forEach((age, i) => {
      const ball = new Ball(
        Matter.Common.random(config.wall * 3, config.width - config.wall * 3),
        Matter.Common.random(config.wall * 3, config.height - config.wall * 3),
        age,
        {
          ...config,
          probFatality:
            config[getAgeRangeKeyByAge(AGES)(age).replace("distr", "fatal")]
        }
      );

      if (i < infected) {
        ball.state = STATES.infected;
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

const stats = new Stats(document.getElementById("stats"), CONFIG);

const app = main(
  document.getElementById("app"),
  CONFIG,
  series => {
    stats.update(series);
  },
  () => {
    stop();
  }
);

const t = timer(100, tick => {
  app.tick(tick);
});

const restart = () => {
  t.restart();
  app.init();
  stats.configure();
};

const stop = () => {
  t.stop();
  //app.stop();
};

ConfigGui(CONFIG, () => {
  restart();
});

window.addEventListener("keyup", e => e.which === 80 && stop());
