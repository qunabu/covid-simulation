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
    const height = 80;

    this.canvas = this._wrapper.querySelector("#chart-time");
    this.canvas.setAttribute("width", width);
    this.canvas.setAttribute("height", height);
    this.context = this.canvas.getContext("2d");

    this._keys = ["healthy", "infected", "recovered", "dead", "sick"];

    this.configure();
  }

  configure(balls) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update(record) {
    if (this._myReq) {
      window.cancelAnimationFrame(this._myReq);
    }
    this._queue.push(record);
    this._myReq = window.requestAnimationFrame(this.updateVisuals.bind(this));
  }

  updateVisuals() {
    const lastRecord = this._queue[this._queue.length - 1];
    if (lastRecord) {
      this._keys.forEach(
        key =>
          (document.getElementById(`value-${key}`).innerText = lastRecord[key])
      );
    }

    const chartHeight = this._config.chartHeight;
    const total = this._config.amount;
    let record;
    let y = 0;

    while ((record = this._queue.shift())) {
      y = 0;
      this._keys.forEach(key => {
        const height = Math.round((record[key] / total) * chartHeight);
        const obj = {
          x: record.n,
          y: y,
          width: 1,
          height: height,
          fill: this._config.colors[key]
        };

        this.context.fillStyle = obj.fill;
        this.context.fillRect(obj.x, obj.y, obj.width, obj.height);
        y += height;
      });
    }
  }
}
