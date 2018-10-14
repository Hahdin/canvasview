const dat = require('dat.gui');
import lib from './lib'
export class Forrest {
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
      _length: 0,
      divergence: 0,
      line_width: 0,
      start_points: [],
      trunk_clr: null,
      //user controlled
      max_branches: 32000,
      start_length: 75,
      length_reduction: 0.8

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
    this.state.gui = new dat.GUI({ width: 310 })
    this.addGui()
    this.initData()
  }
  addGui() {
    let controller = {
      max_branches: this.state.max_branches,
      start_length: this.state.start_length,
      length_reduction: this.state.length_reduction
    }
    this.state.gui.add(controller, 'max_branches', 1, 128000).step(2).name('Max. Branches').onChange((value) => {
      if (this.state.max_branches === value) return
      this.state.max_branches = value
    })
    this.state.gui.add(controller, 'start_length', 20, 300).step(2).name('Trunk Length Max.').onChange((value) => {
      if (this.state.start_length === value) return
      this.state.start_length = value
    })
    this.state.gui.add(controller, 'length_reduction', 0.6, 0.9).step(0.01).name('Length Reduction %').onChange((value) => {
      if (this.state.length_reduction === value) return
      this.state.length_reduction = value
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
    this.state.drawTimer = null
  }
  start() {
    this.state.drawTimer = {draw: true}
    this.draw()// self contained timer
    this.state.fadeTimer = setInterval(this.fade.bind(this), 2000)
  }
  //////////////////////////
  initData() {

  }
  draw() {
    if (!this.state.drawTimer)
      return
    this.state._length = Math.round(Math.random() * this.state.start_length);
    if (this.state.start_length < 20)
      this.state.start_length = 20
    this.state.divergence = 5 + Math.round(Math.random() * 30);
    this.state.line_width = 1 + Math.round((this.state._length * 2 / 100) + Math.random());
    this.state.trunk_clr = `hsla(${Math.round(24 + Math.random() * 13)},100%,${Math.round(7 + Math.random() * 19)}%,${0.5 + Math.random() * 0.5})`

    //This is the end point of the trunk, from where branches will diverge
    let startX = Math.round(Math.random() * this.state.innerWidth);
    let trunk = { x: startX, y: this.state._length + 50, angle: 90 };
    //It becomes the start point for branches
    this.state.start_points = []; //empty the start points on every init();
    this.state.start_points.push(trunk);
    this.state.ctx.strokeStyle = this.state.trunk_clr;
    this.state.ctx.lineWidth = this.state.line_width;
    lib.lineTo(this.state.ctx, trunk.x, this.state.innerHeight - 50, trunk.x, this.state.innerHeight - trunk.y)
    this.drawBranches()
  }
  drawBranches() {
    let new_start_points = [];
    //this.state.ctx.beginPath();
    let z = this.state.start_points.length;
    let point_index = 0
    if (z > this.state.max_branches) {
      z = -1;
      point_index = -1
      this.state._length = 1;
    }
    this.setColor()//set based on length of branch
    
    while (z > 0) {
      let sp = this.state.start_points[point_index++];
      if (!sp){
        console.log('error')
        return
      }
      let gg = -5 + Math.random() * 10;
      let div1 = (Math.random() > 0.5) ? this.state.divergence * 0.8 : this.state.divergence * 1.03
      let div2 = (Math.random() > 0.5) ? this.state.divergence * 0.8 : this.state.divergence * 1.03
      let ep1 = this.get_endpoint(sp.x, sp.y, sp.angle + (div1), this.state._length);
      let ep2 = this.get_endpoint(sp.x, sp.y, sp.angle - (div2), this.state._length);
      //drawing the branches now
      lib.lineTo(this.state.ctx, sp.x, this.state.innerHeight - sp.y, ep1.x, this.state.innerHeight - ep1.y)
      lib.lineTo(this.state.ctx, sp.x, this.state.innerHeight - sp.y, ep2.x, this.state.innerHeight - ep2.y)
      gg = -40 + Math.random() * 80;
      ep1.angle = sp.angle + (div1 + gg);
      gg = -40 + Math.random() * 80;
      ep2.angle = sp.angle - (div2 - gg);
      new_start_points.push(ep1);
      new_start_points.push(ep2);
      z--
    }
    this.state.start_points = new_start_points;

    //reducing line_width and length
    this.state._length *= this.state.length_reduction;
    this.state.line_width *= 0.9;
    this.state.ctx.lineWidth = this.state.line_width;

    //change in divergence
    this.state.divergence = (Math.random() > 0.5) ? this.state.divergence * 0.8 : this.state.divergence * 1.03

    //recursive call - only if length is more than 2.
    //Else it will fall in an long loop
    if (this.state.drawTimer) {
      if (this.state._length > 0.5) {
        setTimeout(this.drawBranches.bind(this), 20);
      }
      else {
        setTimeout(this.draw.bind(this), 1000);
      }
    }
  }
  setColor() {
    let sZ = 30
    let inc = 5

    while (sZ >= inc) {
      if (this.state._length < sZ) {
        if (this.state._length < 5) {
          if (this.state._length > 2) {
            this.state.ctx.strokeStyle =
           // `hsla(${80 + Math.round(Math.random() * 70)},
            `hsla(${ Math.round(Math.random() * 360)},
            ${Math.round(80 + Math.random() * 20)}%,
            ${Math.round(Math.random() * 80)}%,
            0.2)`
            return
          } else {
            this.state.ctx.strokeStyle =
           // `hsla(${80 + Math.round(Math.random() * 70)},
            `hsla(${ Math.round(Math.random() * 360)},
            ${Math.round(80 + Math.random() * 20)}%,
            ${Math.round(Math.random() * 80)}%,
            0.1)`
            return
          }
        } else{
          let clr = lib.get_hsla();
          this.state.ctx.strokeStyle = clr;
          return
        }
      } else {//the trunk
        this.state.ctx.strokeStyle = this.state.trunk_clr;
        return
      }
      sZ -= inc
      if (sZ === inc)
        inc = 1
    }

  }
  get_endpoint(x, y, a, length) {
    //This function will calculate the end points based on simple vectors
    let epx = x + length * Math.cos(a * Math.PI / 180);
    let epy = y + length * Math.sin(a * Math.PI / 180);
    return { x: epx, y: epy };
  }

}
export default Forrest
