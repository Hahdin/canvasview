const dat = require('dat.gui');
import lib from './lib'
class Volcano {
  constructor(props) {
    this.state = {
      innerWidth: 0,
      innerHeight: 0,
      ctx: null,
      canvas: null,
      circles: [],
      projectiles: [],
      mouse: {
        down: false
      },
      projectileSize: 200,
      fireWorks: [],
      gui: null,//new dat.GUI({ width: 310 }),
      gravity: 0.0035,
      initialVelocity: 5,
      trackMouse: false,
      degRange: 70,
      particles: [],
      showFireworks: true,
      bounceVelRatio: 0.3,
      solid: true,
      fadeTimer: null,
      drawTimer: null

    }
    this.trackMouse = this.trackMouse.bind(this)
    this.trackMouseButton = this.trackMouseButton.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
  }
  initCanvas() {

    this.state.canvas = document.getElementById("canvas")
    this.state.innerHeight = this.state.canvas.innerHeight = this.state.canvas.height = window.innerHeight * 0.9
    this.state.innerWidth = this.state.canvas.innerWidth = this.state.canvas.width = window.innerWidth * 0.9
    //console.log('hey', this.state.canvas)
    this.state.ctx = this.state.canvas.getContext("2d")
    canvas.addEventListener('mousemove', this.trackMouse, false);
    canvas.addEventListener('mousedown', this.trackMouseButton, false);
    canvas.addEventListener('mouseup', this.trackMouseButton, false);
    canvas.addEventListener('mouseleave', this.mouseLeave, false);
    this.state.gui = new dat.GUI({ width: 310 })
    this.addGui()

  }
  cleanup(){
    this.state.gui.destroy()
  }
  addGui() {
    let controller = {
      projectileSize: this.state.projectileSize,
      gravity: this.state.gravity,
      initialVelocity: this.state.initialVelocity,
      trackMouse: this.state.trackMouse,
      degRange: this.state.degRange,
      showFireworks: this.state.showFireworks,
      bounceVelRatio: this.state.bounceVelRatio,
      solid: this.state.solid
    }

    this.state.gui.add(controller, 'degRange', 10, 180).step(2).name('Vent ° Range').onChange((value) => {
      if (this.state.degRange === value) return
      this.state.degRange = value
    })
    this.state.gui.add(controller, 'projectileSize', 0, 1000).step(10).name('# of Projectiles').onChange((value) => {
      if (this.state.projectileSize === value) return
      this.state.projectileSize = value
    })
    this.state.gui.add(controller, 'gravity', 0, 0.1).step(0.0001).name('Gravity factor').onChange((value) => {
      if (this.state.gravity === value) return
      this.state.gravity = value
    })
    this.state.gui.add(controller, 'initialVelocity', 5, 50).step(1).name('Max. Velocity').onChange((value) => {
      if (this.state.initialVelocity === value) return
      this.state.initialVelocity = value
    })
    this.state.gui.add(controller, 'bounceVelRatio', 0.1, 1).step(0.1).name('Bounce Vel. Ratio').onChange((value) => {
      if (this.state.bounceVelRatio === value) return
      this.state.bounceVelRatio = value
    })
    this.state.gui.add(controller, 'trackMouse', 0, 1).name('Track Mouse').onChange((value) => {
      if (this.state.trackMouse === value) return
      this.state.trackMouse = value
    })
    this.state.gui.add(controller, 'showFireworks', 0, 1).name('Show Fireworks').onChange((value) => {
      if (this.state.showFireworks === value) return
      this.state.showFireworks = value
    })
    this.state.gui.add(controller, 'solid', 0, 1).name('Single Color FW').onChange((value) => {
      if (this.state.solid === value) return
      this.state.solid = value
    })
    
  }
  trackMouse(e) {
    //since the canvas = full page the position of the mouse 
    //relative to the document will suffice
    this.state.mouse.x = e.pageX;
    this.state.mouse.y = e.pageY;
  }
  trackMouseButton(e) {
    console.log(e, this.state.mouse.down)
    this.state.mouse.down = !this.state.mouse.down;
  }
  mouseLeave(e) {
    //reset to center
    this.state.mouse.x = this.state.innerWidth / 2;
    this.state.mouse.y = this.state.innerHeight / 10;
  }
  _fill(color, x, y) {
    this.state.ctx.fillStyle = color
    this.state.ctx.fillRect(x, y, this.state.innerWidth, this.state.innerHeight)
  }
  fade() {
    lib.cvFade(this.state.ctx,'rgba(0,0,0, 0.1)',this.state.innerWidth, this.state.innerHeight)
  }
  start() {
    console.log('starting volcano')
    this.state.fadeTimer = setInterval(this.fade.bind(this), 400)
    this.projectile.bind(this)
    this.explodeFireworks.bind(this)
    this.drawParticles.bind(this)

    this.state.drawTimer = setInterval(() =>{
      this.projectile()
      this.explodeFireworks()
      this.drawParticles()
    }, 60)

  }
  stop(){
    clearInterval(this.state.fadeTimer)
    clearInterval(this.state.drawTimer)
  }

