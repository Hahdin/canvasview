const dat = require('dat.gui');
import lib from './lib'
export class Connect {
  constructor(props) {
    this.state = {
      innerWidth: 0,
      innerHeight: 0,
      ctx: null,
      canvas: null,
      gui: null,
      drawTimer: null,
      fadeTimer: null,
      //specific stuff
      flock: null,
      separationDistance: 50,
      separationStrength: 100,
      cohesionDistance: 60,
      cohesionStrength: .001,
      alignmentDistance: 100,
      alignmentStrength: .01,
      maxVelocity: 1,
      whoIsNeighbor: 100,
      numberOf: 100,
      consideration: 0.6,
      finLength: 10,
      sizeMax: 3,
      fadeTime: 120,
      showConnections: false,
    }
    this.cleanup = this.cleanup.bind(this)
  }
  cleanup() {
    this.state.gui.destroy()
  }
  initCanvas() {
    this.state.canvas = document.getElementById("canvas")
    this.state.innerHeight = this.state.canvas.innerHeight = this.state.canvas.height = window.innerHeight * 0.9
    this.state.innerWidth = this.state.canvas.innerWidth = this.state.canvas.width = window.innerWidth * 0.9
    this.state.ctx = this.state.canvas.getContext("2d")
    this.state.gui = new dat.GUI({ width: 400 })
    this.initData()
    this.addGui()
  }
  //////////////////////////
  initData() {
    //create some random points in space
    if (this.state.flock)
      this.state.flock = null
    let defaults = {
      separationDistance: this.state.separationDistance,
      separationStrength: this.state.separationStrength,
      cohesionDistance: this.state.cohesionDistance,
      cohesionStrength: this.state.cohesionStrength,
      alignmentDistance: this.state.alignmentDistance,
      alignmentStrength: this.state.alignmentStrength,
      maxVelocity: this.state.maxVelocity,
      whoIsNeighbor: this.state.whoIsNeighbor,
      consideration: this.state.consideration,
      sizeMax: this.state.sizeMax,
      ctx: this.state.ctx,
      showConnections: this.state.showConnections,
    }
    this.state.flock = new Flock(this.state.numberOf, { x: (window.innerWidth * 0.9) / 2, y: (window.innerHeight * 0.9) / 2 }, defaults)

  }
  addGui() {
    if (!this.state.flock)
      return
    if (this.state.gui) {
      this.state.gui.destroy()
      this.state.gui = null
    }
    this.state.gui = new dat.GUI({ width: 400 })
    let controller = {
      whoIsNeighbor: this.state.whoIsNeighbor,
      separationDistance: this.state.separationDistance,
      separationStrength: this.state.separationStrength,
      cohesionDistance: this.state.cohesionDistance,
      cohesionStrength: this.state.cohesionStrength,
      alignmentDistance: this.state.alignmentDistance,
      alignmentStrength: this.state.alignmentStrength,
      maxVelocity: this.state.maxVelocity,
      numberOf: this.state.numberOf,
      consideration: this.state.consideration,
      finLength: this.state.finLength,
      sizeMax: this.state.sizeMax,
      fadeTime: this.state.fadeTime,
      showConnections: this.state.showConnections,
    }
    this.state.gui.add(controller, 'whoIsNeighbor', 1, 500).step(1).name('Neighbor distance').onChange((value) => {
      if (this.state.whoIsNeighbor === value) return
      this.state.whoIsNeighbor = value
      this.state.flock.neighborDistance = value
      this.state.flock.neighborDistanceSquared = Math.pow(value, 2);

    })
    this.state.gui.add(controller, 'separationDistance', 1, 200).step(1).name('Keep this far apart').onChange((value) => {
      if (this.state.separationDistance === value) return
      this.state.separationDistance = value
      this.initData()
    })
    this.state.gui.add(controller, 'separationStrength', 1, 100).step(1).name('separation force').onChange((value) => {
      if (this.state.separationStrength === value) return
      this.state.separationStrength = value
      this.initData()
    })
    this.state.gui.add(controller, 'cohesionDistance', 1, 200).step(1).name('Keep this close together').onChange((value) => {
      if (this.state.cohesionDistance === value) return
      this.state.cohesionDistance = value
      this.initData()
    })
    this.state.gui.add(controller, 'cohesionStrength', 0.001, 1).step(0.001).name('cohesion force').onChange((value) => {
      if (this.state.cohesionStrength === value) return
      this.state.cohesionStrength = value
      this.initData()
    })
    this.state.gui.add(controller, 'alignmentDistance', 1, this.state.innerWidth).step(1).name('Align with neighbors').onChange((value) => {
      if (this.state.alignmentDistance === value) return
      this.state.alignmentDistance = value
      this.initData()
    })
    this.state.gui.add(controller, 'alignmentStrength', 0.001, 1).step(0.001).name('alignment force').onChange((value) => {
      if (this.state.alignmentStrength === value) return
      this.state.alignmentStrength = value
      this.initData()
    })
    this.state.gui.add(controller, 'maxVelocity', 1, 10).step(1).name('Max Vel.').onChange((value) => {
      if (this.state.maxVelocity === value) return
      this.state.maxVelocity = value
      this.initData()
    })
    this.state.gui.add(controller, 'numberOf', 2, 200).step(1).name('Number of Particles').onChange((value) => {
      if (this.state.numberOf === value) return
      this.state.numberOf = value
      this.initData()
    })
    this.state.gui.add(controller, 'consideration', 0, 1).step(.1).name('Consideration of Neighbors').onChange((value) => {
      if (this.state.consideration === value) return
      this.state.consideration = value
      this.initData()
    })
    this.state.gui.add(controller, 'finLength', 0, 20).step(1).name('Fin Length').onChange((value) => {
      if (this.state.finLength === value) return
      this.state.finLength = value
    })
    this.state.gui.add(controller, 'sizeMax', 2, 20).step(1).name('Max. Size').onChange((value) => {
      if (this.state.sizeMax === value) return
      this.state.sizeMax = value
      this.initData()
    })
    this.state.gui.add(controller, 'fadeTime', 60, 240).step(1).name('Fade time (ms)').onChange((value) => {
      if (this.state.fadeTime === value) return
      this.state.fadeTime = value
      clearInterval(this.state.fadeTimer)
      this.state.fadeTimer = setInterval(this.fade.bind(this), this.state.fadeTime)
    })
    this.state.gui.add(controller, 'showConnections', 0, 1).name('Show Connections').onChange((value) => {
      if (this.state.showConnections === value) return
      this.state.showConnections = value
      this.initData()
    })
  }
  _fill(color, x, y) {
    lib._fill(this.state.ctx, color, x, y, this.state.innerWidth, this.state.innerHeight)
  }
  fade() {
    lib.cvFade(this.state.ctx, 'rgba(0,0,0, 0.1)', this.state.innerWidth, this.state.innerHeight)
  }
  stop() {
    clearInterval(this.state.fadeTimer)
    clearInterval(this.state.drawTimer)
  }
  start() {
    this.state.drawTimer = setInterval(() => {
      this.draw()
    }, 60)
    this.state.fadeTimer = setInterval(this.fade.bind(this), this.state.fadeTime)
  }
  draw() {
    this.state.flock.updateFlock()
    let wing = 0.87
    //modify fin length by radius
    this.state.flock.boids.forEach(boid => {
      let fin = this.state.finLength * (boid.radius / 2)
      //fin = fin >= 10 ? fin : 10
      this.state.ctx.fillStyle = boid.color
      this.state.ctx.strokeStyle = boid.color
      lib.drawSphere(this.state.ctx, { x: boid.position.x, y: boid.position.y }, boid.radius)
      let heading = boid.getheading()
      let lineX = fin * Math.cos(heading - wing)
      let lineY = fin * Math.sin(heading - wing)
      lib.lineTo(this.state.ctx, boid.position.x, boid.position.y, boid.position.x + lineX, boid.position.y + lineY)
      lineX = -fin * Math.cos(heading + wing)
      lineY = -fin * Math.sin(heading + wing)
      let linesize = boid.radius / 4
      this.state.ctx.lineWidth = linesize > 0.7 ? 0.7 : linesize
      lib.lineTo(this.state.ctx, boid.position.x, boid.position.y, boid.position.x + lineX, boid.position.y + lineY)
    })
  }
}

