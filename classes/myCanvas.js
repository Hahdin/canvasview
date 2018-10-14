const dat = require('dat.gui');
class myCanvas {
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
      gravity: 0.0044,
      initialVelocity: 5,
      trackMouse: false,
      degRange: 70,
      particles: []
    }
    this._fill = this._fill.bind(this)
    this.initCanvas = this.initCanvas.bind(this)
    this.create_circle = this.create_circle.bind(this)
    this.get_colors = this.get_colors.bind(this)
    this.lineTo = this.lineTo.bind(this)
    this.fade = this.fade.bind(this)
    this.cvFade = this.cvFade.bind(this)
    this.start = this.start.bind(this)
    this.draw = this.draw.bind(this)
    this.createProjectile = this.createProjectile.bind(this)
    this.projectile = this.projectile.bind(this)
    this.trackMouse = this.trackMouse.bind(this)
    this.trackMouseButton = this.trackMouseButton.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.addGui = this.addGui.bind(this)
    this.bounce = this.bounce.bind(this)
    this.createFirework = this.createFirework.bind(this)
    this.explodeFireworks = this.explodeFireworks.bind(this)
    this.explodeFireworks_smooth = this.explodeFireworks_smooth.bind(this)
    this.drawParticles = this.drawParticles.bind(this)

  }


  addGui() {
    let controller = {
      projectileSize: this.state.projectileSize,
      gravity: this.state.gravity,
      initialVelocity: this.state.initialVelocity,
      trackMouse: this.state.trackMouse,
      degRange: this.state.degRange
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
    this.state.gui.add(controller, 'initialVelocity', 5, 50).step(5).name('Max. Velocity').onChange((value) => {
      if (this.state.initialVelocity === value) return
      this.state.initialVelocity = value
    })
    this.state.gui.add(controller, 'trackMouse', 0, 1).name('Track Mouse').onChange((value) => {
      if (this.state.trackMouse === value) return
      this.state.trackMouse = value
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

  get_colors() {
    let r = Math.round(Math.random() * 255)
    let g = Math.round(Math.random() * 255)
    let b = Math.round(Math.random() * 255)
    let a = Math.round(Math.random())
    a = 0.8
    let c1 = `rgba(${r},${g},${b},${a} )`
    let c2 = `rgba(${255 - r},${255 - g},${255 - b},${a} )`
    return { c1, c2 }
  }


  create_circle(w, h) {
    let u = -1.025
    let q = .02
    let inc = Math.PI / 3
    let c = {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: Math.random() * u - (u / 2),
      vy: Math.random() * u - (u / 2),
      veerx: Math.random() * q - (q / 2),
      veery: Math.random() * q - (q / 2),
      radius: Math.random() * w / 10,
      angle: Math.round(Math.random() * 360),
      inc: Math.random() * inc,
      linewidth: Math.random() * 3
    }
    //Random colors
    let next = this.get_colors();
    c.clr1 = next.c1;
    caches.clr2 = next.c2;
    next = this.get_colors()
    c.clr3 = next.c1;
    c.clr4 = next.c2;
    next = this.get_colors()
    c.clr5 = next.c1;
    c.clr6 = next.c2;
    next = this.get_colors()
    c.clr7 = next.c1;
    c.clr8 = next.c2;
    // next = this.get_colors()
    // c.clr9 = next.c1;
    // c.clr10 = next.c2;
    // next = this.get_colors()
    // c.clr11 = next.c1;
    // c.clr12 = next.c2;
    return c
  }

  initCanvas() {

    this.state.canvas = document.getElementById("canvas")
    this.state.innerHeight = this.state.canvas.innerHeight = this.state.canvas.height = window.innerHeight * 0.7
    this.state.innerWidth = this.state.canvas.innerWidth = this.state.canvas.width = window.innerWidth * 0.7
    console.log('hey', this.state.canvas)
    this.state.ctx = this.state.canvas.getContext("2d")
    canvas.addEventListener('mousemove', this.trackMouse, false);
    canvas.addEventListener('mousedown', this.trackMouseButton, false);
    canvas.addEventListener('mouseup', this.trackMouseButton, false);
    canvas.addEventListener('mouseleave', this.mouseLeave, false);
    // for (let i = 0; i < 15; i++) {
    //  // this.state.circles.push(this.create_circle(this.state.innerWidth, this.state.innerHeight))
    // }

    // for (let i = 0; i < this.state.projectileSize; i++) {
    //   //this.state.projectiles.push(this.createProjectile())
    // }
    this.state.gui = new dat.GUI({ width: 310 })
    this.addGui()

  }

  _fill(color, x, y) {
    this.state.ctx.fillStyle = color
    this.state.ctx.fillRect(x, y, this.state.innerWidth, this.state.innerHeight)
  }

  lineTo(x1, y1, x2, y2) {
    this.state.ctx.beginPath()
    this.state.ctx.moveTo(x1, y1)
    this.state.ctx.lineTo(x2, y2)
    this.state.ctx.stroke()
  }

  cvFade(color) {
    let old = this.state.ctx.shadowColor
    let oldComp = this.state.ctx.globalCompositeOperation
    this.state.ctx.shadowColor = color
    this.state.ctx.globalCompositeOperation = "source-over"
    this.state.ctx.fillStyle = color
    this.state.ctx.fillRect(0, 0, this.state.innerWidth, this.state.innerHeight)
    //restore old shadow
    this.state.ctx.shadowColor = old
    this.state.ctx.globalCompositeOperation = oldComp
  }

  fade() {
    this.cvFade('rgba(0,0,0, 0.1)')
  }

  start() {
    console.log('starting')
    // setInterval(this.draw.bind(this), 15)


    setInterval(this.projectile.bind(this), 60)
    //setInterval(this.explodeFireworks_smooth.bind(this), 10)
    setInterval(this.explodeFireworks.bind(this), 60)
    setInterval(this.drawParticles.bind(this), 20)
    

    // setInterval(() =>{
    //   let p = this.createProjectile()
    //   this.state.projectiles.push(p)
    //   this.createFirework(p, 0)

    // }, 2000)


    setInterval(this.fade.bind(this), 200)
  }
  bounce(projectile) {
    if (projectile.yPos > this.state.innerHeight - 5) {
      //console.log('b4', projectile.verticalVelocity)
      projectile.verticalVelocity = (- projectile.verticalVelocity * 0.7)
      projectile.angle = Math.random() * 120
      projectile.horizontalVelocity = Math.cos(projectile.angle * Math.PI / 180) * projectile.verticalVelocity
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

  createCircle(projectile, i) {
    //draw spokes out from this point
    this.state.projectiles.splice(i, 1)//remove it
    let rad = Math.random() * 100
    let center = {
      x: projectile.xPos,
      y: projectile.yPos
    }
    this.state.ctx.lineWidth = 0.2


    let counter = 0
    let color = `rgba(${255},${Math.random() * 255},${Math.random() * 255},${0.7})`
    for (let i = 0; i < 360; i += 1) {
      let point = {
        x: center.x + (rad * Math.cos(i * Math.PI / 180)),
        y: center.y + (rad * Math.sin(i * Math.PI / 180))
      }
      counter++
      let p = this.createProjectile()
      p.xPos = point.x
      p.yPos = point.y
      //p.angle = i
      p.horizontalVelocity = p.verticalVelocity = 0
      p.color = color
      p.lineWidth /= 3
      this.state.ctx.strokeStyle = p.color
      this.lineTo(center.x, center.y, point.x, point.y)
      if (counter >= 10) {
        this.state.projectiles.push(p)
        counter = 0
      }
    }
  }

  explodeFireworks_smooth() {
    //create a ball that grow and fades, use max and last radius
    this.state.fireWorks.forEach((firework, i) => {
      this.state.ctx.fillStyle = `rgba(${firework.r},${firework.g},${firework.b},${firework.a})`
      this.state.ctx.fillStyle = firework.color
      //   //grow the radius by a value
      let grow = 2
      this.state.ctx.beginPath()
      this.state.ctx.shadowOffsetX = 0
      this.state.ctx.shadowOffsetY = 0
      this.state.ctx.shadowBlur = 0
      this.state.ctx.arc(firework.center.x, firework.center.y, firework.lastRadius / 2, Math.PI * 2, false);
      this.state.ctx.fill();
      firework.lastRadius += grow
      firework.a = firework.a * 0.95
      // if (firework.lastRadius >= firework.maxRadius){
      if (firework.a < 0.005) {
        this.state.fireWorks.splice(i, 1)
      }
    })
  }

  explodeFireworks() {
    this.state.fireWorks.forEach((firework, i) => {
      this.explodeFw(firework)
      this.state.fireWorks.splice(i,1)
      return

      console.log(firework)
      this.state.ctx.strokeStyle = firework.color
      this.state.ctx.lineWidth = firework.lineWidth / 2
      let collect = false
      if (firework.lastRadius + firework.vel >= firework.maxRadius) {
        collect = true
      }
      let count = 0
      for (let a = 0; a < 360; a += 2) {
        count++
        let modA = a + firework.rotation
        if (modA > 360)
          modA = modA - 360

        let lastX = firework.center.x + (firework.lastRadius * Math.cos(modA * Math.PI / 180))
        let lastY = firework.center.y - (firework.lastRadius * Math.sin(modA * Math.PI / 180))
        let newX = lastX + (((firework.lastRadius + firework.vel)) * Math.cos(modA * Math.PI / 180))
        let newY = lastY - (((firework.lastRadius + firework.vel)) * Math.sin(modA * Math.PI / 180))

        this.lineTo(lastX, lastY, newX, newY)
        if (collect) {
          let p = this.createProjectile()
          p.xPos = newX
          p.yPos = newY
          p.angle = modA
          p.verticalVelocity = (firework.vel / 10) * Math.sin(modA * Math.PI / 180)
          p.horizontalVelocity = (Math.cos(modA * Math.PI / 180) * (firework.vel / 10)) / 3
          //p.color = `rgba(${firework.r},${firework.g},${firework.b},${firework.a})`
          p.lineWidth = .9
          p.type = 'fw'
          this.state.projectiles.push(p)
        }


      }
      firework.rotation += (Math.random() * 45)
      firework.lastRadius += firework.vel
      if (firework.lastRadius >= firework.maxRadius)
        this.state.fireWorks.splice(i, 1)

    })
  }

  getFireworkColor(){
    //4 types
    let x = Math.random()

    if (x > 0.75){
      return {
        r: 255,
        g: 0,
        b: 0
      }
    }else if (x > 0.5){
      return {
        r: 255,
        g: 125,
        b: 50
      }
    }else if (x > 0.25){
      return {
        r: 0,
        g: 255,
        b: 0
      }
    } else{
      return {
        r: 0,
        g: 0,
        b: 255
      }
    }
  }

  explodeFw(fw){
    //explode in a circuar pattern, add particles
    let color = {
      r: 100 + Math.random() *155,
      g: 100 + Math.random() *155,
      b: 100 + Math.random() *155,
      a: 1
    }

    color = this.getFireworkColor()
    console.log('k', color)


    let count = 60
    let angle = (Math.PI * 2) / count
    while(count--){
      let p = {
        x: fw.center.x,
        y: fw.center.y,
        vx: 2,
        vy: 2,
        a: count * angle,//in radians,
        time: 0,
        color:{
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        },
        line: 4
      }
      this.state.particles.push(p)
    }
  }

  drawParticles(){
    
    this.state.ctx.shadowOffsetX = 1
    this.state.ctx.shadowOffsetY = 1
    this.state.ctx.shadowBlur = 5
    this.state.ctx.shadowColor = 'rgba(255,255,255,1)'
    this.state.particles.forEach((pt, i) =>{
      let x = pt.x
      let y = pt.y
      let nx = x + Math.cos(pt.a) * pt.vx
      let ny = y - Math.sin(pt.a) * pt.vy
      this.state.ctx.lineWidth = pt.line
      pt.line = pt.line * 0.95
      //adjust the newY for gravity
      let grav = 0.018
      let value = (grav * pt.time) * (grav *pt.time++ )
      ny += value

      //pt.vy += 0.3
      this.state.ctx.strokeStyle = `rgba(${pt.color.r},${pt.color.g},${pt.color.b},${pt.color.a-= 0.005})`
      this.lineTo(x,y,nx,ny)
      this.state.ctx.fillStyle =Math.random() > 0.5 ? `rgba(${pt.color.r},${pt.color.g},${pt.color.b},${Math.random() })`:
      `rgba(${255-pt.color.r},${255-pt.color.g},${255-pt.color.b},${Math.random() })`
      this.drawSparkle({x: x, y: y}, pt.line)
      //this.drawSparkle({x: nx, y: ny}, pt.line)
      pt.x = nx
      pt.y = ny
      if (pt.y > this.state.innerHeight || pt.color.a < 0.005)
        this.state.particles.splice(i, 1)
    })
  }

  drawSparkle(point, radius){
    this.state.ctx.beginPath()
    this.state.ctx.arc(point.x, point.y, radius, Math.PI * 2, false)
    this.state.ctx.fill();

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


  // while (a < 360){
  //   let fw = this.createProjectile()
  //   fw.xPos = projectile.xPos
  //   fw.yPos = projectile.yPos
  //   fw.verticalVelocity = vv
  //   fw.angle = a
  //   fw.horizontalVelocity = Math.cos(a * Math.PI / 180) * vv
  //   fw.lineWidth = 0.5
  //   fw.color = `rgba(${150 + Math.random() * 100},${150 + Math.random() * 100},${150 + Math.random() * 100},${1})`
  //   this.state.projectiles.push(fw)
  //   //
  //   if (a >= 180 && a <= 360 ){
  //     //console.log(fw)
  //     fw.verticalVelocity *= -1
  //   }
  //   a += 10
  // }
  //}

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
      if (tsin < 0 && vertVelY > 0 && projectile.type) {
        //angle is already downwards, add accel to existing vel?
        let existing = projectile.verticalVelocity - grav
        let calc = (vertVelY * -1)

        //vertVelY = (projectile.verticalVelocity - grav)
        //vertVelY = existing < calc ? existing : calc
        vertVelY = calc - grav
        //projectile.horizontalVelocity =  Math.cos(projectile.angle * Math.PI / 180) * vertVelY
        //vertVelY = existing
        //vertVelY *= -1

      } else {
        vertVelY -= grav
      }

      if (projectile.type) {
        if (projectile.angle > 180 && projectile.angle < 360) {
          console.log('this  is a fw')
        }
      }

      if (vertVelY < -10 && (Math.random() > 0.6)) {
        //vertVelY = (-5 - Math.random() * -5)
        //projectile.horizontalVelocity -= projectile.horizontalVelocity / (12.5 + Math.random() * 12.5)
        //this.state.ctx.shadowBlur += this.state.ctx.shadowBlur 

      }
      let newYPos = projectile.yPos - (vertVelY)
      let newXPos = projectile.xPos + (projectile.horizontalVelocity)
      if (newYPos < this.state.innerHeight) {
        this.lineTo(projectile.xPos, projectile.yPos, newXPos, newYPos)
        if (projectile.lineWidth > 8) {
          this.state.ctx.beginPath()
          this.state.ctx.shadowOffsetX = 5.5
          this.state.ctx.shadowOffsetY = 5.5
          this.state.ctx.shadowBlur = 20.01
          this.state.ctx.arc(newXPos, newYPos, projectile.lineWidth / 2, Math.PI * 2, false);
          this.state.ctx.fill();
        }
      }


      //console.log('old', projectile)
      if (projectile.yPos < (this.state.innerHeight - 5) && newYPos > this.state.innerHeight)
        newYPos = this.state.innerHeight - 1

      if (projectile.verticalVelocity > 0 && vertVelY < 0) {//apex
        //blow up?
        //we want to add several new projectiles in a circle at this point
        if (Math.random() > .9 && (projectile.yPos < this.state.innerHeight / 2) && !projectile.type) {
          console.log('Boom!')
          this.createFirework(projectile, i)
          return
        }
      }
      projectile.xPos = newXPos
      projectile.yPos = newYPos
      projectile.verticalVelocity = vertVelY
      projectile.lineWidth -= projectile.lineWidth / 75
      projectile.horizontalVelocity -= projectile.horizontalVelocity / 50
      //projectile.horizontalVelocity = Math.cos(projectile.angle * Math.PI / 180) * projectile.verticalVelocity
      //console.log('new', projectile)
      this.bounce(projectile)

      if (projectile.yPos > this.state.innerHeight || projectile.lineWidth < 0.02) {
        this.state.projectiles.splice(i, 1)
        if (!this.state.mouse.down && this.state.projectiles.length < this.state.projectileSize)
          this.state.projectiles.push(this.createProjectile())
      }
    })
  }

  draw() {
    this.state.ctx.shadowOffsetX = 2.5
    this.state.ctx.shadowOffsetY = 2.5
    this.state.ctx.shadowBlur = 20.01
    for (let i = 0; i < this.state.circles.length; i++) {
      let c = this.state.circles[i]
      this.state.ctx.lineWidth = c.linewidth
      this.state.ctx.shadowOffsetX = c.radius / 20
      this.state.ctx.shadowOffsetY = c.radius / 20
      let sin = Math.sin(c.angle * Math.PI / 180) * c.radius
      let cos = Math.cos(c.angle * Math.PI / 180) * c.radius
      this.state.ctx.shadowColor = c.clr1
      this.state.ctx.strokeStyle = c.clr2
      this.lineTo(c.x, c.y, c.x - cos, c.y + sin)
      this.state.ctx.strokeStyle = c.clr3
      this.state.ctx.shadowColor = c.clr4
      this.lineTo(c.x, c.y, c.x + cos, c.y - sin)
      this.state.ctx.shadowColor = c.clr5
      this.state.ctx.strokeStyle = c.clr6
      this.lineTo(c.x, c.y, c.x + cos, c.y + sin)
      this.state.ctx.shadowColor = c.clr7
      this.state.ctx.strokeStyle = c.clr8
      this.lineTo(c.x, c.y, c.x - cos, c.y - sin)
      c.x += c.vx
      c.y += c.vy
      c.vx += c.veerx * Math.cos(c.angle * Math.PI / 180)
      c.vy -= c.veery * Math.sin(c.angle * Math.PI / 180)
      c.radius -= c.radius / (2000)
      c.linewidth -= c.linewidth / (2000)
      if (c.x > this.state.innerWidth + (this.state.innerWidth / 2) ||
        c.x < -(this.state.innerWidth / 2) ||
        c.y > this.state.innerHeight + this.state.innerHeight / 2 ||
        c.y < -(this.state.innerHeight / 2) ||
        c.radius <= 0 || c.radius <= 0.5) {
        let c = this.create_circle(this.state.innerWidth, this.state.innerHeight)
        this.state.circles.splice(i, 1)
        this.state.circles.push(c)
      }

      c.angle += c.inc;
      if (c.angle > 360) {
        c.angle = c.angle - 360
      }
      if (c.angle < 0) {
        c.angle = 360 + c.angle
      }
      this.state.ctx.beginPath()
    }
  }
}
export default myCanvas