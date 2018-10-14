const dat = require('dat.gui');
import lib from './lib'

const Arm = Arm ||{
  x:0,
  y: 0,
  length: 100,
  angle: 0,
  parent: null,
  color: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},${Math.random() })`,
  create: function (x,y,length, angle) {
    let obj = Object.create(this)
    obj.init(x,y,length, angle)
    return obj
  },
  init: function(x,y,length, angle){
    this.x = x
    this.y = y
    this.length = length
    this.angle = angle
  },
  getEndX: function(){
    let angle = this.angle, parent = this.parent
    while(parent){
      angle += parent.angle
      parent = parent.parent
    }
    
    return this.x + Math.cos(angle) * this.length
  },
  getEndY: function(){
    let angle = this.angle, parent = this.parent
    while(parent){
      angle += parent.angle
      parent = parent.parent
    }
    return this.y + Math.sin(angle) * this.length
  },
  render: function(ctx){
    ctx.strokeStyle = this.color
    ctx.lineWidth = 5
    //ctx.beginPath()
    //ctx.moveTo(this.x, this.y)
    console.log('render arm', this.getEndX(), this.getEndY(), this)
    lib.lineTo(ctx, this.x, this.y, this.getEndX(), this.getEndY())
    //ctx.stroke()
  }
}

const FKSystem = FKSystem || {
  arms: null,
  lastArm: null,
  x: 0,
  y: 0,
  create: function(x,y){
    let obj = Object.create(this)
    obj.init(x,y,)
    return obj
  },
  init: function(x,y){
    this.x = x
    this.y = y
    this.arms = []
  },
  addArm: function(length){
    let arm = Arm.create(0,0,length, 0)
    this.arms.push(arm)
    arm.parent = this.lastArm
    this.lastArm = arm
    this.update()
  },
  update: function(){
    this.arms.forEach(arm =>{
      if (arm.parent){
        arm.x = arm.parent.getEndX()
        arm.y = arm.parent.getEndY()
        //console.log('child arm', arm)
      
      } else{
        arm.x = this.x
        arm.y = this.y
        //console.log('parent arm', arm)
      }
    })
  },
  render: function(ctx){
    this.arms.forEach(arm => arm.render(ctx))
  },
  rotateArm: function(index, angle){
    this.arms[index].angle = angle
  },
  setArmLength: function(index, length){
    this.arms[index].length = length
  }
} 



class KinCanvas {
  constructor(props) {
    this.state = {
      innerWidth: 0,
      innerHeight: 0,
      ctx: null,
      canvas: null,
      gui: null,//new dat.GUI({ width: 310 }),
      drawTimer: null,
      fadeTimer: null,
      //specific
      fk: null,
      arms: [],
      angle: 0,
      lastPos: {
        x:null,
        y: null
      },
      mod1: 3.14,
      mod2: 0.657,
      mod3: -3.5,
      mod4: 8,
      angleChange: 0.01,
      lineColor: '#ff0000',
      arm1Length: 100,
      arm2Length: 70,
      arm3Length: 50,
      animationSpeed: 20,
      rainbow: {
        r: 255,
        g: 0,
        b: 0,
        change: 0
      },
      colorChange: 0.2,
      lineWidth: 0.1,
      opacity: 0.5

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
      mod1: this.state.mod1,
      mod2: this.state.mod2,
      mod3: this.state.mod3,
      angleChange: this.state.angleChange,
     // lineColor: this.state.lineColor,
      arm1Length: this.state.arm1Length,
      arm2Length: this.state.arm2Length,
      arm3Length: this.state.arm3Length,
      animationSpeed: this.state.animationSpeed,
      colorChange : this.state.colorChange,
      lineWidth: this.state.lineWidth,
      opacity: this.state.opacity
      // mod4: this.state.mod4,
    }

    this.state.gui.add(controller, 'mod1', -10, 10).step(0.01).name('Angle 1 mod.').onChange((value) => {
      if (this.state.mod1 === value) return
      //this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
      this.state.mod1 = value
    })
    this.state.gui.add(controller, 'mod2', -10, 10).step(0.01).name('Angle 2 mod.').onChange((value) => {
      if (this.state.mod2 === value) return
      //this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
      this.state.mod2 = value
    })
    this.state.gui.add(controller, 'mod3', -10, 10).step(0.01).name('Angle 3 mod.').onChange((value) => {
      if (this.state.mod3 === value) return
      //this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
      this.state.mod3 = value
    })
    this.state.gui.add(controller, 'arm1Length', 0, 200).step(10).name('Arm 1 length').onChange((value) => {
      if (this.state.arm1Length === value) return
      //this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
      this.state.arm1Length = value
    })
    this.state.gui.add(controller, 'arm2Length', 0, 200).step(10).name('Arm 2 length').onChange((value) => {
      if (this.state.arm2Length === value) return
      //this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
      this.state.arm2Length = value
    })
    this.state.gui.add(controller, 'arm3Length', 0, 200).step(10).name('Arm 3 length').onChange((value) => {
      if (this.state.arm3Length === value) return
      //this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
      this.state.arm3Length = value
    })
    this.state.gui.add(controller, 'animationSpeed', 2, 100).step(2).name('Redraw ms').onChange((value) => {
      if (this.state.animationSpeed === value) return
      this.state.animationSpeed = value
    })
    this.state.gui.add(controller, 'angleChange', 0, Math.PI).step(0.01).name('Rate of Change').onChange((value) => {
      if (this.state.angleChange === value) return
      //this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
      this._fill('rgba(0,0,0, 1)', 0, 0)
      this.state.angleChange = value
    })
    this.state.gui.add(controller, 'colorChange', 0, 5).step(0.01).name('Color Change Speed').onChange((value) => {
      if (this.state.colorChange === value) return
      this.state.colorChange = value
    })
    this.state.gui.add(controller, 'lineWidth', 0, 5).step(0.01).name('Color Line Size').onChange((value) => {
      if (this.state.lineWidth === value) return
      this.state.lineWidth = value
    })
    this.state.gui.add(controller, 'opacity', 0, 1).step(0.01).name('Line Opacity').onChange((value) => {
      if (this.state.opacity === value) return
      this.state.opacity = value
    })
    
    // this.state.gui.add(controller, 'angleChange', 0, Math.PI).step(0.01).name('Rate of Change').onChange((value) => {
    //   if (this.state.angleChange === value) return
    //   this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
    //   this.state.angleChange = value
    // })
    // this.state.gui.addColor(controller, "lineColor").name('Zone Color').onChange((value) =>{
    //   this.state.lineColor = value
      
    // })
    // this.state.gui.add(controller, 'mod4', 0.01, 100).step(0.01).name('Angle 4 mod.').onChange((value) => {
    //   if (this.state.mod4 === value) return
    //   this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
    //   this.state.mod4 = value
    // })
    // this.state.gui.add(controller, 'density', 1, 500).step(1).name('Density').onChange((value) => {
    //   if (this.state.density === value) return
    //   this.state.density = value
    // })
    // this.state.gui.add(controller, 'velocity', 1, 100).step(2).name('Velocity').onChange((value) => {
    //   if (this.state.velocity === value) return
    //   this.state.velocity = value
    // })
  }
  fade() {
    lib.cvFade(this.state.ctx,'rgba(0,0,0, 0.1)',this.state.innerWidth, this.state.innerHeight)
  }
  stop(){
    clearInterval(this.state.fadeTimer)
    clearInterval(this.state.drawTimer)
  }
  start() {
    console.log('starting kinematics')

     this.draw.bind(this)
    // this.drawParticles.bind(this)

    this.state.drawTimer = setInterval(() =>{
      let count = 30
      while(count--){
        
        this.draw()
      }
    }, this.state.animationSpeed)

    //this.state.fadeTimer = setInterval(this.fade.bind(this), 200)
  }
  updateRainbow(){
    let change = this.state.colorChange
    this.state.rainbow.change += change
    if (this.state.rainbow.change >= 0 && this.state.rainbow.change <= 255){
      this.state.rainbow.r -= change
      this.state.rainbow.g += change//full green
      this.state.rainbow.b = 0
    }
    else if (this.state.rainbow.change > 255 && this.state.rainbow.change <= 255 * 2){
      this.state.rainbow.r = 0
      this.state.rainbow.g -= change
      this.state.rainbow.b += change//full blue
    }
    else if (this.state.rainbow.change > 255 *2 && this.state.rainbow.change <= 255 * 3){
      this.state.rainbow.g = 0
      this.state.rainbow.b -= change
      this.state.rainbow.r += change//full red
    }else if (this.state.rainbow.change > 255 *3 && this.state.rainbow.change <= 255 * 4){
      this.state.rainbow.g += change//full red + green
      this.state.rainbow.b = 0//this.state.rainbow.r += change
    }else if (this.state.rainbow.change > 255 *4 && this.state.rainbow.change <= 255 * 5){
      this.state.rainbow.b += change
      this.state.rainbow.r -= change//full blue + green
    }else if (this.state.rainbow.change > 255 *5 && this.state.rainbow.change <= 255 * 6){
      this.state.rainbow.g -= change
      this.state.rainbow.r += change//full blue + red
    }else if (this.state.rainbow.change > 255 *7 && this.state.rainbow.change <= 255 * 8){
      this.state.rainbow.g = 0
      this.state.rainbow.b -= change// full red
      //this.state.rainbow.r += change
    } else{
      this.state.rainbow.change = 0
    }
   
  }

  draw(){
    // let lastX, lastY
    // this.state.arms.forEach((arm) =>{
    //   this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
    //   arm.angle = Math.sin(this.state.angle) * 1.2
    //   this.state.angle += 0.05
    //   lastX = arm.getEndX()
    //   lastY = arm.getEndY()
    //   arm.render(this.state.ctx)
    // })

    //using FKSystem
    //this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
    this.updateRainbow()
    //this.state.ctx.strokeStyle = this.state.lineColor

    this.state.ctx.strokeStyle = `rgba(${this.state.rainbow.r},${this.state.rainbow.g},${this.state.rainbow.b},${this.state.opacity})`
    this.state.ctx.lineWidth = this.state.lineWidth
    this.state.fk.setArmLength(0, this.state.arm1Length)
    this.state.fk.setArmLength(1, this.state.arm2Length)
    this.state.fk.setArmLength(2, this.state.arm3Length)
    this.state.fk.rotateArm(0, Math.sin(this.state.angle) * this.state.mod1)
    this.state.fk.rotateArm(1, Math.cos(this.state.angle) * this.state.mod2)
    this.state.fk.rotateArm(2, Math.sin(this.state.angle) * this.state.mod3)
    this.state.angle += this.state.angleChange
    this.state.fk.update()
    //this.state.fk.render(this.state.ctx)

    


    //manually using Arm
    // //we have 4 arms
    // this.state.ctx.clearRect(0,0,this.state.innerWidth, this.state.innerHeight)
    // this.state.arms[0].angle = Math.sin(this.state.angle) * this.state.mod1
    // this.state.arms[1].angle = Math.cos(this.state.angle ) * this.state.mod2
    // this.state.arms[2].angle = Math.sin(this.state.angle ) * this.state.mod3
    // this.state.arms[3].angle = Math.cos(this.state.angle ) * this.state.mod4
    // this.state.angle += 0.01
    // this.state.arms[1].x = this.state.arms[0].getEndX()
    // this.state.arms[1].y = this.state.arms[0].getEndY()
    // this.state.arms[2].x = this.state.arms[1].getEndX()
    // this.state.arms[2].y = this.state.arms[1].getEndY()
    // this.state.arms[3].x = this.state.arms[2].getEndX()
    // this.state.arms[3].y = this.state.arms[2].getEndY()

    // this.state.arms[0].render(this.state.ctx)
    // this.state.arms[1].render(this.state.ctx)
    // this.state.arms[2].render(this.state.ctx)
    // this.state.arms[3].render(this.state.ctx)

    //follow all arms
    //let x = this.state.fk.arms

    let x = this.state.fk.arms[2].getEndX(), y = this.state.fk.arms[2].getEndY()
    if (this.state.lastPos.x){
      lib.lineTo(this.state.ctx, this.state.lastPos.x, this.state.lastPos.y, x,y )
    }
    this.state.lastPos.x = x
    this.state.lastPos.y = y


  }
  //////////////////////////
  initData(){

    //useing FKSystem
    this.state.fk = FKSystem.create(this.state.innerWidth / 2 ,this.state.innerHeight / 2)

    this.state.fk.addArm(this.state.arm1Length)
    this.state.fk.addArm(this.state.arm2Length)
    this.state.fk.addArm(this.state.arm3Length)
    //manually
    // let arm = Arm.create(this.state.innerWidth / 2, this.state.innerHeight / 2, 100, 0)
    // let arm2 = Arm.create(arm.getEndX(), arm.getEndY(), 100, 1.3)
    // arm2.parent = arm
    // let arm3 = Arm.create(arm2.getEndX(), arm2.getEndY(), 100, 0)
    // arm3.parent = arm2
    // let arm4 = Arm.create(arm3.getEndX(), arm3.getEndY(), 100, 0)
    // arm4.parent = arm3
    // this.state.arms.push(arm)
    // this.state.arms.push(arm2)
    // this.state.arms.push(arm3)
    // this.state.arms.push(arm4)
  }
}
export default KinCanvas
