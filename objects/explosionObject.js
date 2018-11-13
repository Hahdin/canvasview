import {lib} from '../helpers/'
import parentObject from './parentObject'
export const explosionObject = {
  //specific stuff
  explosions: [],
  particles: [],
  gravity: 0.3,
  velocity: 10,
  density: 10,
  start() {
    this.fadeTimer = setInterval(() => { this.fade() }, 200)
    this.drawTimer = setInterval(() =>{
      this.drawExplosions()
      this.drawParticles()
    }, 60)
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
    this.explosions = []
    this.particles =[]
    let count = 1
    while (count--) {
      this.explosions.push(this.createExplosion({ x: this.innerWidth / 2, y: this.innerHeight / 2 }))
    }
  },
  create() {
    return  {...parentObject, ...this}
  },
}
export default explosionObject
