const dat = require('dat.gui');
import { lib } from '../helpers/'
import parentObject from './parentObject'
export const charles = {
  hungry: 0,
  goingToEat: false,
  tired: 0,
  currentInc: 0,
  knowledge:{
    food: [],
  },
  position: { x: 0, y: 0 },
  track: [],
  detectionradius: 0,
  hungerTimer: null,
  sleepTimer: null,
  vector: {
    x: 0,
    y: 0,
  },
  angle: 0,
  environment:{
    width: 0,
    height: 0,
    home: {
      x: 0,
      y: 0,
    },
    food:[],
    currentDistFromHome: 0,
  },
  initData() {
    this.position.x = this.innerWidth / 2
    this.position.y = this.innerHeight / 2
    this.environment.home.x = Math.round(Math.random() * this.innerWidth)
    this.environment.home.y = Math.round(Math.random() * this.innerHeight)

    let snacks = 5
    while(snacks--)
      this.environment.food.push(
        {
          pos:{
          x: Math.round(Math.random() * this.innerWidth), 
          y: Math.round(Math.random() * this.innerHeight)
          },
          amount: 100,
        })

    this.angle = Math.round(Math.random() * 360)
    this.vector.x = Math.cos(this.angle / 180 * Math.PI)
    this.vector.y = Math.sin(this.angle / 180 * Math.PI)
    this.environment.width = this.innerWidth
    this.environment.height = this.innerHeight
  },
  foundSnack(snack){
    let anySnacks = this.knowledge.food.filter(mysnack => mysnack.pos.x === snack.pos.x && mysnack.pos.y === snack.pos.y)
    return anySnacks.length > 0
    // return this.knowledge.food.filter(
    //   mysnack => mysnack.x === snack.x && mysnack.y === snack.y).length > 0
  },
  lookForFood() {
    //is there food within 200px?
    let _snack = null
    this.environment.food.forEach(snack =>{
      //if (_snack) return
      //let distance = Math.abs(Math.sqrt(((this.position.x - snack.pos.x) ** 2) + ((this.position.y - snack.pos.y) ** 2)))
      let distance = this.getDistance(this.position, snack.pos)
      if (distance < 50){
        _snack = snack
        if(!this.knowledge.food.filter(s => (s.pos.x === snack.pos.x && s.pos.y === snack.pos.y)).length)
          this.knowledge ={
            ...this.knowledge,
            food: this.knowledge.food.concat(snack)
          }
      }
    })
    return _snack
  },
  updatePos() {
    //move along vector
    let inc = 50
    inc -= this.hungry / 100 * 25
    inc = inc > 1 ? inc :  1
    this.currentInc = inc
    let x = Math.round(this.position.x + (inc * this.vector.x))
    let y = Math.round(this.position.y + (inc * this.vector.y))
    //did we hit a wall?
    if (x < 5 || x > this.environment.width -5){
     // if ( this.vector.x < 0)
        this.vector.x *= -1 //reverse
    }
    if (y < 5 || y > this.environment.height -5){
      this.vector.y *= -1//reverse
    }
    if (isNaN(x) || isNaN(y)){
      console.log('??')
      x = this.environment.home.x
      y = this.environment.home.y
    }
    this.position.x = x
    this.position.y = y
  },
  drawEnvironment(){
    this.ctx.fillStyle = 'cyan'
    lib.drawSphere(this.ctx, this.environment.home, 30)
    this.environment.food.forEach((snack, i, ar) =>{
      if (snack.amount <= 0){
        ar.splice(i, 1)
        ar.push(
          {
            pos: {
              x: Math.round(Math.random() * this.innerWidth),
              y: Math.round(Math.random() * this.innerHeight)
            },
            amount: 100,
          })

        return
      }
      this.ctx.fillStyle = this.foundSnack(snack) ? 'purple' : 'white'
      lib.drawSphere(this.ctx, snack.pos, snack.amount / 10)
    })
    this.knowledge.food.forEach((snack, i, ar) =>{
      if (snack.amount <= 0){
        ar.splice(i, 1)
        ar.push(
          {
            pos: {
              x: Math.round(Math.random() * this.innerWidth),
              y: Math.round(Math.random() * this.innerHeight)
            },
            amount: 100,
          })

        return
      }
    })
  },
  draw() {
    this.drawEnvironment()
    if (this.tired < 90) {//awake
      let hungryRad = (this.hungry / 5) < 2 ? 2 : (this.hungry / 5)
      let tiredRad = (this.tired / 4) < 2 ? 2 : (this.tired / 4)
      let rad = hungryRad + tiredRad
      if (this.tired > 86){
        //head home
        this.vector = this.getVector(this.position, this.environment.home)
        this.updatePos()
        this.ctx.fillStyle = 'orange'
        lib.drawSphere(this.ctx, this.position, rad)
        return
      }
      this.ctx.fillStyle = 'red'
      this.updatePos()
      let snack = this.lookForFood()
      let snackVector = null
      if (snack){
        //test, get vector to center
        let dist = this.getDistance(this.position, snack.pos) *0.7
        snackVector = this.getVector(this.position, snack.pos)
        this.ctx.strokeStyle = this.goingToEat ? 'hotpink' : 'green'
        this.ctx.lineWidth = this.goingToEat ? 4 : 1
        let pos= {
          x : this.position.x + ( dist * snackVector.x),
          y: this.position.y + (dist * snackVector.y),
        }
        lib.lineTo(this.ctx, this.position.x, this.position.y, pos.x, pos.y)
        //hungry?
      }
      if (this.hungry > 60 && !this.goingToEat) {
        //head to food
        this.goingToEat = true
        if (snackVector){
          this.vector.x = snackVector.x
          this.vector.y = snackVector.y
          let dist = this.getDistance(this.position, snack.pos)
          if (dist <= this.currentInc * 2){
            //got to food, eat!!
            this.hungry = 0
            snack.amount -= 50
            this.goingToEat = false
            this.angle = Math.round(Math.random() * 360)
            this.vector.x = Math.cos(this.angle / 180 * Math.PI)
            this.vector.y = Math.sin(this.angle / 180 * Math.PI)
      }
        }else{

          let snack = this.knowledge.food.length > 0 ? this.knowledge.food[0] : null
          snack = this.getClosestSnack(this.position)
          if (snack){
            let dist = this.getDistance(this.position, snack.pos)
            this.vector = this.getVector(this.position, snack.pos)
            if (dist <= this.currentInc * 2){
              //got to food, eat!!
              this.hungry = 0
              snack.amount -= 50
              this.goingToEat = false
              this.angle = Math.round(Math.random() * 360)
              this.vector.x = Math.cos(this.angle / 180 * Math.PI)
              this.vector.y = Math.sin(this.angle / 180 * Math.PI)
        }
          }
        }
      } else{
        this.goingToEat = false
      }

      lib.drawSphere(this.ctx, this.position, tiredRad)
      this.ctx.fillStyle = 'lightgreen'
      lib.drawSphere(this.ctx, this.position, hungryRad)
      this.track.push({ ...this.position })
      // if (this.track.length > 200)
      //   this.track.shift()
      //this.tracePath()
    } 
    else {//asleep
      this.ctx.fillStyle = 'yellow'
      lib.drawSphere(this.ctx, this.position, 10)
      this.angle = Math.round(Math.random() * 360)
      this.vector.x = Math.cos(this.angle / 180 * Math.PI)
      this.vector.y = Math.sin(this.angle / 180 * Math.PI)
    }
  },
  getClosestSnack(me){
    let _snack = null
    let dist = null
    this.knowledge.food.forEach((snack) =>{
      let d = this.getDistance(me, snack.pos)
      if ((dist && d < dist) || !dist){
        dist = d
        _snack = snack
      } 
    })
    return _snack
  },
  getDistance(posA, posB){
    return Math.abs(Math.sqrt(((posA.x - posB.x) ** 2) + ((posA.y - posB.y) ** 2)))
  },
  intersects(a, b, c, d, p, q, r, s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  },
  doesIntersect(x, y) {
    let lastpos = null
    let intersect = false
    this.track.forEach(pos => {
      if (intersect) return
      if (!lastpos) {
        lastpos = pos
        return
      }
      if (this.intersects(this.position.x, this.position.y, x, y, lastpos.x, lastpos.y, pos.x, pos.y)) {
        intersect = true
        this.ctx.strokeStyle = 'blue'
        this.ctx.lineWidth = 2
        lib.lineTo(this.ctx, lastpos.x, lastpos.y, pos.x, pos.y)
        return
      }
      lastpos = pos
    })
    if (!intersect) {
      let u = 0
    }
    return intersect
  },
  getheading() {
    return Math.atan2(this.velocity.x, this.velocity.y);
  },
  getVector(from, to){
    let diffX = to.x - from.x
    let diffY = to.y - from.y


    let mag = Math.abs(Math.sqrt((diffX ** 2) + (diffY ** 2)))
    let normalized = {
      x: diffX / mag,
      y: diffY / mag,
    }
    return normalized

  },
  tracePath() {
    this.ctx.strokeStyle = 'white'
    this.ctx.lineWidth = .1
    let last = null
    this.track.forEach(pos => {
      if (!last) {
        last = pos
        return
      }
      lib.lineTo(this.ctx, last.x, last.y, pos.x, pos.y)
      last = pos
    })
  },
  stop() {
    clearInterval(this.fadeTimer)
    clearInterval(this.drawTimer)
    clearInterval(this.hungerTimer)
    clearInterval(this.sleepTimer)
  },
  sleepTick() {
    this.tired += 2
    if (this.tired >= 100)
      this.tired = 0
  },
  hungerTick() {
    this.hungry += 10
    this.hungry = this.hungry > 100 ? 100 : this.hungry
    // if (this.hungry >= 100)
    //   this.hungry = 0
  },
  create() {
    return Object.assign({},parentObject, this)
  },
  start() {
    this.drawTimer = setInterval(() => {
      this.draw()
    }, 60)
    this.fadeTimer = setInterval(() => {
      this.fade()
    }, 500)
    this.hungerTimer = setInterval(() => {
      this.hungerTick()
    }, 2000)
    this.sleepTimer = setInterval(() => {
      this.sleepTick()
    }, 1000)
  },

}
export default charles