class Boid {
  constructor(x, y, area, defaults) {
    this.position = { x: Math.round(Math.random() * area.x), y: Math.round(Math.random() * area.y) }
    this.velocity = { x: 0, y: 0 }
    this.acceleration = { x: 0, y: 0 }
    this.area = area
    this.separationDistance = defaults.separationDistance;
    this.separationStrength = defaults.separationStrength;
    this.cohesionDistance = defaults.cohesionDistance;
    this.cohesionStrength = defaults.cohesionStrength;
    this.alignmentDistance = defaults.alignmentDistance;
    this.alignmentStrength = defaults.alignmentStrength;
    this.maxVelocity = defaults.maxVelocity
    this.consideration = defaults.consideration
    this.ctx = defaults.ctx
    this.color = `rgb(${~~(Math.random() * 255)},${~~(Math.random() * 255)}, ${~~(Math.random() * 255)} )`
    //this.color = `rgb(${255},${~~(Math.random() * 255)}, ${~~(Math.random() * 255)} )`
    //this.color = `rgb(${~~(Math.random() * 255)},${255}, ${~~(Math.random() * 255)} )`
    //this.color = `rgb(${~~(Math.random() * 255)},${~~(Math.random() * 255)}, ${255} )`
    this.radius = ~~(Math.random() * defaults.sizeMax)
    this.mass = this.radius
  }
  //  Heading is represented by a decimal value indicating the radians
  getheading() {
    return Math.atan2(this.velocity.x, this.velocity.y);
  }

