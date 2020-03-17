import * as dat from "./dat.gui.module.js";

var FizzyText = function() {
  this.message = "dat.gui";
  this.speed = 0.8;
  this.displayOutline = false;
  this.explode = function() {
    console.log("expolode");
  };
  // Define render logic ...
};

export const config = (config, onSubmit) => {
  const actions = {
    submit: onSubmit
  };
  var gui = new dat.GUI();
  gui.add(config, "width", 500, 1500);
  gui.add(config, "height", 200, 1000);
  gui.add(config, "amount", 1, 1000);
  //gui.add(text, "speed", -5, 5);
  //gui.add(text, "displayOutline");
  gui.add(actions, "submit");
};

export default config;
