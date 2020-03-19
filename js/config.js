import * as dat from "../assets/dat.gui.module.js";

export const config = (config, onSubmit) => {
  const actions = {
    restartOrRedraw: onSubmit
  };
  var gui = new dat.GUI();
  gui.add(config, "width", 500, 1500).step(1);
  gui.add(config, "height", 200, 1000).step(1);
  gui.add(config, "amount", 1, 1000).step(1);
  gui.add(config, "percInfected", 0, 1).step(0.01);
  gui.add(actions, "restartOrRedraw");
};

export default config;
