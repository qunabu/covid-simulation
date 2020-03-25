import { Stats } from "./stats.js";
import { config as CONFIG, ConfigGui } from "./config.js";
import { timer } from "./utils.js";
import { main } from "./matter.js";

const stats = new Stats(document.getElementById("stats"), CONFIG);

const app = main(
  document.getElementById("app"),
  CONFIG,
  (series, balls) => stats.update(series, balls),
  () => stop(),
  balls => stats.configure(balls)
);

const t = timer(100, tick => {
  app.tick(tick);
});

const restart = () => {
  t.restart();
  app.init();
};

const stop = () => {
  t.stop();
  //app.stop();
};

ConfigGui(CONFIG, () => {
  restart();
});
