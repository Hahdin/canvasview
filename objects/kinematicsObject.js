import {lib} from '../helpers/'
import parentObject from './parentObject'
const Arm = Arm ||{
  x:0,
  y: 0,
  length: 100,
  angle: 0,
  parent: null,
  color: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},${Math.random() })`,
  create (x,y,length, angle) {
    let obj = Object.create(this)
    obj.init(x,y,length, angle)
    return obj
  },
  init(x,y,length, angle){
    this.x = x
    this.y = y
    this.length = length
    this.angle = angle
  },
  getEndX(){
    let angle = this.angle, parent = this.parent
    while(parent){
      angle += parent.angle
      parent = parent.parent
    }
    
    return this.x + Math.cos(angle) * this.length
  },
  getEndY(){
    let angle = this.angle, parent = this.parent
    while(parent){
      angle += parent.angle
      parent = parent.parent
    }
    return this.y + Math.sin(angle) * this.length
  },
  render(ctx){
    ctx.strokeStyle = this.color
    ctx.lineWidth = 5
    console.log('render arm', this.getEndX(), this.getEndY(), this)
    lib.lineTo(ctx, this.x, this.y, this.getEndX(), this.getEndY())
  }
}

const FKSystem = FKSystem || {
  arms: null,
  lastArm: null,
  x: 0,
  y: 0,
  create(x,y){
    let obj = Object.create(this)
    obj.init(x,y,)
    return obj
  },
  init(x,y){
    this.x = x
    this.y = y
    this.arms = []
  },
  addArm(length){
    let arm = Arm.create(0,0,length, 0)
    this.arms.push(arm)
    arm.parent = this.lastArm
    this.lastArm = arm
    this.update()
  },
  update(){
    this.arms.forEach(arm =>{
      if (arm.parent){
        arm.x = arm.parent.getEndX()
        arm.y = arm.parent.getEndY()
      } else{
        arm.x = this.x
        arm.y = this.y
      }
    })
  },
  render(ctx){
    this.arms.forEach(arm => arm.render(ctx))
  },
  rotateArm(index, angle){
    this.arms[index].angle = angle
  },
  setArmLength(index, length){
    this.arms[index].length = length
  }
} 

export const kinematicsObject = {
  //specific stuff
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
  opacity: 0.5,
  addGui(){
    let controller = {
      mod1: this.mod1,
      mod2: this.mod2,
      mod3: this.mod3,
      angleChange: this.angleChange,
      arm1Length: this.arm1Length,
      arm2Length: this.arm2Length,
      arm3Length: this.arm3Length,
      animationSpeed: this.animationSpeed,
      colorChange : this.colorChange,
      lineWidth: this.lineWidth,
      opacity: this.opacity
    }
    this.gui.add(controller, 'mod1', -10, 10).step(0.01).name('Angle 1 mod.').onChange((value) => {
      if (this.mod1 === value) return
      this.mod1 = value
    })
    this.gui.add(controller, 'mod2', -10, 10).step(0.01).name('Angle 2 mod.').onChange((value) => {
      if (this.mod2 === value) return
      this.mod2 = value
    })
    this.gui.add(controller, 'mod3', -10, 10).step(0.01).name('Angle 3 mod.').onChange((value) => {
      if (this.mod3 === value) return
      this.mod3 = value
    })
    this.gui.add(controller, 'arm1Length', 0, 200).step(10).name('Arm 1 length').onChange((value) => {
      if (this.arm1Length === value) return
      this.arm1Length = value
    })
    this.gui.add(controller, 'arm2Length', 0, 200).step(10).name('Arm 2 length').onChange((value) => {
      if (this.arm2Length === value) return
      this.arm2Length = value
    })
    this.gui.add(controller, 'arm3Length', 0, 200).step(10).name('Arm 3 length').onChange((value) => {
      if (this.arm3Length === value) return
      this.arm3Length = value
    })
    this.gui.add(controller, 'animationSpeed', 2, 100).step(2).name('Redraw ms').onChange((value) => {
      if (this.animationSpeed === value) return
      this.animationSpeed = value
    })
    this.gui.add(controller, 'angleChange', 0, Math.PI).step(0.01).name('Rate of Change').onChange((value) => {
      if (this.angleChange === value) return
      this._fill('rgba(0,0,0, 1)', 0, 0)
      this.angleChange = value
    })
    this.gui.add(controller, 'colorChange', 0, 5).step(0.01).name('Color Change Speed').onChange((value) => {
      if (this.colorChange === value) return
      this.colorChange = value
    })
    this.gui.add(controller, 'lineWidth', 0, 5).step(0.01).name('Color Line Size').onChange((value) => {
      if (this.lineWidth === value) return
      this.lineWidth = value
    })
    this.gui.add(controller, 'opacity', 0, 1).step(0.01).name('Line Opacity').onChange((value) => {
      if (this.opacity === value) return
      this.opacity = value
    })
  },
  initData(){
    //useing FKSystem
    this.fk = FKSystem.create(this.innerWidth / 2 ,this.innerHeight / 2)
    this.fk.addArm(this.arm1Length)
    this.fk.addArm(this.arm2Length)
    this.fk.addArm(this.arm3Length)
  },
  draw(){
    this.updateRainbow()
    this.ctx.strokeStyle = `rgba(${this.rainbow.r},${this.rainbow.g},${this.rainbow.b},${this.opacity})`
    this.ctx.lineWidth = this.lineWidth
    this.fk.setArmLength(0, this.arm1Length)
    this.fk.setArmLength(1, this.arm2Length)
    this.fk.setArmLength(2, this.arm3Length)
    this.fk.rotateArm(0, Math.sin(this.angle) * this.mod1)
    this.fk.rotateArm(1, Math.cos(this.angle) * this.mod2)
    this.fk.rotateArm(2, Math.sin(this.angle) * this.mod3)
    this.angle += this.angleChange
    this.fk.update()
    let x = this.fk.arms[2].getEndX(), y = this.fk.arms[2].getEndY()
    if (this.lastPos.x){
      lib.lineTo(this.ctx, this.lastPos.x, this.lastPos.y, x,y )
    }
    this.lastPos.x = x
    this.lastPos.y = y
  },
  start() {
    this.drawTimer = setInterval(() =>{
      let count = 30
      while(count--){
        
        this.draw()
      }
    }, this.animationSpeed)
  },
  updateRainbow(){
    let change = this.colorChange
    this.rainbow.change += change
    if (this.rainbow.change >= 0 && this.rainbow.change <= 255){
      this.rainbow.r -= change
      this.rainbow.g += change//full green
      this.rainbow.b = 0
    }
    else if (this.rainbow.change > 255 && this.rainbow.change <= 255 * 2){
      this.rainbow.r = 0
      this.rainbow.g -= change
      this.rainbow.b += change//full blue
    }
    else if (this.rainbow.change > 255 *2 && this.rainbow.change <= 255 * 3){
      this.rainbow.g = 0
      this.rainbow.b -= change
      this.rainbow.r += change//full red
    }else if (this.rainbow.change > 255 *3 && this.rainbow.change <= 255 * 4){
      this.rainbow.g += change//full red + green
      this.rainbow.b = 0//
    }else if (this.rainbow.change > 255 *4 && this.rainbow.change <= 255 * 5){
      this.rainbow.b += change
      this.rainbow.r -= change//full blue + green
    }else if (this.rainbow.change > 255 *5 && this.rainbow.change <= 255 * 6){
      this.rainbow.g -= change
      this.rainbow.r += change//full blue + red
    }else if (this.rainbow.change > 255 *7 && this.rainbow.change <= 255 * 8){
      this.rainbow.g = 0
      this.rainbow.b -= change// full red
    } else{
      this.rainbow.change = 0
    }
  },
  create() {
    return Object.assign({},parentObject, this)
  },
}
export default kinematicsObject
