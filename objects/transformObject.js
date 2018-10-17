const dat = require('dat.gui');
import { lib } from '../helpers/'
let cc = 0

export const transformObject = {
  innerWidth: 0,
  innerHeight: 0,
  ctx: null,
  canvas: null,
  gui: null,
  drawTimer: null,
  fadeTimer: null,
  redraw: false,
  rules: [{

    //  index: 0,
    a: .85,//# of leaves
    b: 0.04,//tilt right
    c: -0.04,//curve to right
    d: 0.85,//height? lower to squash
    tx: 0,//x offset
    ty: 1.6,//expand / grow
    weight: 0.85,
    color: `rgba(${cc},255,${cc}, 1)`,
    getColor: () => `rgba(${cc},${Math.random() * 255},${cc},1)`
  },
  {//right 
    //  index: 1,
    a: -0.15,
    b: 0.28,
    c: 0.26,
    d: 0.24,
    tx: 0,
    ty: 0.44,
    weight: 0.07,
    color: `rgba(255,${cc},${cc}, 1)`,
    getColor: () => `rgba(${Math.random() * 255}, ${cc},${cc}, 1)`
  },
  {//left 
    // index: 2,
    a: 0.2,
    b: -0.26,
    c: 0.23,
    d: 0.22,
    tx: 0,
    ty: 1.6,
    weight: 0.07,
    color: `rgba(${cc},${cc},255, 1)`,
    getColor: () => `rgba(${Math.random() * 255},${cc},${Math.random() * 255}, 1)`
  },
  {
    // index: 3,
    a: 0,
    b: 0,
    c: 0,
    d: 0.16,
    tx: 0,
    ty: 0,
    weight: 0.1,
    color: `rgba(255,255,${cc}, 1)`,
    getColor: () => `rgba(${Math.random() * 255},${Math.random() * 255},${cc}, 1)`
  }],
  //specific stuff
  cleanup() {
    this.gui.destroy()
  },
  addGui() {
    let controller = {}
    this.rules.forEach((rule, i) => {
      let folder = this.gui.addFolder(`Transform ${i}`)
      controller.a = rule.a
      controller.b = rule.b
      controller.c = rule.c
      controller.d = rule.d
      controller.tx = rule.tx
      controller.ty = rule.ty
      folder.add(controller, 'a', -1, 1).step(0.001).name('T a').onChange((value) => {
        if (rule.a === value) return
        rule.a = value
        this.redraw = true
      })
      folder.add(controller, 'b', -1, 1).step(0.001).name('T b').onChange((value) => {
        if (rule.b === value) return
        rule.b = value
        this.redraw = true
      })
      folder.add(controller, 'c', -1, 1).step(0.001).name('T c').onChange((value) => {
        if (rule.c === value) return
        rule.c = value
        this.redraw = true
      })
      folder.add(controller, 'd', -1, 1).step(0.001).name('T d').onChange((value) => {
        if (rule.d === value) return
        rule.d = value
        this.redraw = true
      })
      folder.add(controller, 'tx', -5, 5).step(0.001).name('tx').onChange((value) => {
        if (rule.tx === value) return
        rule.tx = value
        this.redraw = true
      })
      folder.add(controller, 'ty', -5, 5).step(0.001).name('ty').onChange((value) => {
        if (rule.ty === value) return
        rule.ty = value
        this.redraw = true
      })
    })
  },
  initData() {
  },
  initCanvas() {
    this.canvas = document.getElementById("canvas")
    this.innerHeight = this.canvas.innerHeight = this.canvas.height = window.innerHeight * 0.9
    this.innerWidth = this.canvas.innerWidth = this.canvas.width = window.innerWidth * 0.9
    this.ctx = this.canvas.getContext("2d")
    this.gui = new dat.GUI({ width: 310 })
    this.ctx.translate(this.innerWidth / 2, this.innerHeight)
    this.addGui()
    this.initData()
  },
  draw() {
    this.iterate()
  },
  start() {
    this.drawTimer = setInterval(() => { this.draw() }, 200)
  },
  stop() {
    clearInterval(this.fadeTimer)
    clearInterval(this.drawTimer)
  },
  _fill(color, x, y) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x - this.innerWidth / 2, y - this.innerHeight, this.innerWidth, this.innerHeight)
  },
  fade() {
    lib.cvFade(this.ctx, 'rgba(0,0,0, 0.1)', this.innerWidth, this.innerHeight)
  },
  getRule() {
    let rand = Math.random()
    for (let i = 0; i < this.rules.length; i++) {
      let rule = this.rules[i]
      if (rand < rule.weight)
        return rule
      rand -= rule.weight
    }
  },
  plot(x, y, color) {
    this.ctx.fillStyle = this.ctx.strokeStyle = color
    let ln = .005
    let angle = Math.random() * Math.PI * 2
    this.ctx.fillRect(x * 50, -y * 50, 0.5, 0.5)
  },
  iterate() {
    if (this.redraw) {
      this.redraw = false
      this._fill('rgba(0,0,0, 1)', 0, 0)
    }
    let count = 1000
    let x = Math.random(),// * this.innerWidth / 2,
      y = Math.random()//* this.innerHeight / 2
    while (count--) {
      let rule = this.getRule(),
        x1 = x * rule.a + y * rule.b + rule.tx,
        y1 = x * rule.c + y * rule.d + rule.ty
      x = x1
      y = y1
      let color = rule.getColor()
      this.plot(x, y, color)
    }
  }
}
export default transformObject