  bounce(projectile) {
    if (projectile.yPos > this.state.innerHeight - 5) {
      //console.log('b4', projectile.verticalVelocity)
      projectile.verticalVelocity = (- projectile.verticalVelocity * this.state.bounceVelRatio)
      projectile.angle = 40 + Math.random() * 100
      projectile.horizontalVelocity = Math.cos(projectile.angle * Math.PI / 180) * projectile.verticalVelocity
      projectile.time = 0
      //console.log('after', projectile.verticalVelocity)
    }
  }
  createProjectile() {
    let x = this.state.innerWidth / 2
    let y = this.state.innerHeight - this.state.innerHeight / 10
    if (this.state.trackMouse) {
      x = this.state.mouse.x ? this.state.mouse.x : x
      y = this.state.mouse.y ? this.state.mouse.y : y
    }

    let projectile = {
      angle: 90 - (this.state.degRange / 2) + (Math.random() * (this.state.degRange)),
      verticalVelocity: (this.state.initialVelocity / 2) + Math.random() * (this.state.initialVelocity / 2),
      xPos: x,
      yPos: y,
      time: 0,
      lineWidth: (Math.random() > 0.8) ? Math.random() * 10 : Math.random() * 2,
      color: `rgba(${255},${Math.random() * 50},${Math.random() * 50},${Math.random()})`,
      //color: `rgba(${Math.random() *255},${Math.random() *255},${Math.random() *255},${Math.random()})`,
      shadowColor: `rgba(${255},${255},${Math.random() * 255},${1})`,
    }
    projectile.verticalVelocity = (projectile.lineWidth < 2) ? Math.random() * this.state.initialVelocity : Math.random() * (this.state.initialVelocity + 10)
    projectile.horizontalVelocity = Math.cos(projectile.angle * Math.PI / 180) * projectile.verticalVelocity

    if (Math.random() * 100 > 99.5) {
      projectile.lineWidth = 20
      projectile.verticalVelocity = Math.random() * this.state.initialVelocity + 15
      projectile.horizontalVelocity = Math.cos(projectile.angle * Math.PI / 180) * projectile.verticalVelocity
      projectile.color = `rgba(${255},${200},${200},${0.8})`
    }
    return projectile
  }
  createFirework(projectile, i) {

    let { xPos, yPos } = projectile
    this.state.projectiles.splice(i, 1)//remove it

    let fw = {
      center: {
        x: xPos,
        y: yPos
      },
      //color: `rgba(${255},${Math.random() * 250},${Math.random() * 250},${Math.random()})`,
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
      a: 1,
      maxRadius: 50 + Math.random() * 100,
      lastRadius: 0,
      //currentRadius: 0,
      vel: 10 + Math.random() * 20,
      lineWidth: projectile.lineWidth,
      rotation: 0
    }
    this.state.fireWorks.push(fw)


  }
  explodeFireworks() {
    this.state.fireWorks.forEach((firework, i) => {
      this.explodeFw(firework)
      this.state.fireWorks.splice(i,1)
      return
    })
  }
  explodeFw(fw){
    //explode in a circuar pattern, add particles
    if (this.state.particles.length > 1500)
      return
    // let color = {
    //   r: 100 + Math.random() *155,
    //   g: 100 + Math.random() *155,
    //   b: 100 + Math.random() *155,
    //   a: 1
    // }

    let color = this.getFireworkColor()
    let count = 100 + Math.round(Math.random() * 200)
    let angle = (Math.PI * 2) / count
    while(count--){
      let vel =   Math.random() * this.state.initialVelocity * 1 // 
      let p = {
        x: fw.center.x,
        y: fw.center.y,
        vx: vel,
        vy: vel,
        a: count * angle,//in radians,
        time: 0,
        color:{
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        },
        line: Math.random()* 3,
        timeToChange: Math.round(25 + Math.random() * 10)
      }
      this.state.particles.push(p)
    }
  }
  getFireworkColor(){
    //4 types
    let x = Math.random()

    if (x > 0.9) {
      return {
        r: 255,
        g: 0,
        b: 0
      }
    } else if (x > 0.8) {
      return {
        r: 255,
        g: 125,
        b: 50
      }
    } else if (x > 0.7) {
      return {
        r: 0,
        g: 255,
        b: 0
      }
    } else if (x > 0.6) {
      return {
        r: 0,
        g: 0,
        b: 255
      }
    } else if (x > 0.5) {
      return {
        r: 125,
        g: 255,
        b: 0
      }
    } else if (x > 0.4) {
      return {
        r: 0,
        g: 255,
        b: 125
      }
    } else if (x > 0.3) {
      return {
        r: 0,
        g: 125,
        b: 255
      }
    } else if (x > 0.2) {
      return {
        r: 125,
        g: 0,
        b: 255
      }
    } else {
      return {
        r: 50,
        g: 125,
        b: 255
      }
    }
  }
  

