const dat = require('dat.gui');
import {lib} from '../helpers/'
import parentObject from './parentObject'
export const volcanoObject = {
  //specific stuff
  circles: [],
  projectiles: [],
  mouse: {
    down: false,
    x: 0,
    y: 0,
  },
  projectileSize: 200,
  fireWorks: [],
  gravity: 0.0035,
  initialVelocity: 5,
  trackMouse: false,
  degRange: 70,
  particles: [],
  showFireworks: true,
  bounceVelRatio: 0.3,
  solid: true,
  addGui(){
    let controller = {
      projectileSize: this.projectileSize,
      gravity: this.gravity,
      initialVelocity: this.initialVelocity,
      trackMouse: this.trackMouse,
      degRange: this.degRange,
      showFireworks: this.showFireworks,
      bounceVelRatio: this.bounceVelRatio,
      solid: this.solid,
      mouse: this.mouse,
    }
    this.gui.add(controller, 'degRange', 10, 180).step(2).name('Vent ° Range').onChange((value) => {
      if (this.degRange === value) return
      this.degRange = value
    })
    this.gui.add(controller, 'projectileSize', 0, 1000).step(10).name('# of Projectiles').onChange((value) => {
      if (this.projectileSize === value) return
      this.projectileSize = value
    })
    this.gui.add(controller, 'gravity', 0, 0.1).step(0.0001).name('Gravity factor').onChange((value) => {
      if (this.gravity === value) return
      this.gravity = value
    })
    this.gui.add(controller, 'initialVelocity', 5, 50).step(1).name('Max. Velocity').onChange((value) => {
      if (this.initialVelocity === value) return
      this.initialVelocity = value
    })
    this.gui.add(controller, 'bounceVelRatio', 0.1, 1).step(0.1).name('Bounce Vel. Ratio').onChange((value) => {
      if (this.bounceVelRatio === value) return
      this.bounceVelRatio = value
    })
    this.gui.add(controller, 'trackMouse', 0, 1).name('Track Mouse').onChange((value) => {
      if (this.trackMouse === value) return
      this.trackMouse = value
    })
    this.gui.add(controller, 'showFireworks', 0, 1).name('Show Fireworks').onChange((value) => {
      if (this.showFireworks === value) return
      this.showFireworks = value
    })
    this.gui.add(controller, 'solid', 0, 1).name('Single Color FW').onChange((value) => {
      if (this.solid === value) return
      this.solid = value
    })
  },
  _trackMouse(e) {
    //since the canvas = full page the position of the mouse 
    //relative to the document will suffice
    this.mouse.x = e.pageX;
    this.mouse.y = e.pageY;
  },
  trackMouseButton(e) {
    this.mouse.down = !this.mouse.down;
  },
  mouseLeave(e) {
    //reset to center
    this.mouse.x = this.innerWidth / 2;
    this.mouse.y = this.innerHeight / 10;
  },

  initCanvas() {
    this.circles =  []
    this.projectiles =  []
    this.particles =  []
    this.canvas = document.getElementById("canvas")
    this.innerHeight = this.canvas.innerHeight = this.canvas.height = window.innerHeight * 0.9
    this.innerWidth = this.canvas.innerWidth = this.canvas.width = window.innerWidth * 0.9
    this.ctx = this.canvas.getContext("2d")
    this.gui = new dat.GUI({ width: 310 })
    this.canvas.addEventListener('mousemove', this._trackMouse.bind(this), false);
    this.canvas.addEventListener('mousedown', this.trackMouseButton.bind(this), false);
    this.canvas.addEventListener('mouseup', this.trackMouseButton.bind(this), false);
    this.canvas.addEventListener('mouseleave', this.mouseLeave.bind(this), false);
    this.addGui()
    this.initData()
  },
  start() {
    this.drawTimer = setInterval(() =>{
      this.projectile()
      this.explodeFireworks()
      this.drawParticles()
    }, 60)
    this.fadeTimer = setInterval(() => { this.fade() }, 400)
  },
  bounce(projectile) {
    if (projectile.yPos > this.innerHeight - 5) {
      projectile.verticalVelocity = (- projectile.verticalVelocity * this.bounceVelRatio)
      projectile.angle = 40 + Math.random() * 100
      projectile.horizontalVelocity = Math.cos(projectile.angle * Math.PI / 180) * projectile.verticalVelocity
      projectile.time = 0
    }
  },
  createProjectile() {
    let x = this.innerWidth / 2
    let y = this.innerHeight - this.innerHeight / 10
    if (this.trackMouse) {
      x = this.mouse.x ? this.mouse.x : x
      y = this.mouse.y ? this.mouse.y : y
    }

    let projectile = {
      angle: 90 - (this.degRange / 2) + (Math.random() * (this.degRange)),
      verticalVelocity: (this.initialVelocity / 2) + Math.random() * (this.initialVelocity / 2),
      xPos: x,
      yPos: y,
      time: 0,
      lineWidth: (Math.random() > 0.8) ? Math.random() * 10 : Math.random() * 2,
      color: `rgba(${255},${Math.random() * 50},${Math.random() * 50},${Math.random()})`,
      shadowColor: `rgba(${255},${255},${Math.random() * 255},${1})`,
    }
    projectile.verticalVelocity = (projectile.lineWidth < 2) ? Math.random() * this.initialVelocity : Math.random() * (this.initialVelocity + 10)
    projectile.horizontalVelocity = Math.cos(projectile.angle * Math.PI / 180) * projectile.verticalVelocity
    if (Math.random() * 100 > 99.5) {
      projectile.lineWidth = 20
      projectile.verticalVelocity = Math.random() * this.initialVelocity + 15
      projectile.horizontalVelocity = Math.cos(projectile.angle * Math.PI / 180) * projectile.verticalVelocity
      projectile.color = `rgba(${255},${200},${200},${0.8})`
    }
    return projectile
  },
  createFirework(projectile, i) {
    let { xPos, yPos } = projectile
    this.projectiles.splice(i, 1)//remove it
    let fw = {
      center: {
        x: xPos,
        y: yPos
      },
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
      a: 1,
      maxRadius: 50 + Math.random() * 100,
      lastRadius: 0,
      vel: 10 + Math.random() * 20,
      lineWidth: projectile.lineWidth,
      rotation: 0
    }
    this.fireWorks.push(fw)
  },
  explodeFireworks() {
    this.fireWorks.forEach((firework, i) => {
      this.explodeFw(firework)
      this.fireWorks.splice(i,1)
      return
    })
  },
  explodeFw(fw){
    //explode in a circuar pattern, add particles
    if (this.particles.length > 1500)
      return
    let color = this.getFireworkColor()
    let count = 100 + Math.round(Math.random() * 200)
    let angle = (Math.PI * 2) / count
    while(count--){
      let vel =   Math.random() * this.initialVelocity * 1 // 
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
      this.particles.push(p)
    }
  },
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
  },
  explode() {
    //let sparkle = Math.random() > 50 ? true : false
    this.particles.forEach((pt, i) => {
      this.ctx.lineWidth = pt.line
      let color = Math.random() > 0.5 ? `rgba(${pt.color.r},${pt.color.g},${pt.color.b},${Math.random() })`:
      `rgba(${255-pt.color.r},${255-pt.color.g},${255-pt.color.b},${Math.random() })`
      //chance of single  color
      if (this.solid){
        color = `rgba(${pt.color.r},${pt.color.g},${pt.color.b},${Math.random() })`
      }
      //last thing. Make a diff color for the 'end'

      if ( pt.time >= pt.timeToChange){
        if (this.solid)
        color = Math.random() > 0.5 ? 
          `rgba(${pt.color.b},${pt.color.r},${pt.color.g},${Math.random() })` : 
          `rgba(${255-pt.color.r},${255-pt.color.g},${255-pt.color.b},${Math.random() })`
        else
          color = Math.random() > 0.5 ? `rgba(${pt.color.b},${pt.color.r},${pt.color.g},${Math.random() })`:
          `rgba(${255-pt.color.b},${255-pt.color.r},${255-pt.color.g},${Math.random() })`
      }
      this.ctx.strokeStyle = this.ctx.fillStyle = color
      //calc using angle only
      let xComp = Math.cos(pt.a)
      let yComp = Math.sin(pt.a)
      let x = pt.x + (pt.vx * xComp)
      let g = (((this.gravity * 12) * pt.time) * ((this.gravity * 12) * pt.time++))
      let y = pt.y + ((pt.vy) * yComp) + g
      if (Math.random() > 0.5)
        lib.lineTo(this.ctx, pt.x, pt.y, x, y)
      else{
         let extra = Math.random()
         let line = pt.line
        if (extra > 0.95){
          this.ctx.fillStyle = 'rgba(255,255,255,1)'
        }
        this.drawSparkle({x: x, y: y}, line)
      }
      pt.x = x
      pt.y = y
      pt.line = pt.line * .96
      if (y > this.innerHeight){
        this.particles.splice(i, 1)
      }
    })
  },
  drawParticles(){
    this.explode()
  },
  drawSparkle(point, radius){
    this.ctx.beginPath()
    this.ctx.arc(point.x, point.y, radius, Math.PI * 2, false)
    this.ctx.fill();
  },
  projectile() {
    console.log('..')
    if (!this.mouse.down && this.projectiles.length < this.projectileSize) {
      while (this.projectiles.length < this.projectileSize) {
        this.projectiles.push(this.createProjectile())
      }
    }
    this.projectiles.forEach((projectile, i) => {
      this.ctx.strokeStyle = projectile.color
      this.ctx.fillStyle = projectile.color
      this.ctx.lineWidth = projectile.lineWidth
      this.ctx.shadowOffsetX = .5
      this.ctx.shadowOffsetY = .5
      this.ctx.shadowBlur = 20.01
      this.ctx.shadowColor = projectile.shadowColor
      let gravity = this.gravity
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
      if (newYPos < this.innerHeight) {
        lib.lineTo(this.ctx, projectile.xPos, projectile.yPos, newXPos, newYPos)
        
        if (projectile.lineWidth > 8) {
          this.ctx.beginPath()
          this.ctx.shadowOffsetX = 5.5
          this.ctx.shadowOffsetY = 5.5
          this.ctx.shadowBlur = 20.01
          this.ctx.arc(newXPos, newYPos, projectile.lineWidth / 2, Math.PI * 2, false);
          this.ctx.fill();
        }
      }
      if (projectile.yPos < (this.innerHeight - 5) && newYPos > this.innerHeight)
        newYPos = this.innerHeight - 1
      if (projectile.verticalVelocity > 0 && vertVelY < 0) {//apex
        //blow up?
        if (Math.random() > .9 && (projectile.yPos < this.innerHeight / 2) && this.showFireworks) {
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
      if (projectile.yPos > this.innerHeight || projectile.lineWidth < 0.02) {
        this.projectiles.splice(i, 1)
        if (!this.mouse.down && this.projectiles.length < this.projectileSize)
          this.projectiles.push(this.createProjectile())
      }
    })
  },
  create() {
    return Object.assign({},parentObject, this)
  },
}
export default volcanoObject
