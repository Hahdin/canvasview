const dat = require('dat.gui');
import {lib} from '../helpers/'
export const templateObject = {
  innerWidth: 0,
  innerHeight: 0,
  ctx: null,
  canvas: null,
  gui: null,
  drawTimer: null,
  fadeTimer: null,
  //specific stuff
  cleanup() {
    this.gui.destroy()
  },
  addGui(){
    let controller = {
    }
  },
  initData(){
  },
  initCanvas() {
    this.canvas = document.getElementById("canvas")
    this.innerHeight = this.canvas.innerHeight = this.canvas.height = window.innerHeight * 0.9
    this.innerWidth = this.canvas.innerWidth = this.canvas.width = window.innerWidth * 0.9
    this.ctx = this.canvas.getContext("2d")
    this.gui = new dat.GUI({ width: 310 })
    this.addGui()
    this.initData()
  },
  draw(){
  },
  start() {
    this.drawTimer = setInterval(() => { this.draw() }, this.drawTime)
    this.fadeTimer = setInterval(() => { this.fade() }, this.fadeTime)
  },
  stop(){
    clearInterval(this.fadeTimer)
    clearInterval(this.drawTimer)
  },
  _fill(color, x, y) {
    lib._fill(this.ctx, color, x, y, this.innerWidth, this.innerHeight)
  },
  fade() {
    lib.cvFade(this.ctx, 'rgba(0,0,0, 0.1)', this.innerWidth, this.innerHeight)
  },
  create() {
    return Object.assign(Object.create(this), { })
  },
}
export default templateObject
