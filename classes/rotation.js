import { GUI } from 'dat.gui';
import lib from './lib'
class Rotation {
  constructor(props) {
    this.state = {
      innerWidth: 0,
      innerHeight: 0,
      ctx: null,
      canvas: null,
      gui: null,
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
      rand_line: 0.5
    }
    this.cleanup = this.cleanup.bind(this)
  }
  cleanup() {
    this.state.gui.destroy()
  }
  initCanvas() {

    this.state.canvas = document.getElementById("canvas")
    this.state.innerHeight = this.state.canvas.innerHeight = this.state.canvas.height = window.innerHeight * 0.9
    this.state.innerWidth = this.state.canvas.innerWidth = this.state.canvas.width = window.innerWidth * 0.9
    this.state.ctx = this.state.canvas.getContext("2d")
    this.state.gui = new GUI({ width: 310 })
    this.state.ctx.translate(this.state.innerWidth / 2, this.state.innerHeight / 2)
    this.addGui()
    this.initData()
  }
  _fill(color, x, y) {
    this.state.ctx.fillStyle = color
    this.state.ctx.fillRect(
      x - this.state.innerWidth / 2,
      y - this.state.innerHeight / 2,
      this.state.innerWidth,
      this.state.innerHeight)
  }
  addGui() {
    let controller = {
      count: this.state.count,
      rand_size: this.state.rand_size,
      rand_spread: this.state.rand_spread,
      rand_line: this.state.rand_line,
      angle: this.state.angle,
    }

    this.state.gui.add(controller, 'count', 1, 50).step(1).name('Rotation Speed').onChange((value) => {
      if (this.state.count === value) return
      this.state.count = value
    })
    this.state.gui.add(controller, 'rand_size', 1, 150).step(1).name('Number of Points').onChange((value) => {
      if (this.state.rand_size === value) return
      this.state.rand_size = value
      this.createArray()
    })
    this.state.gui.add(controller, 'rand_spread', 1, 500).step(1).name('Spread').onChange((value) => {
      if (this.state.rand_spread === value) return
      this.state.rand_spread = value
      this.createArray()
    })
    this.state.gui.add(controller, 'rand_line', 0.1, 5).step(.1).name('Line Size').onChange((value) => {
      if (this.state.rand_line === value) return
      this.state.rand_line = value
    })
    this.state.gui.add(controller, 'angle', 0.001, 0.02).step(.001).name('Radian Rotation').onChange((value) => {
      if (this.state.angle === value) return
      this.state.angle = value
      this.initData()
    })
  }
  fade(color = 'black') {
    let old = this.state.ctx.shadowColor
    let oldComp = this.state.ctx.globalCompositeOperation
    this.state.ctx.shadowColor = color
    this.state.ctx.globalCompositeOperation = "source-over"
    this.state.ctx.fillStyle = color
    this.state.ctx.fillRect(-this.state.innerWidth / 2, -this.state.innerHeight / 2, this.state.innerWidth, this.state.innerHeight)
    //restore old shadow
    this.state.ctx.shadowColor = old
    this.state.ctx.globalCompositeOperation = oldComp
  }
  stop() {
    clearInterval(this.state.fadeTimer)
    clearInterval(this.state.drawTimer)
  }
  start() {
    console.log('starting rotation')
    this.state.drawTimer = setInterval(() => {
      let count = this.state.count
      while (count--) {
        this.drawRandom()
        this.fade('rgb(0,0,0,0.1')
      }

    }, 60)
  }
  //////////////////////////
  initData() {
    //initialize the rotation matrices with the angle of rotation
    this.state.xRot = {
      a: 1,
      b: 0,
      c: 0,
      d: 0,
      e: Math.cos(-this.state.angle),
      f: -Math.sin(-this.state.angle),
      g: 0,
      h: Math.sin(-this.state.angle),
      i: Math.cos(-this.state.angle)
    }
    this.state.yRot = {
      a: Math.cos(this.state.angle),
      b: 0,
      c: Math.sin(this.state.angle),
      d: 0,
      e: 1,
      f: 0,
      g: -Math.sin(this.state.angle),
      h: 0,
      i: Math.cos(this.state.angle)
    }
    this.state.zRot = {
      a: Math.cos(this.state.angle),
      b: -Math.sin(this.state.angle),
      c: 0,
      d: Math.sin(this.state.angle),
      e: Math.cos(this.state.angle),
      f: 0,
      g: 0,
      h: 0,
      i: 1
    }
    if (this.state.random_array.length === 0)
      this.createArray()
  }
  createArray(){
    this.state.random_array = []
    let rand = this.state.rand_size
    let size = this.state.rand_spread
    while(rand--){
      let z = -size + (Math.random() * (size*2))
      this.state.random_array.push({ 
        x: -size + (Math.random() * (size*2)), 
        y: -size + (Math.random() * (size*2)), 
        z: z, 
        //clr: lib.get_hsla(),
        clr: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},${Math.random()} )`
      })
    }

  }
  getComb(point, rotation) {
    let rotate = this.state[`${rotation}`]
    let x = rotate.a * point.x + rotate.b * point.y + rotate.c * point.z
    let y = rotate.d * point.x + rotate.e * point.y + rotate.f * point.z
    let z = rotate.g * point.x + rotate.h * point.y + rotate.i * point.z
    return { x, y, z }
  }

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
  }

  draw() {
    this.rotate(this.state.xAxis)
    this.rotate(this.state.yAxis)
    this.rotate(this.state.zAxis)

    this.state.ctx.fillStyle = this.state.ctx.strokeStyle = 'red'
    lib.lineTo(this.state.ctx, 0, 0, this.state.xAxis.x, this.state.xAxis.y)
    lib.drawSphere(this.state.ctx, {x:this.state.xAxis.x, y:this.state.xAxis.y}, 5)
    this.state.ctx.fillStyle = this.state.ctx.strokeStyle = 'green'
    lib.lineTo(this.state.ctx, 0, 0, this.state.yAxis.x, this.state.yAxis.y)
    lib.drawSphere(this.state.ctx, {x:this.state.yAxis.x, y:this.state.yAxis.y}, 5)
    this.state.ctx.fillStyle = this.state.ctx.strokeStyle = 'blue'
    lib.lineTo(this.state.ctx, 0, 0, this.state.zAxis.x, this.state.zAxis.y)
    lib.drawSphere(this.state.ctx, {x:this.state.zAxis.x, y:this.state.zAxis.y}, 5)
  }
  rotateArray(ar) {
    ar.forEach(point =>{
      this.rotate(point)
    })
  }

  drawRandom(){
    
    this.rotateArray(this.state.random_array)
    this.state.ctx.lineWidth = this.state.rand_line
    this.state.random_array.forEach(point =>{
      let rand = Math.random()
      this.state.ctx.fillStyle = this.state.ctx.strokeStyle = point.clr
      let radPct = Math.abs(point.z / this.state.rand_spread )
      let rad = this.state.rand_spread / 25 
      if ( point.z < 0){
        rad -= rad * radPct
      } else{
        rad += rad * radPct
      }
      if (rad < 0)
        rad = 0.5
      lib.lineTo(this.state.ctx, 0, 0, point.x, point.y)
      lib.drawSphere(this.state.ctx, {x: point.x, y: point.y}, rad)
    })
  }
}
export default Rotation