  //  This function will be called to guide the boid while flocking
  applyForce(force) {
    //  Acceleration is force devided by mass
    this.acceleration.x += force.x / (this.mass / 2);
    this.acceleration.y += force.y / (this.mass / 2);
  }

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
      this.velocity.x += ( -(this.maxVelocity / 2) + Math.random()* this.maxVelocity)
      this.velocity.y += ( -(this.maxVelocity / 2) + Math.random() * this.maxVelocity) 
    }
  }
  calculateAlignment(neighbors) {
    let averageVelocity = { x: 0, y: 0 };
    let count = 0;
    neighbors.forEach(neighbor => {
      let distance = Math.abs(Math.sqrt(((this.position.x - neighbor.position.x) ** 2) + ((this.position.y - neighbor.position.y) ** 2)))
      if (distance < this.alignmentDistance) {
        averageVelocity.x += (neighbor.velocity.x * neighbor.mass);
        averageVelocity.y += (neighbor.velocity.y * neighbor.mass);
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
    return alignmentForce
  }
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
  }
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
  }
  updatePosition() {
    //  Acceleration is change in velocity
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    let velMax = this.maxVelocity
    this.velocity.x = this.velocity.x > velMax ? velMax : this.velocity.x < -velMax ? -velMax : this.velocity.x
    this.velocity.y = this.velocity.y > velMax ? velMax : this.velocity.y < -velMax ? -velMax : this.velocity.y

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
  }
}
class Flock {
  constructor(flockSize, center, defaults) {
    this.boids = [];
    this.neighborDistance = defaults.whoIsNeighbor;
    this.neighborDistanceSquared = Math.pow(this.neighborDistance, 2);
    this.size = flockSize;
    this.center = center
    this.area = { x: center.x * 2, y: center.y * 2 }
    this.ctx = defaults.ctx
    this.showConnections = defaults.showConnections
    this.populateFlock(defaults);
  }

  populateFlock(defaults) {
    for (var n = 0; n < this.size; n++) {
      //  The boids will be created at the center of the graph.
      this.boids.push(new Boid(this.center.x, this.center.y, this.area, defaults));
      //  The angle of the boids are evenly distributed in a circle
      var angle = (n / this.size) * 2 * Math.PI;
      //  The velocity is set based on the calculated angle
      this.boids[n].velocity = { x: Math.cos(angle), y: Math.sin(angle) };
    }
  }

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
  }
}
export default Connect
