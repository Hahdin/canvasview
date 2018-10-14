class Boid {
  constructor(x, y, area) {
    this.mass = 1
    this.position = { x: x, y: y }
    this.velocity = { x: 0, y: 0 }
    this.acceleration = { x: 0, y: 0 }
    this.area = area
    this.separationDistance = 30;
    this.separationStrength = 40.01;
    this.cohesionDistance = 50;
    this.cohesionStrength = .003;
    this.alignmentDistance = area.x;
    this.alignmentStrength = .02;
    this.color = `rgb(${~~(Math.random() * 255)},${~~(Math.random() * 255)}, ${~~(Math.random() * 255)} )`

  }
  //  Heading is represented by a decimal value indicating the radians
  getheading() {
    return Math.atan2(this.velocity.x, this.velocity.y);
  }

  //  This function will be called to guide the boid while flocking
  applyForce(force) {
    //  Acceleration is force devided by mass
    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
  }

  update(neighbors) {
    let separationForce = this.calculateSeparation(neighbors);
    let cohesionForce = this.calculateCohesion(neighbors);
    let alignmentForce = this.calculateAlignment(neighbors);
    this.applyForce(separationForce);
    this.applyForce(cohesionForce);
    this.applyForce(alignmentForce);
    this.updatePosition()
  }
  calculateAlignment(neighbors) {
    let averageVelocity = { x: 0, y: 0 };
    let count = 0;
    neighbors.forEach(neighbor => {
      let distance = Math.abs(Math.sqrt(((this.position.x - neighbor.position.x) ** 2) + ((this.position.y - neighbor.position.y) ** 2)))
      if (distance < this.alignmentDistance) {
        averageVelocity.x += neighbor.velocity.x;
        averageVelocity.y += neighbor.velocity.y;
        count++;
      }
    })
    if (count > 0) {
      averageVelocity.x /= count;
      averageVelocity.y /= count;
    }
    let alignmentForce = {
      x: averageVelocity.x * this.  alignmentStrength,
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
    //return separationForce
    neighbors.forEach(neighbor => {
      //Distance = sqrt((x1 - x2)^2 + (y1 - y2)^2)
      let distance = Math.abs(Math.sqrt(((this.position.x - neighbor.position.x) ** 2) + ((this.position.y - neighbor.position.y) ** 2)))
      if (distance < this.separationDistance && distance > 0) {
        let offset = {
          x: this.position.x - neighbor.position.x,
          y: this.position.y - neighbor.position.y,
        }
        //sqrt(this.x*this.x + this.y*this.y);
        let mag = Math.abs(Math.sqrt((this.position.x ** 2) + (this.position.y ** 2)))
        let normalized = {
          x: offset.x / mag,
          y: offset.y / mag,
        }
        let force = { x: normalized.x /= distance, y: normalized.y /= distance };
        separationForce.x += force.x
        separationForce.y += force.y
        //console.log('sep force', separationForce)
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
    let velMax = 2
    this.velocity.x = this.velocity.x > velMax ? velMax : this.velocity.x < -velMax ? -velMax : this.velocity.x
    this.velocity.y = this.velocity.y > velMax ? velMax : this.velocity.y < -velMax ? -velMax : this.velocity.y

    //  Veloity is change in position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.x < 0 || this.position.x > this.area.x)
      this.velocity.x *= -1
    if (this.position.y < 0 || this.position.y > this.area.y)
      this.velocity.y *= -1



    //  Acceleration is reset each frame
    this.acceleration = { x: 0, y: 0 };
    // this.color = `rgb(${~~(Math.random() * 255)},${~~(Math.random() * 255)}, ${~~(Math.random() * 255)} )`
  }
}
export class Flock {
  constructor(flockSize, center) {
    this.boids = [];
    this.neighborDistance = 10;
    this.neighborDistanceSquared = Math.pow(this.neighborDistance, 2);
    this.size = flockSize;
    this.center = center
    this.area = { x: center.x * 2, y: center.y * 2 }
    this.populateFlock();
  }

  populateFlock() {
    for (var n = 0; n < this.size; n++) {

      //  The boids will be created at the center of the graph.
      this.boids.push(new Boid(this.center.x, this.center.y, this.area));

      //  The angle of the boids are evenly distributed in a circle
      var angle = (n / this.size) * 2 * Math.PI;

      //  The velocity is set based on the calculated angle
      this.boids[n].velocity = { x: Math.cos(angle), y: Math.sin(angle) };
    }
  }

  updateFlock() {
    // for(var i = 0; i < this.size; i++){
    //     this.boids[i].update();
    // }

    let neighbors = []
    this.boids.forEach((boid, i) => {
      //find this boid's neighbors
      this.boids.forEach((nboid, j) => {
        if (j !== i) {
          let sqDist = Math.pow(nboid.position.x - boid.position.x, 2) +
            Math.pow(nboid.position.y - boid.position.y, 2);
          sqDist < this.neighborDistanceSquared ? neighbors.push(nboid) : null
        }
      })
      boid.update(neighbors);
    })
  }
}
export default Flock
