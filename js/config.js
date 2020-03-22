import * as dat from "../assets/dat.gui.module.js";

export const AGES = {
  distrAge9: [0, 9],
  distrAge19: [10, 19],
  distrAge29: [20, 29],
  distrAge39: [30, 39],
  distrAge49: [40, 49],
  distrAge59: [50, 59],
  distrAge69: [60, 69],
  distrAge79: [70, 79],
  distrAge100: [80, 100]
};

export const config = {
  speedMultiplier: 2, // on collision fix
  initialMaxXYSpeed: 2, // on inital max x,y speed
  minimalXYSpeed: 0.3, // minimal speed of x,y
  width: Math.round(window.innerWidth / 2), // width of canvas
  height: Math.round(window.innerHeight / 2), // height of canvas
  wall: 1, // wall thickness
  radius: 5, // radius of ball
  amount: Math.round(
    Math.sqrt(
      (window.innerWidth / (2 * 2.5)) * (window.innerHeight / (2 * 2.5))
    )
  ), // amount of balls on enter
  percInfected: 0.03, // percetage of initialy infected
  probInfection: 0.8, // propability that one ball will infect another in case of collision
  // distribution of age in population
  probInfectionSick: 0.9, // propability that infection will convert to sickness
  distrAge9: 0.03,
  distrAge19: 0.07,
  distrAge29: 0.14,
  distrAge39: 0.19,
  distrAge49: 0.2,
  distrAge59: 0.19,
  distrAge69: 0.13,
  distrAge79: 0.03,
  distrAge100: 0.02,
  // fatality rate
  fatalAge9: 0.00002,
  fatalAge19: 0.00006,
  fatalAge29: 0.0003,
  fatalAge39: 0.0008,
  fatalAge49: 0.0015,
  fatalAge59: 0.006,
  fatalAge69: 0.022,
  fatalAge79: 0.051,
  fatalAge100: 0.093,
  colors: {
    healthy: "#AAC6CA",
    infected: "#3b78e7",
    sick: "#BB641D",
    recovered: "#CB8AC0",
    dead: "#333333"
  },
  descriptions: {
    distrAge9: "Percentage of age 0-9 distribition from whole population",
    distrAge19: "Percentage of age 10-19 distribition from whole population",
    distrAge29: "Percentage of age 20-29 distribition from whole population",
    distrAge39: "Percentage of age 30-39 distribition from whole population",
    distrAge49: "Percentage of age 40-49 distribition from whole population",
    distrAge59: "Percentage of age 50-59 distribition from whole population",
    distrAge69: "Percentage of age 60-69 distribition from whole population",
    distrAge79: "Percentage of age 70-79 distribition from whole population",
    distrAge100: "Percentage of age 80-100 distribition from whole population",
    fatalAge9:
      "Percentage chance of fatal sickness of age 0-9 distribition from whole population",
    fatalAge19:
      "Percentage chance of fatal sickness of age 10-19 distribition from whole population",
    fatalAge29:
      "Percentage chance of fatal sickness of age 20-29 distribition from whole population",
    fatalAge39:
      "Percentage chance of fatal sickness of age 30-39 distribition from whole population",
    fatalAge49:
      "Percentage chance of fatal sickness of age 40-49 distribition from whole population",
    fatalAge59:
      "Percentage chance of fatal sickness of age 50-59 distribition from whole population",
    fatalAge69:
      "Percentage chance of fatal sickness of age 60-69 distribition from whole population",
    fatalAge79:
      "Percentage chance of fatal sickness of age 70-79 distribition from whole population",
    fatalAge100:
      "Percentage chance of fatal sickness of age 80-100 distribition from whole population",
    percInfected: "Percentage of initialy infected",
    probInfection:
      "Propability that one ball will infect another in case of collision",
    probInfectionSick: "Propability that infection will convert to sickness"
  },
  sounds: {
    dead: "../assets/sounds/dead.mp3",
  }
};

