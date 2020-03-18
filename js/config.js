import * as dat from "./dat.gui.module.js";

export const config = (config, onSubmit) => {
  const actions = {
    submit: onSubmit
  };
  var gui = new dat.GUI();
  gui.add(config, "width", 500, 1500);
  gui.add(config, "height", 200, 1000);
  gui.add(config, "amount", 1, 1000);
  gui.add(actions, "submit");
};

export default config;
