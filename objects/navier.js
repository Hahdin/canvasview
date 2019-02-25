// Based on http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf
/**
 * Note: Although there are some significant changes, much of the basis was 
 * based on code written by Oliver Hunt. (https://nerget.com/fluidSim/)
 * Another significant resource was https://codepen.io/FWeinb/pen/JhzvI (https://codepen.io/FWeinb/)
 * 
 * Copyright (c) 2009 Oliver Hunt <http://nerget.com>
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dat = require('dat.gui');
import { parentObject } from './parentObject'
import { lib } from '../helpers';
export const navier = {
  particles: [],
  drawTime: 60,
  fadeTime: 60,
  settings: {
    resolution: 64,
    fract: 1 / 4,
    dt: 0.1,
    iterations: 10,
  },
  centerPos: 0,
  scale: 0,
  dt0: 0,
  p5: 0,
  mouse: {
    down: false,
    x: 0,
    y: 0,
    lx: 0,
    ly: 0,
  },
  arraySize: 0,
  rows: 0,
  vectormaps: {},
  IX: null,
  showVectors: false,
  showDensities: false,
  showParticles: true,
  particleCount: 1000,
  particleSize: 3,
  maxVelocity: 8,
  showTrace: false,
  addGui() {
    let controller = {
      showTrace: this.showTrace,
      showVectors: this.showVectors,
      showDensities: this.showDensities,
      showParticles: this.showParticles,
      particleCount: this.particleCount,
      particleSize: this.particleSize,
      maxVelocity: this.maxVelocity,
      setFieldVectors: () =>{this.setFieldVectors()},
    }
    this.gui.add(controller, 'showTrace', 0, 1).name('Show Trace').onChange((value) => {
      if (this.showTrace === value) return
      this.showTrace = value
      this.setTrace()
    })
    this.gui.add(controller, 'showVectors', 0, 1).name('Show VectorMap').onChange((value) => {
      if (this.showVectors === value) return
      this.showVectors = value
    })
    this.gui.add(controller, 'showDensities', 0, 1).name('Show Densities').onChange((value) => {
      if (this.showDensities === value) return
      this.showDensities = value
    })
    this.gui.add(controller, 'showParticles', 0, 1).name('Show Particles').onChange((value) => {
      if (this.showParticles === value) return
      this.showParticles = value
    })
    this.gui.add(controller, 'particleCount', 10, 2000).step(1).name('Number of Particles').onChange((value) => {
      if (this.particleCount === value) return
      this.particleCount = value
      this.createParticles()
    })
    this.gui.add(controller, 'particleSize', 1, 10).step(1).name('Particle Size').onChange((value) => {
      if (this.particleSize === value) return
      this.particleSize = value
    })
    this.gui.add(controller, 'maxVelocity', 1, 10).step(1).name('Max Velocity').onChange((value) => {
      if (this.maxVelocity === value) return
      this.maxVelocity = value
    })
    this.gui.add(controller, 'setFieldVectors').name('Reset Vectors').onChange(() => {
      this.setFieldVectors()
      console.log('test')
    })
  },
  setTrace(){
    if (!this.showTrace){
      if (this.fadeTimer){
        clearInterval(this.fadeTimer)
        this.fadeTimer = null
      }
    } else{
      this.fadeTimer = setInterval(() => { this.fade() }, this.fadeTime)
    }

  },
  initCanvas() {
    this.canvas = document.getElementById("canvas")
    //make it square
    let ratio = 0.9
    let size = window.innerHeight * ratio < window.innerWidth * ratio ? window.innerHeight * ratio : window.innerWidth * ratio
    this.innerHeight = this.canvas.innerHeight = this.canvas.height = size
    this.innerWidth = this.canvas.innerWidth = this.canvas.width = size
    this.ctx = this.canvas.getContext("2d")
    this.gui = new dat.GUI({ width: 310 })
    this.addGui()
    this.initData()
  },
  createParticles() {
    let particles = this.particleCount
    this.particles = []
    while (particles--) {
      let x = Math.random() * this.innerWidth
      let y = Math.random() * this.innerHeight
      this.particles.push({
        pos: {
          x: x,
          y: y,
        },
        lastPos: {
          x: x,
          y: y,
        },
        velocity: {
          x: 0,
          y: 0,
        }
      }
      )
    }
  },
  initData() {
    this.createParticles()
    this.arraySize = (this.settings.resolution + 2) * (this.settings.resolution + 2)
    this.rows = this.settings.resolution + 2
    this.vectormaps = {
      U: new Float32Array(this.arraySize),
      V: new Float32Array(this.arraySize),
      D: new Float32Array(this.arraySize),
      U_prev: new Float32Array(this.arraySize),
      V_prev: new Float32Array(this.arraySize),
      D_prev: new Float32Array(this.arraySize),
      NullArray: new Float32Array(this.arraySize),

    }
    this.IX = new Array(this.rows)
    this.initLookupTable()
    for (let i = 0; i < this.arraySize; i++) {
      this.vectormaps.D_prev[i] =
        this.vectormaps.U_prev[i] =
        this.vectormaps.V_prev[i] =
        this.vectormaps.D[i] =
        this.vectormaps.U[i] =
        this.vectormaps.V[i] = this.vectormaps.NullArray[i] = 0.0
    }
    this.centerPos = (-0.5 / this.settings.resolution)
    this.scale = this.settings.resolution * 0.5
    this.dt0 = this.settings.dt * this.settings.resolution
    this.p5 = this.settings.resolution + 0.5
    this.canvas.addEventListener('mousedown', this.mouseClick.bind(this), false)
    this.canvas.addEventListener('mouseup', this.trackMouseButton.bind(this), false);
    this.canvas.addEventListener('mouseleave', this.mouseLeave.bind(this), false);
    this.setFieldVectors()
  },
  setFieldVectors() {
    let center = {
      x: this.innerWidth / 2,
      y: this.innerHeight / 2
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.rows; j++) {
        let v = this.getVector(i, j, center, 1)
        //let v = this.getVector(i, j, center, 3)
        //let v = this.getVector(i, j, center, 2)
        this.vectormaps.U[i + j * this.rows] = v.x
        this.vectormaps.V[i + j * this.rows] = v.y
      }
    }
  },
  getVector(xi, yi, center, type) {
    let x = 0, y = 0
    let xInc = this.innerWidth / this.rows
    let yInc = this.innerHeight / this.rows
    switch (type) {
      case 1:
      default: {
        let x1 = ((xi * xInc + xInc / 2) - (center.x)) / this.innerWidth
        let y1 = ((yi * yInc + yInc / 2) - (center.y)) / this.innerHeight
        let z1 = (x > 0 && y > 0) | (x < 0 && y < 0) ? 1 : -1
        x = y1 * z1
        y = x1 * z1
        break
      }
      case 2: {
        let atan = Math.atan2((yi * yInc) - center.y, (xi * xInc) - center.x) - 0.3
        x = Math.sin(atan)
        y = -Math.cos(atan)
        break
      }
      case 3: {
        let x = ((xi * xInc) - (center.x)) / this.innerWidth
        let y = ((yi * yInc) - (center.y)) / this.innerHeight
        return {
          x: Math.sin((2 * Math.PI * y)),
          y: Math.cos((2 * Math.PI * x)),
        }
        break
      }
    }
    return {
      x: x,
      y: x,
    }
  },
  trackMouse(e) {
    if (!this.mouse.down) return
    let xInc = this.innerWidth / this.rows
    let yInc = this.innerHeight / this.rows
    let ri = this.rows
    let mouseChanges = { dx: this.mouse.x - this.mouse.lx, dy: this.mouse.y - this.mouse.ly }
    if (mouseChanges.dx !== 0 || mouseChanges.dy !== 0) {
      let length = (Math.sqrt(mouseChanges.dx * mouseChanges.dx + mouseChanges.dy * mouseChanges.dy) + 0.5) | 0
      length = length < 1 ? 1 : length
      for (let i = 0; i < length; i++) {
        let cx = mouseChanges.dx * (i / length)
        let cy = mouseChanges.dy * (i / length)
        let x = ((this.mouse.lx + cx) / xInc) << 0
        let y = ((this.mouse.ly + cy) / yInc) << 0
        this.vectormaps.U[x + y * ri] = mouseChanges.dx
        this.vectormaps.V[x + y * ri] = mouseChanges.dy
        this.vectormaps.D[x + y * ri] = 30
      }
    }
    let { left, top } = lib.getTopLeftCanvas(this.canvas)
    this.mouse.lx = this.mouse.x
    this.mouse.ly = this.mouse.y
    this.mouse.x = event.clientX - left
    this.mouse.y = event.clientY - top
  },
  trackMouseButton(e) {
    this.mouse.down = false;
    this.canvas.removeEventListener('mousemove', this.trackMouse.bind(this), true)
  },
  mouseLeave(e) {
    //reset to center
    this.mouse.x = this.innerWidth / 2;
    this.mouse.y = this.innerHeight / 10;
    this.trackMouseButton(e)
  },
  setMouse(e) {
    let { left, top } = lib.getTopLeftCanvas(this.canvas)
    this.mouse.x = event.clientX - left
    this.mouse.y = event.clientY - top
    this.mouse.lx = event.clientX - left
    this.mouse.ly = event.clientY - top
  },
  mouseClick(e) {
    this.mouse.down = true
    this.vectormaps.D.set(this.vectormaps.NullArray)
    this.vectormaps.D_prev.set(this.vectormaps.NullArray)
    this.setMouse(e)

    let xInc = this.innerWidth / this.rows
    let yInc = this.innerHeight / this.rows
    let xi = (this.mouse.x / xInc) << 0
    let yi = (this.mouse.y / yInc) << 0
    this.vectormaps.D[xi + yi * this.rows] = 50
    this.canvas.addEventListener('mousemove', this.trackMouse.bind(this), true)
  },
  initLookupTable() {
    for (let i = 0; i < this.rows; i++) {
      this.IX[i] = new Array(this.rows)
      for (let b = 0; b < this.rows; b++) {
        this.IX[i][b] = i + b * this.rows
      }
    }
  },
  getColorValue(c) {
    if (c === 0) return c
    return c * 255 / 5
  },
  drawDensity() {
    let x = 0
    let y = 0
    let xInc = this.innerWidth / this.rows
    let yInc = this.innerHeight / this.rows
    while (x < this.rows) {
      y = 0
      while (y < this.rows) {
        let V = this.vectormaps.V[x + y * this.rows]
        let U = this.vectormaps.U[x + y * this.rows]
        let D = this.vectormaps.D[x + y * this.rows]
        let dcolor = D * 255 / 5
        let val = D > 0 ? true : false
        dcolor = dcolor | 0
        if (dcolor > 255) {
          dcolor = 255
        }
        let op = 0.4
        if (val && dcolor < 0){
          //overflowed and reset
          dcolor = 120
        }
        let vcolor = Math.abs(V * 255 * 10)
        let ucolor = Math.abs(U * 255 * 10)
        let rgba = `rgba(${dcolor}, ${vcolor}, ${ucolor}, ${op})`
        this.ctx.fillStyle = rgba
        let r = {
          x: x * xInc,
          y: y * yInc,
          w: xInc,
          h: yInc,
        }
        lib.drawRect(this.ctx, r.x, r.y, r.w, r.h, true, false)
        y++
      }
      x++
    }
  },
  draw() {
    if (!this.showTrace){
      this.ctx.fillStyle = 'black'
      lib.drawRect(this.ctx, 0, 0, this.innerWidth * 2, this.innerHeight * 2, true, false)
    }
    this.vel_step(this.vectormaps.U, this.vectormaps.V, this.vectormaps.U_prev, this.vectormaps.V_prev, this.settings.dt)
    this.dens_step(this.vectormaps.D, this.vectormaps.D_prev, this.vectormaps.U, this.vectormaps.V, this.settings.dt)
    //only do one type
    if (this.showVectors) {
      this.drawVectors()
      return
    }
    if (this.showDensities) {
      this.drawDensity()
      return
    }
    let ri = this.rows
    this.particles.forEach(particle => {
      let w = this.innerWidth
      let h = this.innerHeight
      let xInc = this.innerWidth / this.rows
      let yInc = this.innerHeight / this.rows
      //move it
      let xi = (particle.pos.x / xInc) << 0
      let yi = (particle.pos.y / yInc) << 0
      xi = xi > this.rows - 1 ? this.rows - 1 : xi < 0 ? 0 : xi
      yi = yi > this.rows - 1 ? this.rows - 1 : yi < 0 ? 0 : yi
      let V = this.vectormaps.V[xi + yi * ri]
      let U = this.vectormaps.U[xi + yi * ri]
      let D = this.vectormaps.D[xi + yi * ri]
      //add to particle velocity
      particle.velocity.x += U * 1
      particle.velocity.y += V * 1
      if (U === 0 && V === 0) {//edge case
        particle.velocity.x += 0.5
        particle.velocity.y += 0.5
      }
      let dis = Math.sqrt(particle.velocity.x ** 2 + particle.velocity.y ** 2)
      if (dis > this.maxVelocity) {
        particle.velocity.x *= (this.maxVelocity / dis)
        particle.velocity.y *= (this.maxVelocity / dis)
      }
      let color = this.getColorValue(dis)
      let dcolor = D * 255 / 5
      dcolor = dcolor | 0
      if (dcolor > 255) {
        dcolor = 255
      }
      this.ctx.fillStyle = `rgba(${color}, ${255 - dcolor}, ${255 - color}, 0.02)`
      this.ctx.strokeStyle = `rgba(${color}, ${255 - dcolor}, ${255 - color}, ${1})`
      let sz = this.particleSize
      this.ctx.lineWidth = sz
      let rr = (particle.pos.y - particle.lastPos.y)/(particle.pos.x - particle.lastPos.x)
      let ax = particle.lastPos.x + Math.cos(rr) * sz 
      let ay = particle.lastPos.y + Math.sin(rr)  * sz 
      if (Math.sqrt((particle.pos.x - particle.lastPos.x) ** 2 + (particle.pos.y - particle.lastPos.y) ** 2) < this.innerHeight / 2) {
        lib.lineTo(this.ctx, particle.lastPos.x, particle.lastPos.y, ax , ay)
      }
      //bounce off the sides
      if (particle.pos.x > w || particle.pos.x < 0) {
        particle.velocity.x *= -1
        particle.pos.x = particle.pos.x > w ? w - 5 : particle.pos.x < 0 ? 5 : particle.pos.x
      }
      if (particle.pos.y > h || particle.pos.y < 0) {
        particle.velocity.y *= -1
        particle.pos.y = particle.pos.y > h ? h - 5 : particle.pos.y < 0 ? 5 : particle.pos.y
      }
      //update new values
      particle.velocity.x *= 0.99//drag
      particle.velocity.y *= 0.99
      particle.lastPos.x = particle.pos.x
      particle.lastPos.y = particle.pos.y
      particle.pos.x += particle.velocity.x
      particle.pos.y += particle.velocity.y
    })
  },
  drawVectors() {
    let ri = this.rows
    let x = 0
    let y = 0
    let xInc = this.innerWidth / this.rows
    let yInc = this.innerHeight / this.rows
    while (x < this.rows) {
      y = 0
      while (y < this.rows) {
        let v = this.vectormaps.V[x + y * ri]
        let u = this.vectormaps.U[x + y * ri]
        let d = this.vectormaps.D[x + y * ri]
        let color = d * 255 / 5;
        color = color | 0
        color = color > 255 ? 255 : color
        this.ctx.fillStyle = `rgba(255,0,0,1)`
        this.ctx.strokeStyle = `rgba(${color},255,0,0.9)`
        this.ctx.lineWidth = 0.9
        let pos = { x: (x * xInc) + xInc / 2, y: y * yInc + yInc / 2 }
        let to = {
          x: (x + 0.5 + 50 * u) * xInc,
          y: (y + 0.5 + 50 * v) * yInc,
        }
        lib.lineTo(this.ctx, pos.x, pos.y, to.x, to.y)
        y++
      }
      x++
    }
  },
  start() {
    this.drawTimer = setInterval(() => { this.draw() }, this.drawTime)
    this.fadeTimer = setInterval(() => { this.fade() }, this.fadeTime)
  },
  create() {
    return { ...parentObject, ...this }
  },
  //velocity step
  vel_step(u, v, u0, v0, dt) {
    this.add_source(u, u0, dt);
    this.add_source(v, v0, dt);
    let temp = u0; u0 = u; u = temp;
    temp = v0; v0 = v; v = temp;
    this.diffuse2(u, u0, v, v0, dt);
    this.project(u, v, u0, v0);
    temp = u0; u0 = u; u = temp;
    temp = v0; v0 = v; v = temp;
    this.advect(1, u, u0, u0, v0, dt);
    this.advect(2, v, v0, u0, v0, dt);
    this.project(u, v, u0, v0);
  },
  dens_step(x, x0, u, v, dt) {//d, last d, u, v
    this.add_source(x, x0, dt);
    this.diffuse(0, x0, x, dt);
    this.advect(0, x, x0, u, v, dt);
  },
  add_source(x, s, dt) {
    for (let i = 0; i < this.arraySize; i++) {
      x[i] += dt * s[i];
    }
  },
  diffuse(b, x, x0, dt) {
    let a = 0;
    this.lin_solve(b, x, x0, a, 1 + 4 * a);
  },
  diffuse2(x, x0, y, y0, dt) {
    let a = 0;
    this.lin_solve2(x, x0, y, y0, a, 1 + 4 * a);
  },
  lin_solve(b, x, x0, a, c) {
    let rowSize = this.rows
    let height = this.rows
    let width = this.rows
    if (a === 0 && c === 1) {
      for (let j = 1; j <= height; j++) {
        let currentRow = j * rowSize;
        ++currentRow;
        for (let i = 0; i < width; i++) {
          x[currentRow] = x0[currentRow];
          ++currentRow;
        }
      }
      this.set_bnd(b, x);
    } else {
      let invC = 1 / c;
      for (let k = 0; k < this.settings.iterations; k++) {
        for (let j = 1; j <= height; j++) {
          let lastRow = (j - 1) * rowSize;
          let currentRow = j * rowSize;
          let nextRow = (j + 1) * rowSize;
          let lastX = x[currentRow];
          ++currentRow;
          for (let i = 1; i <= width; i++)
            lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[++currentRow] + x[++lastRow] + x[++nextRow])) * invC;
        }
        this.set_bnd(b, x);
      }
    }
  },
  lin_solve2(x, x0, y, y0, a, c) {
    if (a === 0 && c === 1) {
      for (let j = 1; j <= this.rows; j++) {
        let currentRow = j * this.rows;
        ++currentRow;
        for (let i = 0; i < this.rows; i++) {
          x[currentRow] = x0[currentRow];
          y[currentRow] = y0[currentRow];
          ++currentRow;
        }
      }
      this.set_bnd(1, x);
      this.set_bnd(2, y);
    } else {
      let invC = 1 / c;
      for (let k = 0; k < this.settings.iterations; k++) {
        for (let j = 1; j <= height; j++) {
          let lastRow = (j - 1) * this.rows;
          let currentRow = j * this.rows;
          let nextRow = (j + 1) * this.rows;
          let lastX = x[currentRow];
          let lastY = y[currentRow];
          ++currentRow;
          for (let i = 1; i <= width; i++) {
            lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[currentRow] + x[lastRow] + x[nextRow])) * invC;
            lastY = y[currentRow] = (y0[currentRow] + a * (lastY + y[++currentRow] + y[++lastRow] + y[++nextRow])) * invC;
          }
        }
        this.set_bnd(1, x);
        this.set_bnd(2, y);
      }
    }
  },
  project(u, v, p, div) {
    let rowSize = this.rows
    let height = this.rows
    let width = this.rows
    let h = -0.5 / Math.sqrt(width * height);
    for (let j = 1; j <= height; j++) {
      let row = j * rowSize;
      let previousRow = (j - 1) * rowSize;
      let prevValue = row - 1;
      let currentRow = row;
      let nextValue = row + 1;
      let nextRow = (j + 1) * rowSize;
      for (let i = 1; i <= width; i++) {
        div[++currentRow] = h * (u[++nextValue] - u[++prevValue] + v[++nextRow] - v[++previousRow]);
        p[currentRow] = 0;
      }
    }
    this.set_bnd(0, div);
    this.set_bnd(0, p);
    this.lin_solve(0, p, div, 1, 4);
    let wScale = 0.5 * width;
    let hScale = 0.5 * height;
    for (let j = 1; j <= height; j++) {
      let prevPos = j * rowSize - 1;
      let currentPos = j * rowSize;
      let nextPos = j * rowSize + 1;
      let prevRow = (j - 1) * rowSize;
      let nextRow = (j + 1) * rowSize;
      for (let i = 1; i <= width; i++) {
        u[++currentPos] -= wScale * (p[++nextPos] - p[++prevPos]);
        v[currentPos] -= hScale * (p[++nextRow] - p[++prevRow]);
      }
    }
    this.set_bnd(1, u);
    this.set_bnd(2, v);
  },
  advect(b, d, d0, u, v, dt) {
    let width = this.settings.resolution
    let height = this.settings.resolution
    let Wdt0 = dt * width;
    let Hdt0 = dt * height;
    let Wp5 = width + 0.5;
    let Hp5 = height + 0.5;
    for (let j = 1; j <= height; j++) {
      let pos = j * this.rows;
      for (let i = 1; i <= width; i++) {
        let x = i - Wdt0 * u[++pos];
        let y = j - Hdt0 * v[pos];
        if (x < 0.5)
          x = 0.5;
        else if (x > Wp5)
          x = Wp5;
        let i0 = x | 0;
        let i1 = i0 + 1;
        if (y < 0.5)
          y = 0.5;
        else if (y > Hp5)
          y = Hp5;
        let j0 = y | 0;
        let j1 = j0 + 1;
        let s1 = x - i0;
        let s0 = 1 - s1;
        let t1 = y - j0;
        let t0 = 1 - t1;
        let row1 = j0 * this.rows;
        let row2 = j1 * this.rows;
        d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2])
      }
    }
    this.set_bnd(b, d);
  },
  // Calculate Boundary's
  fcnIX(i, j) {
    let N = this.settings.resolution
    return (i) + (N + 2) * (j)
  },
  set_bnd(b, x) {
    //w = h
    let N = this.settings.resolution
    for (let i = 1; i <= N; i++) {
      x[this.fcnIX(0, i)] = b === 1 ? -x[this.fcnIX(1, i)] : x[this.fcnIX(1, i)]
      x[this.fcnIX(N + 1, i)] = b === 1 ? -x[this.fcnIX(N, i)] : x[this.fcnIX(N, i)]
      x[this.fcnIX(i, 0)] = b === 2 ? -x[this.fcnIX(i, 1)] : x[this.fcnIX(i, 1)]
      x[this.fcnIX(i, N + 1)] = b === 2 ? -x[this.fcnIX(i, N)] : x[this.fcnIX(i, N)]
    }
    // IX\[(\w[^,]*\s?\W\s?\w\s?\w?[+]?\s?\w?)]
    x[this.fcnIX(0, 0)] = 0.5 * (x[this.fcnIX(1, 0)] + x[this.fcnIX(0, 1)])
    x[this.fcnIX(0, N + 1)] = 0.5 * (x[this.fcnIX(1, N + 1)] + x[this.fcnIX(0, N)])
    x[this.fcnIX(N + 1, 0)] = 0.5 * (x[this.fcnIX(N, 0)] + x[this.fcnIX(N + 1, 1)])
    x[this.fcnIX(N + 1, N + 1)] = 0.5 * (x[this.fcnIX(N, N + 1)] + x[this.fcnIX(N + 1, N)])
  },
}
