const dat = require('dat.gui');
import {lib} from '../helpers/'
import parentObject from './parentObject'
export const flockObject = {
  //specific stuff
  flock: null,
  separationDistance: 50,
  separationStrength: 100,
  cohesionDistance: 60,
  cohesionStrength: .001,
  alignmentDistance: 100,
  alignmentStrength: .001,
  maxVelocity: 3,
  whoIsNeighbor: 100,
  numberOf: 100,
  consideration: 0.6,
  finLength: 10,
  sizeMax: 2,
  fadeTime: 120,
  showConnections: false,
  addGui() {
    if (!this.flock)
      return
    if (this.gui) {
      this.gui.destroy()
      this.gui = null
    }
    this.gui = new dat.GUI({ width: 400 })
    let controller = {
      whoIsNeighbor: this.whoIsNeighbor,
      separationDistance: this.separationDistance,
      separationStrength: this.separationStrength,
      cohesionDistance: this.cohesionDistance,
      cohesionStrength: this.cohesionStrength,
      alignmentDistance: this.alignmentDistance,
      alignmentStrength: this.alignmentStrength,
      maxVelocity: this.maxVelocity,
      numberOf: this.numberOf,
      consideration: this.consideration,
      finLength: this.finLength,
      sizeMax: this.sizeMax,
      fadeTime: this.fadeTime,
      showConnections: this.showConnections,
    }
    this.gui.add(controller, 'whoIsNeighbor', 1, 500).step(1).name('Neighbor distance').onChange((value) => {
      if (this.whoIsNeighbor === value) return
      this.whoIsNeighbor = value
      this.flock.neighborDistance = value
      this.flock.neighborDistanceSquared = Math.pow(value, 2);

    })
    this.gui.add(controller, 'separationDistance', 1, 200).step(1).name('Keep this far apart').onChange((value) => {
      if (this.separationDistance === value) return
      this.separationDistance = value
      this.initData()
    })
    this.gui.add(controller, 'separationStrength', 1, 100).step(1).name('separation force').onChange((value) => {
      if (this.separationStrength === value) return
      this.separationStrength = value
      this.initData()
    })
    this.gui.add(controller, 'cohesionDistance', 1, 200).step(1).name('Keep this close together').onChange((value) => {
      if (this.cohesionDistance === value) return
      this.cohesionDistance = value
      this.initData()
    })
    this.gui.add(controller, 'cohesionStrength', 0.001, 0.01).step(0.001).name('cohesion force').onChange((value) => {
      if (this.cohesionStrength === value) return
      this.cohesionStrength = value
      this.initData()
    })
    this.gui.add(controller, 'alignmentDistance', 1, this.innerWidth).step(1).name('Align with neighbors').onChange((value) => {
      if (this.alignmentDistance === value) return
      this.alignmentDistance = value
      this.initData()
    })
    this.gui.add(controller, 'alignmentStrength', 0, 0.01).step(0.001).name('alignment force').onChange((value) => {
      if (this.alignmentStrength === value) return
      this.alignmentStrength = value
      this.initData()
    })
    this.gui.add(controller, 'maxVelocity', 1, 10).step(1).name('Max Vel.').onChange((value) => {
      if (this.maxVelocity === value) return
      this.maxVelocity = value
      this.initData()
    })
    this.gui.add(controller, 'numberOf', 2, 200).step(1).name('Number of Particles').onChange((value) => {
      if (this.numberOf === value) return
      this.numberOf = value
      this.initData()
    })
    this.gui.add(controller, 'consideration', 0, 1).step(.1).name('Consideration of Neighbors').onChange((value) => {
      if (this.consideration === value) return
      this.consideration = value
      this.initData()
    })
    this.gui.add(controller, 'finLength', 0, 20).step(1).name('Fin Length').onChange((value) => {
      if (this.finLength === value) return
      this.finLength = value
    })
    this.gui.add(controller, 'sizeMax', 2, 20).step(1).name('Max. Size').onChange((value) => {
      if (this.sizeMax === value) return
      this.sizeMax = value
      this.initData()
    })
    this.gui.add(controller, 'fadeTime', 60, 240).step(1).name('Fade time (ms)').onChange((value) => {
      if (this.fadeTime === value) return
      this.fadeTime = value
      clearInterval(this.fadeTimer)
      this.fadeTimer = setInterval(this.fade.bind(this), this.fadeTime)
    })
    this.gui.add(controller, 'showConnections', 0, 1).name('Show Connections').onChange((value) => {
      if (this.showConnections === value) return
      this.showConnections = value
      this.initData()
    })
  },
  initData() {
    if (this.flock)
      this.flock = null
    let defaults = {
      separationDistance: this.separationDistance,
      separationStrength: this.separationStrength,
      cohesionDistance: this.cohesionDistance,
      cohesionStrength: this.cohesionStrength,
      alignmentDistance: this.alignmentDistance,
      alignmentStrength: this.alignmentStrength,
      maxVelocity: this.maxVelocity,
      whoIsNeighbor: this.whoIsNeighbor,
      consideration: this.consideration,
      sizeMax: this.sizeMax,
      ctx: this.ctx,
      showConnections: this.showConnections,
      flockSize: this.numberOf,
      center:{
        x: this.innerWidth / 2,
        y: this.innerHeight / 2
      },
      neighborDistance: this.whoIsNeighbor,
      neighborDistanceSquared: this.whoIsNeighbor ** 2,
      boids: [],
    }
    let _flock = _Flock.create( defaults)
    _flock.populateFlock()
    this.flock = _flock
  },
  draw(){
    this.flock.updateFlock()
    let wing = 0.87
    //modify fin length by radius
    this.flock.boids.forEach(boid => {
      let fin = this.finLength * (boid.radius / 2)
      //fin = fin >= 10 ? fin : 10
      this.ctx.fillStyle = boid.color
      this.ctx.strokeStyle = boid.color
      this.ctx.shadowColor = boid.scolor;
      this.ctx.shadowOffsetX = 1;
      this.ctx.shadowOffsetY = 1;
      this.ctx.shadowBlur = 10;

      lib.drawSphere(this.ctx, { x: boid.position.x, y: boid.position.y }, boid.radius)
      let heading = boid.getheading()
      let lineX = fin * Math.cos(heading - wing)
      let lineY = fin * Math.sin(heading - wing)
      this.ctx.strokeStyle = boid.scolor
      lib.lineTo(this.ctx, boid.position.x, boid.position.y, boid.position.x + lineX, boid.position.y + lineY)
      lineX = -fin * Math.cos(heading + wing)
      lineY = -fin * Math.sin(heading + wing)
      let linesize = boid.radius / 4
      this.ctx.lineWidth = linesize > 0.7 ? 0.7 : linesize
      lib.lineTo(this.ctx, boid.position.x, boid.position.y, boid.position.x + lineX, boid.position.y + lineY)
    })
  },
  start() {
    this.drawTimer = setInterval(() => {
      this.draw()
    }, 60)
    this.fadeTimer = setInterval(() => { this.fade() }, this.fadeTime)
  },
  create() {
    return  {...parentObject, ...this}
  },
}
const _Boid = {
  area: {
    x:0,
    y:0,
  },
  position : { x: 0, y: 0 },
  velocity : { x: 0, y: 0 },
  acceleration : { x: 0, y: 0 },
  separationDistance : 0,
  separationStrength : 0,
  cohesionDistance : 0,
  cohesionStrength : 0,
  alignmentDistance : 0,
  alignmentStrength : 0,
  maxVelocity : 0,
  consideration : 0,
  ctx : null,
  color : '',
  radius : 0,
  mass : 0,
  pcntX: 0,//test, % vel x changes that are negative - left
  pcntY: 0,//test, % vel y changes that are negative - up
  updates: 0,//# of updates
  getheading() {
    return Math.atan2(this.velocity.x, this.velocity.y);
  },
  //  This function will be called to guide the boid while flocking
  applyForce(force) {
    //  Acceleration is force devided by mass
    this.acceleration.x += force.x / (this.mass / 2);
    this.acceleration.y += force.y / (this.mass / 2);
  },
  update(neighbors) {
    let separationForce = this.calculateSeparation(neighbors);
    let cohesionForce = this.calculateCohesion(neighbors);
    let alignmentForce = this.calculateAlignment(neighbors);
    if (Math.random() < this.consideration) {
      this.applyForce(separationForce);
      this.applyForce(cohesionForce);
      this.applyForce(alignmentForce);
    }
    this.updatePosition()
    if (neighbors.length <= 0){
      this.velocity.x += ( -(this.maxVelocity / 2) + Math.random()* this.maxVelocity) / 10;
      this.velocity.y += ( -(this.maxVelocity / 2) + Math.random() * this.maxVelocity) / 10;
    }
  },
  calculateAlignment(neighbors) {
    let averageVelocity = { x: 0, y: 0 };
    let count = 0;
    neighbors.forEach(neighbor => {
      let distance = Math.abs(Math.sqrt(((this.position.x - neighbor.position.x) ** 2) + ((this.position.y - neighbor.position.y) ** 2)))
      if (distance < this.alignmentDistance) {
        averageVelocity.x += (neighbor.velocity.x * neighbor.mass) / 10;
        averageVelocity.y += (neighbor.velocity.y * neighbor.mass) / 10;
        count++;
      }
    })
    if (count > 0) {
      averageVelocity.x /= count;
      averageVelocity.y /= count;
    }
    let alignmentForce = {
      x: averageVelocity.x * this.alignmentStrength,
      y: averageVelocity.y * this.alignmentStrength
    };
    //console.log(alignmentForce);
    return alignmentForce
  },
  calculateCohesion(neighbors) {
    let averagePosition = { x: 0, y: 0 };
    let count = 0
    neighbors.forEach(neighbor => {
      let distance = Math.abs(Math.sqrt(((this.position.x - neighbor.position.x) ** 2) + ((this.position.y - neighbor.position.y) ** 2)))
      if (distance > this.cohesionDistance) {
        averagePosition.x += neighbor.position.x
        averagePosition.y += neighbor.position.y
        count++
      }
    })
    if (count > 0) {
      averagePosition.x /= count;
      averagePosition.y /= count;

      let displacement = {
        x: averagePosition.x - this.position.x,
        y: averagePosition.y - this.position.y
      }
      //  This vector is the force we want to apply to our boid to keep it away from neighbors
      var cohesionForce = {
        x: displacement.x * this.cohesionStrength,
        y: displacement.y * this.cohesionStrength
      };
      return cohesionForce
    }
    return { x: 0, y: 0 }
  },
  calculateSeparation(neighbors) {
    let separationForce = { x: 0, y: 0 }
    neighbors.forEach(neighbor => {
      let distance = Math.abs(Math.sqrt(((this.position.x - neighbor.position.x) ** 2) + ((this.position.y - neighbor.position.y) ** 2)))
      if (distance < this.separationDistance && distance > 0) {
        let offset = {
          x: this.position.x - neighbor.position.x,
          y: this.position.y - neighbor.position.y,
        }
        let mag = Math.abs(Math.sqrt((this.position.x ** 2) + (this.position.y ** 2)))
        let normalized = {
          x: offset.x / mag,
          y: offset.y / mag,
        }
        let force = { x: normalized.x /= distance, y: normalized.y /= distance };
        separationForce.x += force.x
        separationForce.y += force.y
      }
    })
    let _force = {
      x: separationForce.x * this.separationStrength,
      y: separationForce.y * this.separationStrength,
    }
    return _force
  },
  updatePosition() {
    //  Acceleration is change in velocity
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    let velMax = this.maxVelocity
    this.velocity.x = this.velocity.x > velMax ? velMax : this.velocity.x < -velMax ? -velMax : this.velocity.x
    this.velocity.y = this.velocity.y > velMax ? velMax : this.velocity.y < -velMax ? -velMax : this.velocity.y

    this.updates = this.updates + 1
    if (this.velocity.x < 0){
      this.pcntX = this.pcntX + 1
    }
    if (this.velocity.y < 0){
      this.pcntY = this.pcntY + 1
    }
    let curPcntX =  this.pcntX / this.updates  * 100
    let curPcnty = this.pcntY / this.updates  * 100
    //  Veloity is change in position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.x < 0) {
      this.position.x = this.area.x
    }
    if (this.position.y < 0) {
      this.position.y = this.area.y
    }
    if (this.position.x > this.area.x) {
      this.position.x = 0
    }
    if (this.position.y > this.area.y) {
      this.position.y = 0
    }
    this.acceleration = { x: 0, y: 0 };
  },
  create({...args}) {
    return  {...this, ...args}
  },
}
const _Flock ={
  flockSize: 1,
  center: {
    x:0,
    y:0,
  },
  defaults: null,
  boids: [],
  neighborDistance : 0,
  neighborDistanceSquared : 0,
  ctx: null,
  showConnections: false,
  populateFlock() {
    for (var n = 0; n < this.flockSize; n++) {
      //  The boids will be created at the center of the graph.
      let rad = (Math.random() * this.sizeMax)
      let newBoid = _Boid.create({
        x: this.center.x,
        y: this.center.y,
        area: {
          x:this.center.x * 2,
          y:this.center.y * 2,
        },
        position : { x: Math.round(Math.random() * this.center.x * 2), y: Math.round(Math.random() * this.center.y * 2) },
        velocity : { x: 0, y: 0 },
        acceleration : { x: 0, y: 0 },
        separationDistance : this.separationDistance,
        separationStrength : this.separationStrength,
        cohesionDistance : this.cohesionDistance,
        cohesionStrength : this.cohesionStrength,
        alignmentDistance : this.alignmentDistance,
        alignmentStrength : this.alignmentStrength,
        maxVelocity : this.maxVelocity,
        consideration : this.consideration,
        ctx : this.ctx,
        color : `rgba(${~~(Math.random() * 255)},${~~(Math.random() * 255)}, ${~~(Math.random() * 255)}, ${(Math.random())} )`,
        scolor : `rgba(${(Math.random() * 255)},${~~(Math.random() * 255)}, ${~~(Math.random() * 255)}, 0.6 )`,
        radius : rad,
        mass : rad,
      })
      //  The angle of the boids are evenly distributed in a circle
      let angle = (n / this.flockSize) * 2 * Math.PI;
      //  The velocity is set based on the calculated angle
      newBoid.velocity = { x: Math.cos(angle), y: Math.sin(angle) };
      this.boids.push(newBoid)
    }
  },
  updateFlock() {
    let neighbors = []
    this.boids.forEach((boid, i) => {
      if (isNaN(boid.position.x) || isNaN(boid.position.y)) {
        return
      }
      //find this boid's neighbors
      this.boids.forEach((nboid, j) => {
        if (j !== i) {
          let sqDist = Math.pow(nboid.position.x - boid.position.x, 2) +
            Math.pow(nboid.position.y - boid.position.y, 2);
          sqDist < this.neighborDistanceSquared ? neighbors.push(nboid) : null
        }
      })
      boid.update([...neighbors]);
      if (this.showConnections) {
        this.ctx.lineWidth = 0.1
        this.ctx.strokeStyle = boid.color
        neighbors.forEach(n => {
          lib.lineTo(this.ctx, boid.position.x, boid.position.y, n.position.x, n.position.y)
        })
      }
      neighbors = []
    })
  },
  create({...args}) {
    return  {...this, ...args}
  },
}
export default flockObject
