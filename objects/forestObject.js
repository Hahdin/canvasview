const dat = require('dat.gui');
import {lib} from '../helpers/'
import parentObject from './parentObject'
export const forestObject = {
  //specific stuff
  drawTimer: {
    draw: false,
  },
  _length: 0,
  divergence: 0,
  line_width: 0,
  start_points: [],
  trunk_clr: null,
  //user controlled
  max_branches: 32000,
  start_length: 75,
  length_reduction: 0.8,
  addGui(){
    let controller = {
      max_branches: this.max_branches,
      start_length: this.start_length,
      length_reduction: this.length_reduction
    }
    this.gui.add(controller, 'max_branches', 1, 128000).step(2).name('Max. Branches').onChange((value) => {
      if (this.max_branches === value) return
      this.max_branches = value
    })
    this.gui.add(controller, 'start_length', 20, 300).step(2).name('Trunk Length Max.').onChange((value) => {
      if (this.start_length === value) return
      this.start_length = value
    })
    this.gui.add(controller, 'length_reduction', 0.6, 0.9).step(0.01).name('Length Reduction %').onChange((value) => {
      if (this.length_reduction === value) return
      this.length_reduction = value
    })
  },
  draw(){
    if (!this.drawTimer)
      return
    this._length = Math.round(Math.random() * this.start_length);
    if (this.start_length < 20)
      this.start_length = 20
    this.divergence = 5 + Math.round(Math.random() * 30);
    this.line_width = 1 + Math.round((this._length * 2 / 100) + Math.random());
    this.trunk_clr = `hsla(${Math.round(24 + Math.random() * 13)},100%,${Math.round(7 + Math.random() * 19)}%,${0.5 + Math.random() * 0.5})`

    //This is the end point of the trunk, from where branches will diverge
    let startX = Math.round(Math.random() * this.innerWidth);
    let trunk = { x: startX, y: this._length + 50, angle: 90 };
    //It becomes the start point for branches
    this.start_points = []; //empty the start points on every init();
    this.start_points.push(trunk);
    this.ctx.strokeStyle = this.trunk_clr;
    this.ctx.lineWidth = this.line_width;
    lib.lineTo(this.ctx, trunk.x, this.innerHeight - 50, trunk.x, this.innerHeight - trunk.y)
    this.drawBranches()
  },
  start() {
    this.fadeTimer = setInterval(() => { this.fade() }, 2000)
    this.drawTimer = {draw: true}
    this.draw()// self contained timer
  },
  stop(){
    clearInterval(this.fadeTimer)
    this.drawTimer = null
  },
  drawBranches() {
    let new_start_points = [];
    let z = this.start_points.length;
    let point_index = 0
    if (z > this.max_branches) {
      z = -1;
      point_index = -1
      this._length = 1;
    }
    this.setColor()//set based on length of branch
    
    while (z > 0) {
      let sp = this.start_points[point_index++];
      if (!sp){
        console.log('error')
        return
      }
      let gg = -5 + Math.random() * 10;
      let div1 = (Math.random() > 0.5) ? this.divergence * 0.8 : this.divergence * 1.03
      let div2 = (Math.random() > 0.5) ? this.divergence * 0.8 : this.divergence * 1.03
      let ep1 = this.get_endpoint(sp.x, sp.y, sp.angle + (div1), this._length);
      let ep2 = this.get_endpoint(sp.x, sp.y, sp.angle - (div2), this._length);
      //drawing the branches now
      lib.lineTo(this.ctx, sp.x, this.innerHeight - sp.y, ep1.x, this.innerHeight - ep1.y)
      lib.lineTo(this.ctx, sp.x, this.innerHeight - sp.y, ep2.x, this.innerHeight - ep2.y)
      gg = -40 + Math.random() * 80;
      ep1.angle = sp.angle + (div1 + gg);
      gg = -40 + Math.random() * 80;
      ep2.angle = sp.angle - (div2 - gg);
      new_start_points.push(ep1);
      new_start_points.push(ep2);
      z--
    }
    this.start_points = new_start_points;
    //reducing line_width and length
    this._length *= this.length_reduction;
    this.line_width *= 0.9;
    this.ctx.lineWidth = this.line_width;
    //change in divergence
    this.divergence = (Math.random() > 0.5) ? this.divergence * 0.8 : this.divergence * 1.03
    //recursive call - only if length is more than 2.
    //Else it will fall in an long loop
    if (this.drawTimer) {
      if (this._length > 0.5) {
        setTimeout(this.drawBranches.bind(this), 20);
      }
      else {
        setTimeout(this.draw.bind(this), 1000);
      }
    }
  },
  setColor() {
    let sZ = 30
    let inc = 5

    while (sZ >= inc) {
      if (this._length < sZ) {
        if (this._length < 5) {
          if (this._length > 2) {
            this.ctx.strokeStyle =
            `hsla(${ Math.round(Math.random() * 360)},
            ${Math.round(80 + Math.random() * 20)}%,
            ${Math.round(Math.random() * 80)}%,
            0.2)`
            return
          } else {
            this.ctx.strokeStyle =
            `hsla(${ Math.round(Math.random() * 360)},
            ${Math.round(80 + Math.random() * 20)}%,
            ${Math.round(Math.random() * 80)}%,
            0.1)`
            return
          }
        } else{
          let clr = lib.get_hsla();
          this.ctx.strokeStyle = clr;
          return
        }
      } else {//the trunk
        this.ctx.strokeStyle = this.trunk_clr;
        return
      }
    }
  },
  get_endpoint(x, y, a, length) {
    //This function will calculate the end points based on simple vectors
    let epx = x + length * Math.cos(a * Math.PI / 180);
    let epy = y + length * Math.sin(a * Math.PI / 180);
    return { x: epx, y: epy };
  },
  create() {
    return Object.assign(parentObject.create(), this)
  },
}
export default forestObject
