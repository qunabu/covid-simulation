// import "./../assets/d3.v5.min.js";
// this would be needed for age distribution dots diagram

export class Stats {
  constructor(wrapper = "stats", config) {
    this._queue = [];

    this._wrapper = wrapper;
    this._config = config;

    this.createChart();
  }

  createChart() {
    const width = 600;

    /** time chart  */
    this.canvas = this._wrapper.querySelector("#chart-time");
    this.canvas.setAttribute("width", width);
    this.canvas.setAttribute("height", this._config.chartHeight);
    this.context = this.canvas.getContext("2d");
    this.context.font = "10px Arial";

    this._keys = ["healthy", "infected", "recovered", "dead", "sick"];

    // svg age chart
    this.svg = this._wrapper.querySelector("#chart-ages");
    this.svg.setAttribute("width", this._config.ageChartWidth);
    this.svg.setAttribute("height", this._config.ageChartHeight);

    //y axis
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    [0, 20, 40, 60, 80].forEach(n => {
      const txt = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      const y = (1 - n / 100) * this._config.ageChartHeight;
      txt.innerHTML = n.toString();
      txt.setAttributeNS(null, "x", 1);
      txt.setAttributeNS(null, "y", y);

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      line.setAttributeNS(null, "x1", 1);
      line.setAttributeNS(null, "y1", y);
      line.setAttributeNS(null, "x2", 300);
      line.setAttributeNS(null, "y2", y);
      line.setAttributeNS(
        null,
        "style",
        "stroke:rgba(0,0,0,0.1);stroke-width:1"
      );

      group.appendChild(txt);
      group.appendChild(line);
    });

    this.svg.appendChild(group);
  }

  configure(balls) {
    if (this._circles) {
      this._prevBalls = null;
      this._circles.forEach(circle => circle.remove());
      this._circles = null;
    }

    const marginLeft = 20;
    const width = this._config.ageChartWidth - marginLeft;
    const height = this._config.ageChartHeight;
    const l = balls.length;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    balls
      .sort((a, b) => b.age - a.age)
      .forEach((ball, i) => {
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttributeNS(
          null,
          "cx",
          marginLeft + Math.round((i / l) * width)
        );
        circle.setAttributeNS(
          null,
          "cy",
          Math.round((ball.age / 100) * height)
        );
        circle.setAttributeNS(null, "r", 1);
        const color = this._config.colors[ball.state];
        circle.setAttributeNS(null, "style", `fill: ${color};`);
        this.svg.appendChild(circle);
      });

    this._circles = this.svg.querySelectorAll("circle");
  }

  updateBalls(balls) {
    // map states
    const states = balls.map((ball, i) => ({
      state: ball.state,
      i
    }));
    if (this._prevBalls) {
      /** udpate only changes */
      states
        .filter((ball, i) => ball.state !== this._prevBalls[i].state)
        .forEach(ball => {
          const color = this._config.colors[ball.state];
          this._circles[ball.i].setAttributeNS(
            null,
            "style",
            `fill: ${color};`
          );
        });
    }
    this._prevBalls = states.slice();
  }
  update(record, balls) {
    if (this._myReq) {
      window.cancelAnimationFrame(this._myReq);
    }
    this._queue.push(record);
    this._myReq = window.requestAnimationFrame(this.updateVisuals.bind(this));
    this.updateBalls(balls);
  }

  updateVisuals() {
    const lastRecord = this._queue[this._queue.length - 1];
    if (lastRecord) {
      this._keys.forEach(key => {
        if (key === "sick") {
          document.getElementById(
            `value-${key}`
          ).innerText = `${lastRecord[key]} (H: ${lastRecord.hospitalized})`;
        } else {
          document.getElementById(`value-${key}`).innerText = lastRecord[key];
        }
      });
      document.getElementById("cycle-n").innerText = lastRecord.n;
    }

    const chartHeight = this._config.chartHeight;
    const total = this._config.amount;
    let record;
    let y = 0;

    const hospY = Math.round(chartHeight * (1 - this._config.hospLvl));

    while ((record = this._queue.shift())) {
      y = 0;
      this._keys.forEach(key => {
        const height = Math.ceil((record[key] / total) * chartHeight);
        const obj = {
          x: record.n,
          y: y,
          width: 1,
          height: height,
          fill: this._config.colors[key]
        };

        this.context.fillStyle = obj.fill;
        this.context.fillRect(obj.x, obj.y, obj.width, obj.height);

        if (key === "sick") {
          this.context.fillStyle = this._config.colors.hospitalized;
          const hHeight = obj.height * (record.hospitalized / record.sick);
          this.context.fillRect(
            obj.x,
            obj.y + (obj.height - hHeight),
            obj.width,
            obj.height * (record.hospitalized / record.sick)
          );
        }

        /** hospLvl line */
        this.context.fillStyle = "#6ff542";
        this.context.fillRect(obj.x, hospY, 1, 1);

        y += height;
      });
    }
  }
}
