const dat = require('dat.gui');
import {lib} from '../helpers/'
import parentObject from './parentObject'
export const explosionChild = {
  innerWidth: 0,
  innerHeight: 0,
  ctx: null,
  canvas: null,
  gui: null,
  drawTimer: null,
  fadeTimer: null,
  //specific stuff
  explosions: [],
  particles: [],
  gravity: 0.3,
  velocity: 10,
  density: 10,
  cleanup() {
    this.gui.destroy()
  },
  initCanvas() {
    this.canvas = document.getElementById("canvas")
    this.innerHeight = this.canvas.innerHeight = this.canvas.height = window.innerHeight * 0.9
    this.innerWidth = this.canvas.innerWidth = this.canvas.width = window.innerWidth * 0.9
    this.ctx = this.canvas.getContext("2d")
    this.gui = new dat.GUI({ width: 310 })
    this.addGui()
    this.initData()


    //a test
    const Parent = {
      msg: '',
      parentMethod() {
        return null
      },
      create({ ...args }) {
        return Object.assign(Object.create(this), { ...args })
      },
    }
    
    const Child = {
      create({ ...args }) {
        return Object.assign(Object.create(this), { ...args })
      },
    }
    
    let _parent = Parent.create({msg:'testing', parentMethod(){return this.msg}})
    let _child = Child.create(_parent)
    console.log('###',_child.parentMethod())
    
  },
  start() {
    this.fadeTimer = setInterval(() => { this.fade() }, 200)
    this.drawTimer = setInterval(() =>{
      this.drawExplosions()
      this.drawParticles()
    }, 60)
  },
  stop() {
    clearInterval(this.fadeTimer)
    clearInterval(this.drawTimer)
  },
  _fill(color, x, y) {
    lib._fill(this.ctx, color, x, y, this.innerWidth, this.innerHeight)
  },
  addGui() {
    let controller = {
      gravity: this.gravity,
      velocity: this.velocity,
      density: this.density,
    }
    this.gui.add(controller, 'gravity', 0.1, 1).step(0.01).name('Gravity').onChange((value) => {
      if (this.gravity === value) return
      this.gravity = value
    })
    this.gui.add(controller, 'density', 1, 500).step(1).name('Density').onChange((value) => {
      if (this.density === value) return
      this.density = value
    })
    this.gui.add(controller, 'velocity', 1, 100).step(2).name('Velocity').onChange((value) => {
      if (this.velocity === value) return
      this.velocity = value
    })
  },
  createExplosion(point) {
    return {
      x: point.x,
      y: point.y,
    }
  },
  drawExplosions() {
    this.explosions.forEach(ex => {
      this.drawExplosion(ex)
    })
  },
  drawExplosion(explosion) {
    //explode it into particles, each
    //with an angle and velocity.
    let particles = Math.round(Math.random() * this.density)
    while (particles--) {
      let yvel = Math.random() * -(this.velocity)
      let angle = Math.random() * 360
      this.particles.push({
        pos: {
          x: explosion.x,
          y: explosion.y,
        },
        lastPos: {
          x: explosion.x,
          y: explosion.y,
        },
        angle: angle,
        velocity: {
          yvel: yvel,
          xvel: yvel * Math.cos(angle * Math.PI / 180),
          VEL: yvel * -1
        },
        time: 0,
        color: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},${Math.random()} )`,
        size: 1
      })
    }
  },
  drawParticles() {
    this.particles.forEach((particle, i) => {
      //calculate its new position
      this.ctx.lineWidth = particle.size
      this.ctx.strokeStyle = particle.color
      //calc using angle only
      let xComp = Math.cos(particle.angle * Math.PI / 180)
      let yComp = Math.sin(particle.angle * Math.PI / 180)
      let x = particle.lastPos.x + (particle.velocity.VEL * xComp)
      let g = ((this.gravity * particle.time) * (this.gravity * particle.time++))
      let y = particle.lastPos.y + ((particle.velocity.VEL) * yComp) + g

      lib.lineTo(this.ctx, particle.lastPos.x, particle.lastPos.y, x, y)
      particle.lastPos.x = x
      particle.lastPos.y = y
      particle.size = particle.size * .9
      if (y > this.innerHeight)
        this.particles.splice(i, 1)
    })
  },
  initData() {
    let count = 1
    while (count--) {
      this.explosions.push(this.createExplosion({ x: this.innerWidth / 2, y: this.innerHeight / 2 }))
    }
  },
  create() {
    let p = parentObject.create()
    this.fade = p.fade
    return Object.assign(Object.create(this), { })
  },
}
export default explosionChild