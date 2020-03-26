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
  chartHeight: 80,
  ageChartWidth: 300,
  ageChartHeight: 100,
  wall: 1, // wall thickness
  radius: 5, // radius of ball
  amount: Math.round(
    Math.sqrt(
      (window.innerWidth / (2 * 2.5)) * (window.innerHeight / (2 * 2.5))
    )
  ), // amount of balls on enter
  percInfected: 0.02, // percetage of initialy infected
  probInfection: 0.8, // propability that one ball will infect another in case of collision
  // distribution of age in population
  probInfectionSick: 0.9, // propability that infection will convert to sickness
  cyclesToRecoverOrDie: 50, // number of cycles to recover or die
  cyclesInterval: 100, // ms of each interval
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
  probFatality: 0.02, // probability of fatality
  fatalAge9: 0.00002,
  fatalAge19: 0.00006,
  fatalAge29: 0.0003,
  fatalAge39: 0.0008,
  fatalAge49: 0.0015,
  fatalAge59: 0.006,
  fatalAge69: 0.022,
  fatalAge79: 0.051,
  fatalAge100: 0.093,
  hospiAge9: 0.05,
  hospiAge19: 0.05,
  hospiAge29: 0.05,
  hospiAge39: 0.05,
  hospiAge49: 0.063,
  hospiAge59: 0.122,
  hospiAge69: 0.274,
  hospiAge79: 0.432,
  hospiAge100: 0.709,
  colors: {
    healthy: "#AAC6CA",
    infected: "#FFBA49",
    sick: "#ED2A10",
    recovered: "#CB8AC0",
    dead: "#000000"
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
    probInfectionSick: "Propability that infection will convert to sickness",
    cyclesToRecoverOrDie: "number of cycles to recover or fatal sickness",
    cyclesInterval: "time of each cycle in ms",
    casualtip: "Casual - No one washing their hands",
    normaltip: "Normal - 67,3% of pepole washing hands",
    brutaltip: "Brutal - Compulsive hand washing",
    quarantineWalls: "number of walls",
    quarantineNotMove: "Percentage of balls that are not moving",
    quarantineWallOpen: "Does wall do open after some time",
    hospLvl: "Maximal level of hospitalisation for population",
    hospiAge9: "Age 0-9 % requiring critial hospitalisation",
    hospiAge19: "Age 10-19 % requiring critial hospitalisation",
    hospiAge29: "Age 20-29 % requiring critial hospitalisation",
    hospiAge39: "Age 30-39 % requiring critial hospitalisation",
    hospiAge49: "Age 40-49 % requiring critial hospitalisation",
    hospiAge59: "Age 50-59 % requiring critial hospitalisation",
    hospiAge69: "Age 60-69 % requiring critial hospitalisation",
    hospiAge79: "Age 70-79 % requiring critial hospitalisation",
    hospiAge10: "Age 80-89 % requiring critial hospitalisation"
  },
  hospLvl: 0.2,
  hygieneLevel: 1,
  sounds: {
    dead: "../assets/sounds/dead.mp3"
  },
  quarantineWalls: 1,
  quarantineWallOpen: true,
  quarantineNotMove: 0.2
};

//extend gui

for (const contoller in dat.controllers) {
  dat.controllers[contoller].prototype.title = function(title) {
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
  f1.add(config, "cyclesInterval", 100, 1000)
    .step(100)
    .title(config.descriptions.cyclesInterval);

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

  f4.add(config, "cyclesToRecoverOrDie", 10, 100)
    .step(1)
    .title(config.descriptions.cyclesToRecoverOrDie);

  f4.add(config, "hygieneLevel", {
    casual: 1.5,
    normal: 1,
    brutal: 0.8
  })
    .title(config.descriptions.casualtip)
    .title(config.descriptions.normaltip)
    .title(config.descriptions.brutaltip);

  const f5 = gui.addFolder("Quarantine");
  f5.add(config, "quarantineWalls", 0, 5)
    .step(1)
    .title(config.descriptions.quarantineWalls);

  f5.add(config, "quarantineWallOpen", 0, 1).title(
    config.descriptions.quarantineWallOpen
  );

  f5.add(config, "quarantineNotMove", 0, 1)
    .step(0.001)
    .title(config.descriptions.quarantineNotMove);

  const f6 = gui.addFolder("Hospitalisation");
  f6.add(config, "hospLvl", 0, 1)
    .step(0.01)
    .title(config.descriptions.hospLvl);

  f6.add(config, "hospiAge9", 0, 1)
    .step(0.001)
    .title(config.descriptions.hospiAge9);
  f6.add(config, "hospiAge19", 0, 1)
    .step(0.001)
    .title(config.descriptions.hospiAge19);
  f6.add(config, "hospiAge29", 0, 1)
    .step(0.001)
    .title(config.descriptions.hospiAge29);
  f6.add(config, "hospiAge39", 0, 1)
    .step(0.001)
    .title(config.descriptions.hospiAge39);
  f6.add(config, "hospiAge49", 0, 1)
    .step(0.001)
    .title(config.descriptions.hospiAge49);
  f6.add(config, "hospiAge59", 0, 1)
    .step(0.001)
    .title(config.descriptions.hospiAge59);
  f6.add(config, "hospiAge69", 0, 1)
    .step(0.001)
    .title(config.descriptions.hospiAge69);
  f6.add(config, "hospiAge79", 0, 1)
    .step(0.001)
    .title(config.descriptions.hospiAge79);
  f6.add(config, "hospiAge100", 0, 1)
    .step(0.001)
    .title(config.descriptions.hospiAge100);

  gui
    .add(actions, "restartOrRedraw")
    .title("Press this button to restart simulation with new config");

  //colors dots
  Object.keys(config.colors).forEach(color => {
    document.getElementById(`dot-${color}`).style.backgroundColor =
      config.colors[color];
  });

  gui.remember(config);

  return {
    gui
  };
};

export default config;
