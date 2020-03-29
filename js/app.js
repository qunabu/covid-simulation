import { Stats } from "./stats.js";
import { config as CONFIG, ConfigGui, defaultConfig } from "./config.js";
import { timer, diff, obj2urlParams } from "./utils.js";
import { main } from "./matter.js";

const stats = new Stats(document.getElementById("stats"), CONFIG);

const urlOpts = () => {
  //find differences and push to history
  let changes = diff(CONFIG, defaultConfig);
  changes = {
    width: CONFIG.width,
    height: CONFIG.height,
    amount: CONFIG.amount,
    ...changes
  };
  history.pushState(changes, document.title, "?" + obj2urlParams(changes));

  const height = changes.height + 140; // app + stats
  const width = changes.width < 1040 ? 1040 : changes.width;

  document
    .getElementById("sharer")
    .querySelector(
      "textarea"
    ).value = `<iframe src="${window.location.href}&iframe=1" width="${width}" height="${height}"></iframe>`;

  /*
  document.querySelector(".a-open").href = window.location.href.split(
    "&iframe=1"
  )[0];

  document.querySelector(".a-open").href = "https://onet.pl";
  */
};

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
  urlOpts();
  document.body.classList.remove("restart");
};

const stop = () => {
  t.stop();
  document.body.classList.add("restart");
  //app.stop();
};

ConfigGui(CONFIG, () => {
  restart();
});

if (CONFIG.iframe) {
  document.body.classList.add("iframe");
}

// copy to clipboard
document
  .getElementById("sharer")
  .querySelector("textarea")
  .addEventListener("click", e => {
    e.target.select();
    document.execCommand("copy");
    const tipEl = document.getElementById("sharer-tip");
    const prevText = tipEl.innerText;
    tipEl.innerText = "URL has been copied";
    setTimeout(() => (tipEl.innerText = prevText), 3000);
  });

urlOpts();

//restart btn

document.getElementById("btn-restart").addEventListener("click", () => {
  restart();
});