  explode() {
    //let sparkle = Math.random() > 50 ? true : false
    this.state.particles.forEach((pt, i) => {
      this.state.ctx.lineWidth = pt.line
      let color = Math.random() > 0.5 ? `rgba(${pt.color.r},${pt.color.g},${pt.color.b},${Math.random() })`:
      `rgba(${255-pt.color.r},${255-pt.color.g},${255-pt.color.b},${Math.random() })`
      //chance of single  color
      if (this.state.solid){
        color = `rgba(${pt.color.r},${pt.color.g},${pt.color.b},${Math.random() })`
      }
      //last thing. Make a diff color for the 'end'

      if ( pt.time >= pt.timeToChange){
        if (this.state.solid)
        color = Math.random() > 0.5 ? 
          `rgba(${pt.color.b},${pt.color.r},${pt.color.g},${Math.random() })` : 
          `rgba(${255-pt.color.r},${255-pt.color.g},${255-pt.color.b},${Math.random() })`
        else
          color = Math.random() > 0.5 ? `rgba(${pt.color.b},${pt.color.r},${pt.color.g},${Math.random() })`:
          `rgba(${255-pt.color.b},${255-pt.color.r},${255-pt.color.g},${Math.random() })`
      }
      this.state.ctx.strokeStyle = this.state.ctx.fillStyle = color
      //calc using angle only
      let xComp = Math.cos(pt.a)
      let yComp = Math.sin(pt.a)
      let x = pt.x + (pt.vx * xComp)
      let g = (((this.state.gravity * 12) * pt.time) * ((this.state.gravity * 12) * pt.time++))
      let y = pt.y + ((pt.vy) * yComp) + g
      //console.log(pt.time)
      if (Math.random() > 0.5)
        lib.lineTo(this.state.ctx, pt.x, pt.y, x, y)
      else{
         let extra = Math.random()
         let line = pt.line
        if (extra > 0.95){
          this.state.ctx.fillStyle = 'rgba(255,255,255,1)'
          //line *= 2
        }
        this.drawSparkle({x: x, y: y}, line)
      }
      pt.x = x
      pt.y = y
      pt.line = pt.line * .96
      if (y > this.state.innerHeight){
        //console.log('remove', pt.time)
        this.state.particles.splice(i, 1)
      }
    })
  }
  drawParticles(){
    this.explode()
  }
  drawSparkle(point, radius){
    this.state.ctx.beginPath()
    this.state.ctx.arc(point.x, point.y, radius, Math.PI * 2, false)
    this.state.ctx.fill();
  }
  projectile() {
    if (!this.state.mouse.down && this.state.projectiles.length < this.state.projectileSize) {
      while (this.state.projectiles.length < this.state.projectileSize) {
        this.state.projectiles.push(this.createProjectile())
      }
    }
    this.state.projectiles.forEach((projectile, i) => {
      this.state.ctx.strokeStyle = projectile.color
      this.state.ctx.fillStyle = projectile.color
      this.state.ctx.lineWidth = projectile.lineWidth
      this.state.ctx.shadowOffsetX = .5
      this.state.ctx.shadowOffsetY = .5
      this.state.ctx.shadowBlur = 20.01
      this.state.ctx.shadowColor = projectile.shadowColor
      let gravity = this.state.gravity
      //let gravity = projectile.verticalVelocity > 10 ? this.state.gravity : this.state.gravity / 2
      let tsin = Math.sin(projectile.angle * Math.PI / 180)
      let grav = ((gravity * projectile.time++) * (gravity * projectile.time++))
      let vertVelY = projectile.verticalVelocity *
        Math.sin(projectile.angle * Math.PI / 180) //- ((gravity * projectile.time++) * (gravity * projectile.time++))
      vertVelY -= grav
      if (projectile.type) {
        if (projectile.angle > 180 && projectile.angle < 360) {
          console.log('this  is a fw')
        }
      }
      let newYPos = projectile.yPos - (vertVelY)
      let newXPos = projectile.xPos + (projectile.horizontalVelocity)
      if (newYPos < this.state.innerHeight) {
        lib.lineTo(this.state.ctx, projectile.xPos, projectile.yPos, newXPos, newYPos)
        
        if (projectile.lineWidth > 8) {
          this.state.ctx.beginPath()
          this.state.ctx.shadowOffsetX = 5.5
          this.state.ctx.shadowOffsetY = 5.5
          this.state.ctx.shadowBlur = 20.01
          this.state.ctx.arc(newXPos, newYPos, projectile.lineWidth / 2, Math.PI * 2, false);
          this.state.ctx.fill();
        }
      }
      if (projectile.yPos < (this.state.innerHeight - 5) && newYPos > this.state.innerHeight)
        newYPos = this.state.innerHeight - 1
      if (projectile.verticalVelocity > 0 && vertVelY < 0) {//apex
        //blow up?
        if (Math.random() > .9 && (projectile.yPos < this.state.innerHeight / 2) && this.state.showFireworks) {
          console.log('Boom!')
          this.createFirework(projectile, i)
          return
        }
      }
      projectile.xPos = newXPos
      projectile.yPos = newYPos
      projectile.verticalVelocity = vertVelY
      projectile.lineWidth = projectile.lineWidth * .98
      projectile.horizontalVelocity -= projectile.horizontalVelocity / 50
      this.bounce(projectile)
      if (projectile.yPos > this.state.innerHeight || projectile.lineWidth < 0.02) {
        this.state.projectiles.splice(i, 1)
        if (!this.state.mouse.down && this.state.projectiles.length < this.state.projectileSize)
          this.state.projectiles.push(this.createProjectile())
      }
    })
  }
}
export default Volcano