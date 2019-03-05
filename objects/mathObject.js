import {lib} from '../helpers/'
import parentObject from './parentObject'
export const MathObject = {
  //specific stuff
  circles: [],
  numOfCircles: 31,
  vU: 1.075,
  vQ: 0.03,
  maxSize: 200,
  maxLineWidth: 0.6,
  fadeTime: 5000,
  drawTime: 40,
  addGui(){
    let controller = {
      numOfCircles: this.numOfCircles,
      vU: this.vU,
      vQ: this.vQ,
      maxSize: this.maxSize,
      maxLineWidth: this.maxLineWidth,
      fadeTime: this.fadeTime,
      drawTime: this.drawTime,
    }
    this.gui.add(controller, 'numOfCircles', 1, 50).step(1).name('Number of circles').onChange((value) => {
      if (this.numOfCircles === value) return
      this.numOfCircles = value
      this.initData()
    })
    this.gui.add(controller, 'vU', 0.001, 4.000).step(0.025).name('Velocity U').onChange((value) => {
      if (this.vU === value) return
      this.vU = value
    })
    this.gui.add(controller, 'vQ', 0.001, 0.200).step(0.001).name('Velocity Q').onChange((value) => {
      if (this.vQ === value) return
      this.vQ = value
    })
    this.gui.add(controller, 'maxSize', 1, 200).step(1).name('Max Size').onChange((value) => {
      if (this.maxSize === value) return
      this.maxSize = value
    })
    this.gui.add(controller, 'maxLineWidth', 0.1, 1).step(0.1).name('Max Line width').onChange((value) => {
      if (this.maxLineWidth === value) return
      this.maxLineWidth = value
    })
    this.gui.add(controller, 'fadeTime', 60, 10000).step(5).name('Fade Time (ms)').onChange((value) => {
      if (this.fadeTime === value) return
      this.fadeTime = value
      clearInterval(this.fadeTimer)
      this.fadeTimer = setInterval(() => { this.fade() }, this.fadeTime)
    })
    this.gui.add(controller, 'drawTime', 10, 60).step(5).name('Draw Time (ms)').onChange((value) => {
      if (this.drawTime === value) return
      this.drawTime = value
      clearInterval(this.drawTimer)
      this.drawTimer = setInterval(() => { this.draw() }, this.drawTime)
    })
  },
  initData(){
    this.createCircles()
  },
  draw(){
    this.circles.forEach((circle, i) =>{
      this.ctx.lineWidth = circle.lineWidth
      this.ctx.shadowOffsetX = this.ctx.shadowOffsetY = circle.radius / 20
      let sin = Math.sin(circle.angle * Math.PI / 180) * circle.radius
      let cos = Math.cos(circle.angle * Math.PI / 180) * circle.radius

      this.ctx.shadowColor = circle.colors[0]
      this.ctx.strokeStyle = circle.colors[1]
      lib.lineTo(this.ctx, circle.x, circle.y, circle.x - cos, circle.y + sin);

      this.ctx.strokeStyle = circle.colors[2];
      this.ctx.shadowColor = circle.colors[3];
      lib.lineTo(this.ctx, circle.x, circle.y, circle.x + cos, circle.y - sin);

      this.ctx.strokeStyle = circle.colors[4];
      this.ctx.shadowColor = circle.colors[5];
      lib.lineTo(this.ctx, circle.x, circle.y, circle.x + cos, circle.y + sin);

      this.ctx.strokeStyle = circle.colors[6];
      this.ctx.shadowColor = circle.colors[7];
      lib.lineTo(this.ctx, circle.x, circle.y, circle.x - cos, circle.y - sin);

      circle.x += circle.vx;
      circle.y += circle.vy;
      circle.vx += circle.veerx * Math.cos(circle.angle * Math.PI / 180);
      circle.vy -= circle.veery * Math.sin(circle.angle * Math.PI / 180);

      circle.angle += circle.inc;
      circle.radius -= .01;
      circle.angle = circle.angle > 360 ? circle.angle - 360
        : circle.angle < 0 ? 360 + circle.angle
          : circle.angle
      this.ctx.beginPath();

      //once offscreen, replace it
      let W = this.innerWidth
      let H = this.innerHeight
      if (circle.x > W + (W / 2) ||
        circle.x < -(W / 2) ||
        circle.y > H + H / 2 ||
        circle.y < -(H / 2) ||
        circle.radius <= 0.05) {
          let _circle = circle.create(this.innerWidth, this.innerHeight,this.vU, this.vQ, this.maxSize, this.maxLineWidth);
          _circle.makeColors()
          this.circles[i] = _circle;
        }
      })
  },
  start() {
    this.drawTimer = setInterval(() => { this.draw() }, this.drawTime)
    this.fadeTimer = setInterval(() => { this.fade() }, this.fadeTime)
  },
  createCircles() {
    let count = this.numOfCircles
    this.circles = []
    while (count--) {
      let _circle = circle.create(this.innerWidth, this.innerHeight,this.vU, this.vQ, this.maxSize, this.maxLineWidth);
      _circle.makeColors()
      this.circles.push(_circle)
    }
  },
  create() {
    return  {...parentObject, ...this}
  },
}
let circle = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  veerx: 0,
  veery: 0,
  colors: [],
  radius: 0,
  inc: 0,
  lineWidth: 0,
  angle: 0,
  makeColors(){
    let count = 8
    while (count--) {
      this.colors.push(`rgba(${~~(Math.random() * 255)},${~~(Math.random() * 255)},${~~(Math.random() * 255)},${Math.random()})`)
    }
  },
  create(W, H, vU, vQ, size, line) {
    return {...this, 
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.random() * vU - (vU / 2),
      vy: Math.random() * vU - (vU / 2),
      veerx: Math.random() * vQ - (vQ / 2),
      veery: Math.random() * vQ - (vQ / 2),
      radius: 10 + Math.random() * size,
      angle: ~~(Math.random() * 360),
      inc: Math.random() * (Math.PI / 3),
      lineWidth: Math.random() * line,
      colors: [],
    }
  },
};
export default MathObject