//extend gui

for (const contoller in dat.controllers) {
  dat.controllers[contoller].prototype.title = function (title) {
    const titleNode = document.createElement("div");
    titleNode.classList.add("tooltip");
    titleNode.innerText = title;
    this.__li.appendChild(titleNode);
    this.__li.classList.add("has-tooltip");
    return this;
  };
}

export const ConfigGui = (config, onSubmit) => {
  const actions = {
    restartOrRedraw: onSubmit
  };
  const gui = new dat.GUI();

  const f1 = gui.addFolder("Default Settings");

  f1.add(config, "width", 500, 1500).step(1);
  f1.add(config, "height", 200, 1000).step(1);
  f1.add(config, "amount", 1, 1000).step(1);

  const f2 = gui.addFolder("Age Distribution");
  f2.add(config, "distrAge9", 0, 1)
    .step(0.01)
    .title(config.descriptions.distrAge9);
  f2.add(config, "distrAge19", 0, 1)
    .step(0.01)
    .title(config.descriptions.distrAge19);
  f2.add(config, "distrAge29", 0, 1)
    .step(0.01)
    .title(config.descriptions.distrAge29);
  f2.add(config, "distrAge39", 0, 1)
    .step(0.01)
    .title(config.descriptions.distrAge39);
  f2.add(config, "distrAge49", 0, 1)
    .step(0.01)
    .title(config.descriptions.distrAge49);
  f2.add(config, "distrAge59", 0, 1)
    .step(0.01)
    .title(config.descriptions.distrAge59);
  f2.add(config, "distrAge69", 0, 1)
    .step(0.01)
    .title(config.descriptions.distrAge69);
  f2.add(config, "distrAge79", 0, 1)
    .step(0.01)
    .title(config.descriptions.distrAge79);
  f2.add(config, "distrAge100", 0, 1)
    .step(0.01)
    .title(config.descriptions.distrAge100);

  const f3 = gui.addFolder("Fatality Ratio");
  f3.add(config, "fatalAge9", 0, 1)
    .step(0.00001)
    .title(config.descriptions.fatalAge9);
  f3.add(config, "fatalAge19", 0, 1)
    .step(0.00001)
    .title(config.descriptions.fatalAge19);
  f3.add(config, "fatalAge29", 0, 1)
    .step(0.00001)
    .title(config.descriptions.fatalAge29);
  f3.add(config, "fatalAge39", 0, 1)
    .step(0.00001)
    .title(config.descriptions.fatalAge39);
  f3.add(config, "fatalAge49", 0, 1)
    .step(0.00001)
    .title(config.descriptions.fatalAge49);
  f3.add(config, "fatalAge59", 0, 1)
    .step(0.00001)
    .title(config.descriptions.fatalAge59);
  f3.add(config, "fatalAge69", 0, 1)
    .step(0.00001)
    .title(config.descriptions.fatalAge69);
  f3.add(config, "fatalAge79", 0, 1)
    .step(0.00001)
    .title(config.descriptions.fatalAge79);
  f3.add(config, "fatalAge100", 0, 1)
    .step(0.00001)
    .title(config.descriptions.fatalAge100);

  const f4 = gui.addFolder("Infection Variables");

  f4.add(config, "percInfected", 0, 1)
    .step(0.001)
    .title(config.descriptions.percInfected);

  f4.add(config, "probInfection", 0, 1)
    .step(0.001)
    .title(config.descriptions.probInfection);

  f4.add(config, "probInfectionSick", 0, 1)
    .step(0.001)
    .title(config.descriptions.probInfectionSick);

  gui.add(actions, "restartOrRedraw");

  //colors dots
  Object.keys(config.colors).forEach(color => {
    document.getElementById(`dot-${color}`).style.backgroundColor =
      config.colors[color];
  });

  return {
    gui
  };
};

export default config;
