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
  // distribution of age in population
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
    sick: "#BB641D",
    recovered: "#CB8AC0",
    dead: "#333333"
  }
};

export const ConfigGui = (config, onSubmit) => {
  const actions = {
    restartOrRedraw: onSubmit
  };
  var gui = new dat.GUI();

  var f1 = gui.addFolder("Default Settings");

  f1.add(config, "width", 500, 1500).step(1);
  f1.add(config, "height", 200, 1000).step(1);
  f1.add(config, "amount", 1, 1000).step(1);
  f1.add(config, "percInfected", 0, 1).step(0.01);

  var f2 = gui.addFolder("Age Distribution");
  f2.add(config, "distrAge9", 0, 1).step(0.01);
  f2.add(config, "distrAge19", 0, 1).step(0.01);
  f2.add(config, "distrAge29", 0, 1).step(0.01);
  f2.add(config, "distrAge39", 0, 1).step(0.01);
  f2.add(config, "distrAge49", 0, 1).step(0.01);
  f2.add(config, "distrAge59", 0, 1).step(0.01);
  f2.add(config, "distrAge69", 0, 1).step(0.01);
  f2.add(config, "distrAge79", 0, 1).step(0.01);
  f2.add(config, "distrAge100", 0, 1).step(0.01);

  var f3 = gui.addFolder("Fatality Ratio");
  f3.add(config, "fatalAge9", 0, 1).step(0.00001);
  f3.add(config, "fatalAge19", 0, 1).step(0.00001);
  f3.add(config, "fatalAge29", 0, 1).step(0.00001);
  f3.add(config, "fatalAge39", 0, 1).step(0.00001);
  f3.add(config, "fatalAge49", 0, 1).step(0.00001);
  f3.add(config, "fatalAge59", 0, 1).step(0.00001);
  f3.add(config, "fatalAge69", 0, 1).step(0.00001);
  f3.add(config, "fatalAge79", 0, 1).step(0.00001);
  f3.add(config, "fatalAge100", 0, 1).step(0.00001);

  gui.add(actions, "restartOrRedraw");
};

export default config;
