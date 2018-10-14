const dat = require('dat.gui');
import lib from './lib'
class Explosion {
  constructor(props) {
    this.state = {
      innerWidth: 0,
      innerHeight: 0,
      ctx: null,
      canvas: null,
      gui: null,//new dat.GUI({ width: 310 }),
      //specific stuff
      explosions: [],
      particles: [],
      gravity: 0.3,
      velocity: 10,
      density: 10,
      drawTimer: null,
      fadeTimer: null

    }
     this.cleanup = this.cleanup.bind(this)
  }
  cleanup(){
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
  _fill(color, x, y) {
    this.state.ctx.fillStyle = color
    this.state.ctx.fillRect(x, y, this.state.innerWidth, this.state.innerHeight)
  }
  addGui() {
    let controller = {
      gravity: this.state.gravity,
      velocity: this.state.velocity,
      density: this.state.density,
    }

    this.state.gui.add(controller, 'gravity', 0.1, 1).step(0.01).name('Gravity').onChange((value) => {
      if (this.state.gravity === value) return
      this.state.gravity = value
    })
    this.state.gui.add(controller, 'density', 1, 500).step(1).name('Density').onChange((value) => {
      if (this.state.density === value) return
      this.state.density = value
    })
    this.state.gui.add(controller, 'velocity', 1, 100).step(2).name('Velocity').onChange((value) => {
      if (this.state.velocity === value) return
      this.state.velocity = value
    })
  }
  fade() {
    lib.cvFade(this.state.ctx,'rgba(0,0,0, 0.1)',this.state.innerWidth, this.state.innerHeight)
  }
  stop(){
    clearInterval(this.state.fadeTimer)
    clearInterval(this.state.drawTimer)
  }
  start() {
    console.log('starting explosion')
    this.drawExplosions.bind(this)
    this.drawParticles.bind(this)

    this.state.drawTimer = setInterval(() =>{
      this.drawExplosions()
      this.drawParticles()
    }, 60)

    this.state.fadeTimer = setInterval(this.fade.bind(this), 200)
  }
  //////////////////////////
  initData(){
    let count = 1
    while(count--){
      this.state.explosions.push(this.createExplosion({x: this.state.innerWidth / 2, y: this.state.innerHeight / 2}))
    }
  }
  createExplosion(point){
    return {
      x: point.x,
      y: point.y,
    }
    
  }
  drawExplosions(){
    this.state.explosions.forEach(ex =>{
      this.drawExplosion(ex)
    })
  }
  drawExplosion(explosion){
    //console.log('Boom')
    //explode it into particles, each
    //with an angle and velocity.
    let particles = Math.round(Math.random() * this.state.density)
    while(particles--){
      let yvel = Math.random() * -(this.state.velocity)
      let angle = Math.random() * 360
      this.state.particles.push({
        pos:{
          x: explosion.x,
          y : explosion.y,
        },
        lastPos:{
          x: explosion.x,
          y : explosion.y,
        },
        angle: angle,
        velocity: {
          yvel: yvel,
          xvel: yvel * Math.cos(angle  * Math.PI / 180),
          VEL: yvel * -1
        },
        time: 0,
        color: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},${Math.random()} )`,
        size: 1
      })
    }
  } 
  drawParticles(){
    //this.state.ctx.strokeStyle = 'rgb(255,255,255)'
    
    this.state.particles.forEach((particle,i)=>{
      //calculate its new position
      this.state.ctx.lineWidth = particle.size
      this.state.ctx.strokeStyle = particle.color
      //calc using angle only
      let xComp = Math.cos(particle.angle  * Math.PI / 180)
      let yComp = Math.sin(particle.angle  * Math.PI / 180)
      let x = particle.lastPos.x + (particle.velocity.VEL * xComp)
      let g = ((this.state.gravity * particle.time) * (this.state.gravity * particle.time++))
      let y = particle.lastPos.y + ((particle.velocity.VEL ) * yComp)  + g

      lib.lineTo(this.state.ctx, particle.lastPos.x, particle.lastPos.y, x, y)
      particle.lastPos.x = x
      particle.lastPos.y = y
      particle.size = particle.size * .9
      if (y > this.state.innerHeight)
        this.state.particles.splice(i, 1)

      /**
       * one way
       */
      //add gravity to vertical velocity
      // particle.velocity.yvel += ((0.1 * particle.time) * (0.1 * particle.time++))

      // //new y pos
      // let y = particle.lastPos.y + particle.velocity.yvel
      // let x = particle.lastPos.x + particle.velocity.xvel//constant for now
      // lib.lineTo(this.state.ctx, particle.lastPos.x, particle.lastPos.y, x, y)
      // particle.lastPos.x = x
      // particle.lastPos.y = y

      // if (y > this.state.innerHeight)
      //   this.state.particles.splice(i, 1)
    })
  }
}
export default Explosion
