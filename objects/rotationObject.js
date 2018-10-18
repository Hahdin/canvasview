const dat = require('dat.gui');
import {lib} from '../helpers/'
export const rotationObject = {
  innerWidth: 0,
  innerHeight: 0,
  ctx: null,
  canvas: null,
  gui: null,
  drawTimer: null,
  fadeTimer: null,
  //specific stuff
  angle: 0.005,
  xRot: {
  },
  yRot: {
  },
  zRot: {
  },
  xAxis: {
    x: 400,
    y: 0,
    z: 0
  },
  yAxis: {
    x: 0,
    y: -400,
    z: 0
  },
  zAxis: {
    x: 0,
    y: 0,
    z: -400
  },
  count: 1,
  random_array: [],
  rand_size: 50,
  rand_spread: 400,
  rand_line: 0.5,
  cleanup() {
    this.gui.destroy()
  },
  addGui(){
    let controller = {
      count: this.count,
      rand_size: this.rand_size,
      rand_spread: this.rand_spread,
      rand_line: this.rand_line,
      angle: this.angle,
    }
    this.gui.add(controller, 'count', 1, 50).step(1).name('Rotation Speed').onChange((value) => {
      if (this.count === value) return
      this.count = value
    })
    this.gui.add(controller, 'rand_size', 1, 150).step(1).name('Number of Points').onChange((value) => {
      if (this.rand_size === value) return
      this.rand_size = value
      this.createArray()
    })
    this.gui.add(controller, 'rand_spread', 1, 500).step(1).name('Spread').onChange((value) => {
      if (this.rand_spread === value) return
      this.rand_spread = value
      this.createArray()
    })
    this.gui.add(controller, 'rand_line', 0.1, 5).step(.1).name('Line Size').onChange((value) => {
      if (this.rand_line === value) return
      this.rand_line = value
    })
    this.gui.add(controller, 'angle', 0.001, 0.02).step(.001).name('Radian Rotation').onChange((value) => {
      if (this.angle === value) return
      this.angle = value
      this.initData()
    })
  },
  initData(){
    //initialize the rotation matrices with the angle of rotation
    this.xRot = {
      a: 1,
      b: 0,
      c: 0,
      d: 0,
      e: Math.cos(-this.angle),
      f: -Math.sin(-this.angle),
      g: 0,
      h: Math.sin(-this.angle),
      i: Math.cos(-this.angle)
    }
    this.yRot = {
      a: Math.cos(this.angle),
      b: 0,
      c: Math.sin(this.angle),
      d: 0,
      e: 1,
      f: 0,
      g: -Math.sin(this.angle),
      h: 0,
      i: Math.cos(this.angle)
    }
    this.zRot = {
      a: Math.cos(this.angle),
      b: -Math.sin(this.angle),
      c: 0,
      d: Math.sin(this.angle),
      e: Math.cos(this.angle),
      f: 0,
      g: 0,
      h: 0,
      i: 1
    }
    if (this.random_array.length === 0)
      this.createArray()
  },
  initCanvas() {
    this.canvas = document.getElementById("canvas")
    this.innerHeight = this.canvas.innerHeight = this.canvas.height = window.innerHeight * 0.9
    this.innerWidth = this.canvas.innerWidth = this.canvas.width = window.innerWidth * 0.9
    this.ctx = this.canvas.getContext("2d")
    this.gui = new dat.GUI({ width: 310 })
    this.ctx.translate(this.innerWidth / 2, this.innerHeight / 2)
    this.addGui()
    this.initData()
  },
  // draw(){
  //   this.rotate(this.xAxis)
  //   this.rotate(this.yAxis)
  //   this.rotate(this.zAxis)
  //   this.ctx.fillStyle = this.ctx.strokeStyle = 'red'
  //   lib.lineTo(this.ctx, 0, 0, this.xAxis.x, this.xAxis.y)
  //   lib.drawSphere(this.ctx, {x:this.xAxis.x, y:this.xAxis.y}, 5)
  //   this.ctx.fillStyle = this.ctx.strokeStyle = 'green'
  //   lib.lineTo(this.ctx, 0, 0, this.yAxis.x, this.yAxis.y)
  //   lib.drawSphere(this.ctx, {x:this.yAxis.x, y:this.yAxis.y}, 5)
  //   this.ctx.fillStyle = this.ctx.strokeStyle = 'blue'
  //   lib.lineTo(this.ctx, 0, 0, this.zAxis.x, this.zAxis.y)
  //   lib.drawSphere(this.ctx, {x:this.zAxis.x, y:this.zAxis.y}, 5)
  // },
  start() {
    this.drawTimer = setInterval(() => {
      let count = this.count
      while (count--) {
        this.drawRandom()
        this.fade('rgb(0,0,0,0.1')
      }
    }, 60)
  },
  stop(){
    clearInterval(this.fadeTimer)
    clearInterval(this.drawTimer)
  },
  _fill(color, x, y) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(
      x - this.innerWidth / 2,
      y - this.innerHeight / 2,
      this.innerWidth,
      this.innerHeight)
  },
  fade(color = 'black') {
    let old = this.ctx.shadowColor
    let oldComp = this.ctx.globalCompositeOperation
    this.ctx.shadowColor = color
    this.ctx.globalCompositeOperation = "source-over"
    this.ctx.fillStyle = color
    this.ctx.fillRect(-this.innerWidth / 2, -this.innerHeight / 2, this.innerWidth, this.innerHeight)
    //restore old shadow
    this.ctx.shadowColor = old
    this.ctx.globalCompositeOperation = oldComp
  },
  createArray(){
    this.random_array = []
    let rand = this.rand_size
    let size = this.rand_spread
    while(rand--){
      let z = -size + (Math.random() * (size*2))
      this.random_array.push({ 
        x: -size + (Math.random() * (size*2)), 
        y: -size + (Math.random() * (size*2)), 
        z: z, 
        clr: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},${Math.random()} )`
      })
    }
  },
  getComb(point, rotation) {
    let rotate = this[`${rotation}`]
    let x = rotate.a * point.x + rotate.b * point.y + rotate.c * point.z
    let y = rotate.d * point.x + rotate.e * point.y + rotate.f * point.z
    let z = rotate.g * point.x + rotate.h * point.y + rotate.i * point.z
    return { x, y, z }
  },
  rotate(axis) {
    let rotation = {}
    rotation = this.getComb(axis, 'xRot')
    axis.x = rotation.x
    axis.y = rotation.y
    axis.z = rotation.z
    rotation = this.getComb(axis, 'zRot')
    axis.x = rotation.x
    axis.y = rotation.y
    axis.z = rotation.z
    rotation = this.getComb(axis, 'yRot')
    axis.x = rotation.x
    axis.y = rotation.y
    axis.z = rotation.z
  },
  rotateArray(ar) {
    ar.forEach(point =>{
      this.rotate(point)
    })
  },
  drawRandom(){
    this.rotateArray(this.random_array)
    this.ctx.lineWidth = this.rand_line
    this.random_array.forEach(point =>{
      let rand = Math.random()
      this.ctx.fillStyle = this.ctx.strokeStyle = point.clr
      let radPct = Math.abs(point.z / this.rand_spread )
      let rad = this.rand_spread / 25 
      if ( point.z < 0){
        rad -= rad * radPct
      } else{
        rad += rad * radPct
      }
      if (rad < 0)
        rad = 0.5
      lib.lineTo(this.ctx, 0, 0, point.x, point.y)
      lib.drawSphere(this.ctx, {x: point.x, y: point.y}, rad)
    })
  },
  create() {
    return Object.assign(Object.create(this), { })
  },
}
export default rotationObject
