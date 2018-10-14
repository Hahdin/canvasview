const dat = require('dat.gui');
import lib from './lib'
class Forrest {
  constructor(props) {
    this.state = {
      innerWidth: 0,
      innerHeight: 0,
      ctx: null,
      canvas: null,
      gui: null,//new dat.GUI({ width: 310 }),
      drawTimer: null,
      fadeTimer: null
      //specific stuff

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
  addGui() {
    let controller = {
    }
    // this.state.gui.add(controller, 'gravity', 0.1, 1).step(0.01).name('Gravity').onChange((value) => {
    //   if (this.state.gravity === value) return
    //   this.state.gravity = value
    // })
  }
  _fill(color, x, y) {
    lib._fill(this.state.ctx, color, x, y, this.state.innerWidth, this.state.innerHeight)
  }
  fade() {
    lib.cvFade(this.state.ctx,'rgba(0,0,0, 0.1)',this.state.innerWidth, this.state.innerHeight)
  }
  stop(){
    clearInterval(this.state.fadeTimer)
    clearInterval(this.state.drawTimer)
  }
  start() {
    this.state.drawTimer = setInterval(() =>{
      //this.draw()
    }, 60)
    this.state.fadeTimer = setInterval(this.fade.bind(this), 200)
  }
  //////////////////////////
  initData(){
  }
}
export default Forrest
