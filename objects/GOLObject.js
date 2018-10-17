import {lib} from '../helpers/'
export const GOLObject = {
  innerWidth: 0,
  innerHeight: 0,
  ctx: null,
  canvas: null,
  drawTimer: null,
  //specific stuff
  grid_size: 0,
  xSize: 0,
  ySize: 0,
  map: [],
  lastMap: [],
  cleanup() {
  },
  initData(){
    this.grid_size = 20
    this.xSize = Math.round((this.innerWidth ) / this.grid_size)
    this.ySize = Math.round((this.innerHeight ) / this.grid_size)
    for (let i = 0; i < this.xSize; i++){
      this.lastMap[i] = []
      this.map[i] = []
      for (let j = 0; j < this.ySize; j++){
        this.map[i][j] = false
        this.lastMap[i][j] = false
      }
    }
    let count = Math.round(Math.random() * (this.xSize * this.ySize) )
    while(count--){
      let x = Math.round(Math.random() * (this.xSize - 1))
      let y = Math.round(Math.random() * (this.ySize - 1))
      this.map[x][y] = true
      this.lastMap[x][y] = true
      //set map
      //draw in column x, row y
      this.ctx.fillStyle = 'red'
      let sz = this.grid_size
      lib.drawSphere(this.ctx, {x:(x*sz) -(sz / 2), y:(y*sz) -(sz / 2)}, (sz / 2))
    }
  },
  initCanvas() {
    this.canvas = document.getElementById("canvas")
    this.innerHeight = this.canvas.innerHeight = this.canvas.height = window.innerHeight * 0.9
    this.innerWidth = this.canvas.innerWidth = this.canvas.width = window.innerWidth * 0.9
    this.ctx = this.canvas.getContext("2d")
    this.initData()
  },
  draw() {
    //check lastMap for who should live/die/be born and update map
    this._fill('rgba(0,0,0, 1)', 0, 0)
    for (let i = 0; i < this.xSize; i++){
      for (let j = 0; j < this.ySize; j++){
        let died = false
        let neighbors = this.check(i,j)
        let sz = this.grid_size
        this.ctx.fillStyle = 'yellow'
        if (this.lastMap[i][j] === false){//dead
          if (neighbors === 3){
            this.ctx.fillStyle = 'red'
            this.map[i][j] = true//update map
          } else {
            //random resurrection
            if (Math.random() > 0.99999){
              this.ctx.fillStyle = 'purple'
              this.map[i][j] = true
            }
          }
        } else{//alive
          if (neighbors < 2 || neighbors > 3){
            this.map[i][j] = false
            died = true
          }
        }
        if (this.map[i][j]){
          lib.drawSphere(this.ctx, {x:(i*sz) -(sz / 2), y:(j*sz) -(sz / 2)}, (sz / 2))
        } else if (died){
          this.ctx.fillStyle = 'blue'
          lib.drawSphere(this.ctx, {x:(i*sz) -(sz / 2), y:(j*sz) -(sz / 2)}, (sz / 4))
        }
      }
    }
    //update lastMap to map
    for (let i = 0; i < this.xSize; i++){
      for (let j = 0; j < this.ySize; j++){
        this.lastMap[i][j] = this.map[i][j] ? true : false
      }
    }
  },
  start() {
    this.drawTimer = setInterval(() => {
      this.draw()
    }, 500)
  },
  stop(){
    clearInterval(this.drawTimer)
  },
  _fill(color, x, y) {
    lib._fill(this.ctx, color, x, y, this.innerWidth, this.innerHeight)
  },
    /**
   * Any live cell with fewer than two live neighbors dies, as if by under population.
   * Any live cell with two or three live neighbors lives on to the next generation.
   * Any live cell with more than three live neighbors dies, as if by overpopulation.
   * Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.

   */
  check(x,y){
    //check 8 neightbors
    let count = 0
    if (x> 0 && y > 0 && this.lastMap[x-1][y-1])//left top
      count++
    if (y > 0 && this.lastMap[x][y-1])//top
      count++
    if (y > 0 && x < this.xSize-1 && this.lastMap[x+1][y-1])//right top
      count++
    if (x > 0 && y < this.ySize-1 && this.lastMap[x-1][y+1])//left nottom
      count++
    if (y < this.ySize-1 && this.lastMap[x][y+1])//bottom
      count++
    if (y < this.ySize-1 &&  x < this.xSize-1 && this.lastMap[x+1][y+1])//right bottom
      count++
    if (x > 0 && this.lastMap[x-1][y])//left
      count++
    if (x < this.xSize-1 && this.lastMap[x+1][y])//right
      count++
    return count
  },
}
export default GOLObject
