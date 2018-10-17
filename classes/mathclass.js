const dat = require('dat.gui');
import lib from './lib'
class MathClass {
  constructor(props) {
    this.state = {
      innerWidth: 0,
      innerHeight: 0,
      ctx: null,
      canvas: null,
      gui: null,
      drawTimer: null,
      fadeTimer: null,
      //specific stuff
      circles: [],
      numOfCircles: 30,
      vU: 1.075,
      vQ: 0.03,
      maxSize: 200,
      maxLineWidth: 0.6,
      fadeTime: 5000,
      drawTime: 40,
    }
    this.cleanup = this.cleanup.bind(this)
    this.createCircle = this.createCircle.bind(this)
  }
  cleanup() {
    this.state.gui.destroy()
  }
  initCanvas() {
    this.state.canvas = document.getElementById("canvas")
    this.state.innerHeight = this.state.canvas.innerHeight = this.state.canvas.height = window.innerHeight * 0.9
    this.state.innerWidth = this.state.canvas.innerWidth = this.state.canvas.width = window.innerWidth * 0.9
    this.state.ctx = this.state.canvas.getContext("2d")
    this.state.gui = new dat.GUI({ width: 310 })
    this.addGui()
    this.initData()
  }
  addGui() {
    let controller = {
      numOfCircles: this.state.numOfCircles,
      vU: this.state.vU,
      vQ: this.state.vQ,
      maxSize: this.state.maxSize,
      maxLineWidth: this.state.maxLineWidth,
      fadeTime: this.state.fadeTime,
      drawTime: this.state.drawTime,
    }
    this.state.gui.add(controller, 'numOfCircles', 1, 50).step(1).name('Number of circles').onChange((value) => {
      if (this.state.numOfCircles === value) return
      this.state.numOfCircles = value
      this.initData()
    })
    this.state.gui.add(controller, 'vU', 0.001, 4.000).step(0.025).name('Velocity U').onChange((value) => {
      if (this.state.vU === value) return
      this.state.vU = value
    })
    this.state.gui.add(controller, 'vQ', 0.001, 0.200).step(0.001).name('Velocity Q').onChange((value) => {
      if (this.state.vQ === value) return
      this.state.vQ = value
    })
    this.state.gui.add(controller, 'maxSize', 1, 200).step(1).name('Max Size').onChange((value) => {
      if (this.state.maxSize === value) return
      this.state.maxSize = value
    })
    this.state.gui.add(controller, 'maxLineWidth', 0.1, 1).step(0.1).name('Max Line width').onChange((value) => {
      if (this.state.maxLineWidth === value) return
      this.state.maxLineWidth = value
    })
    this.state.gui.add(controller, 'fadeTime', 60, 10000).step(5).name('Fade Time (ms)').onChange((value) => {
      if (this.state.fadeTime === value) return
      this.state.fadeTime = value
      clearInterval(this.state.fadeTimer)
      this.state.fadeTimer = setInterval(this.fade.bind(this), this.state.fadeTime)
    })
    this.state.gui.add(controller, 'drawTime', 10, 60).step(5).name('Draw Time (ms)').onChange((value) => {
      if (this.state.drawTime === value) return
      this.state.drawTime = value
      clearInterval(this.state.drawTimer)
      this.state.drawTimer = setInterval(() => { this.draw() }, this.state.drawTime)
    })
  }
  _fill(color, x, y) {
    lib._fill(this.state.ctx, color, x, y, this.state.innerWidth, this.state.innerHeight)
  }
  fade() {
    lib.cvFade(this.state.ctx, 'rgba(0,0,0, 0.1)', this.state.innerWidth, this.state.innerHeight)
  }
  stop() {
    clearInterval(this.state.fadeTimer)
    clearInterval(this.state.drawTimer)
  }
  start() {
    this.state.drawTimer = setInterval(() => { this.draw() }, this.state.drawTime)
    this.state.fadeTimer = setInterval(this.fade.bind(this), this.state.fadeTime)
  }
  createCircles() {
    let count = this.state.numOfCircles
    this.state.circles = []
    while (count--) {
      this.state.circles.push(new this.createCircle(this.state))
    }
  }
  createCircle(state) {
    const clr = () => {
      return `rgba(${~~(Math.random() * 255)},${~~(Math.random() * 255)},${~~(Math.random() * 255)},${Math.random()})`
    }
    this.x = Math.random() * state.innerWidth
    this.y = Math.random() * state.innerHeight
    this.vx = this.vy = Math.random() * state.vU - (state.vU / 2)
    this.veerx = this.veery = Math.random() * state.vQ - (state.vQ / 2)
    this.colors = []
    let count = 8
    while (count--) {
      this.colors.push(clr())
    }
    this.radius = 10 + Math.random() * state.maxSize
    this.angle = ~~(Math.random() * 360)
    this.inc = Math.random() * (Math.PI / 3)
    this.lineWidth = Math.random() * state.maxLineWidth
  }

  initData() {
    //create the circles
    this.createCircles()
  }

  draw() {
    let ctx = this.state.ctx
    this.state.circles.forEach((circle, i) => {
      ctx.lineWidth = circle.lineWidth
      ctx.shadowOffsetX = ctx.shadowOffsetY = circle.radius / 20
      let sin = Math.sin(circle.angle * Math.PI / 180) * circle.radius
      let cos = Math.cos(circle.angle * Math.PI / 180) * circle.radius

      ctx.shadowColor = circle.colors[0]
      ctx.strokeStyle = circle.colors[1]
      lib.lineTo(ctx, circle.x, circle.y, circle.x - cos, circle.y + sin);

      ctx.strokeStyle = circle.colors[2];
      ctx.shadowColor = circle.colors[3];
      lib.lineTo(ctx, circle.x, circle.y, circle.x + cos, circle.y - sin);

      ctx.strokeStyle = circle.colors[4];
      ctx.shadowColor = circle.colors[5];
      lib.lineTo(ctx, circle.x, circle.y, circle.x + cos, circle.y + sin);

      ctx.strokeStyle = circle.colors[6];
      ctx.shadowColor = circle.colors[7];
      lib.lineTo(ctx, circle.x, circle.y, circle.x - cos, circle.y - sin);

      circle.x += circle.vx;
      circle.y += circle.vy;
      circle.vx += circle.veerx * Math.cos(circle.angle * Math.PI / 180);
      circle.vy -= circle.veery * Math.sin(circle.angle * Math.PI / 180);

      circle.angle += circle.inc;
      circle.radius -= .01;
      circle.angle = circle.angle > 360 ? circle.angle - 360
        : circle.angle < 0 ? 360 + circle.angle
          : circle.angle
      ctx.beginPath();

      //once offscreen, replace it
      let W = this.state.innerWidth
      let H = this.state.innerHeight
      if (circle.x > W + (W / 2) ||
        circle.x < -(W / 2) ||
        circle.y > H + H / 2 ||
        circle.y < -(H / 2) ||
        circle.radius <= 0.05) {
        this.state.circles[i] = new this.createCircle(this.state);
      }
    })
  }
}
export default MathClass
