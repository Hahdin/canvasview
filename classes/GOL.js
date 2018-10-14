const dat = require('dat.gui');
import lib from './lib'
export class GOL {
  constructor(props) {
    this.state = {
      innerWidth: 0,
      innerHeight: 0,
      ctx: null,
      canvas: null,
      gui: null,//new dat.GUI({ width: 310 }),
      drawTimer: null,
      fadeTimer: null,
      //specific stuff
      grid_size: 0,
      xSize: 0,
      ySize: 0,
      map: [],
      lastMap: [],
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
    this._fill('rgba(255,255,255, 1)', 0, 0)
    this.initData()
  }
  initData() {
    this.state.grid_size = 20
    this.state.xSize = Math.round((this.state.innerWidth ) / this.state.grid_size)
    this.state.ySize = Math.round((this.state.innerHeight ) / this.state.grid_size)
    for (let i = 0; i < this.state.xSize; i++){
      this.state.lastMap[i] = []
      this.state.map[i] = []
      for (let j = 0; j < this.state.ySize; j++){
        this.state.map[i][j] = false
        this.state.lastMap[i][j] = false
      }
    }
    let count = Math.round(Math.random() * (this.state.xSize * this.state.ySize) )
    while(count--){
      let x = Math.round(Math.random() * (this.state.xSize - 1))
      let y = Math.round(Math.random() * (this.state.ySize - 1))
      this.state.map[x][y] = true
      this.state.lastMap[x][y] = true
      //set map
      //draw in column x, row y
      this.state.ctx.fillStyle = 'red'
      let sz = this.state.grid_size
      lib.drawSphere(this.state.ctx, {x:(x*sz) -(sz / 2), y:(y*sz) -(sz / 2)}, (sz / 2))
    }
  }
  /**
   * Any live cell with fewer than two live neighbors dies, as if by under population.
   * Any live cell with two or three live neighbors lives on to the next generation.
   * Any live cell with more than three live neighbors dies, as if by overpopulation.
   * Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

   */
  check(x,y){
    //check 8 neightbors
    let count = 0
    if (x> 0 && y > 0 && this.state.lastMap[x-1][y-1])//left top
      count++
    if (y > 0 && this.state.lastMap[x][y-1])//top
      count++
    if (y > 0 && x < this.state.xSize-1 && this.state.lastMap[x+1][y-1])//right top
      count++
    if (x > 0 && y < this.state.ySize-1 && this.state.lastMap[x-1][y+1])//left nottom
      count++
    if (y < this.state.ySize-1 && this.state.lastMap[x][y+1])//bottom
      count++
    if (y < this.state.ySize-1 &&  x < this.state.xSize-1 && this.state.lastMap[x+1][y+1])//right bottom
      count++
    if (x > 0 && this.state.lastMap[x-1][y])//left
      count++
    if (x < this.state.xSize-1 && this.state.lastMap[x+1][y])//right
      count++
    return count

  }
  draw() {
    //check lastMap for who should live/die/be born and update map
    this._fill('rgba(0,0,0, 1)', 0, 0)
    
    for (let i = 0; i < this.state.xSize; i++){
      for (let j = 0; j < this.state.ySize; j++){
        let died = false
        let neighbors = this.check(i,j)
        let sz = this.state.grid_size
        this.state.ctx.fillStyle = 'yellow'
        if (this.state.lastMap[i][j] === false){//dead
          if (neighbors === 3){
            this.state.ctx.fillStyle = 'red'
            this.state.map[i][j] = true//update map
          } else {
            //random resurrection
            if (Math.random() > 0.99999){
              this.state.ctx.fillStyle = 'purple'
              this.state.map[i][j] = true
            }
          }
        } else{//alive
          if (neighbors < 2 || neighbors > 3){
            this.state.map[i][j] = false
            died = true
          }
        }
        if (this.state.map[i][j]){
          
          lib.drawSphere(this.state.ctx, {x:(i*sz) -(sz / 2), y:(j*sz) -(sz / 2)}, (sz / 2))
        } else if (died){
          this.state.ctx.fillStyle = 'blue'
          lib.drawSphere(this.state.ctx, {x:(i*sz) -(sz / 2), y:(j*sz) -(sz / 2)}, (sz / 4))
        }
      }
    }
    //update lastMap to map
    for (let i = 0; i < this.state.xSize; i++){
      for (let j = 0; j < this.state.ySize; j++){
        this.state.lastMap[i][j] = this.state.map[i][j] ? true : false
      }
    }
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
    lib.cvFade(this.state.ctx, 'rgba(0,0,0, 0.1)', this.state.innerWidth, this.state.innerHeight)
  }
  stop() {
    clearInterval(this.state.fadeTimer)
    clearInterval(this.state.drawTimer)
  }
  start() {
    this.state.drawTimer = setInterval(() => {
      this.draw()
    }, 500)
    //this.state.fadeTimer = setInterval(this.fade.bind(this), 200)
  }
  //////////////////////////
}
export default GOL
