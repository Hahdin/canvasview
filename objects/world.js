import { lib } from '../helpers/'
import parentObject from './parentObject'
import searchBot from './searchBot'
export const WorldObject = {
  //need some random objects to navigate around.
  //how about circles?
  circles: [],
  //myBot: null,
  myBots:[],
  //path: [],
  pathGroup: {
    paths: [],
    ids: [],
  },
  indexOfShortestPath: -1,
  optimizedPath: null,
  create() {
    return Object.assign({}, parentObject, this)
  },
  initData() {
    let count = 1500
    while (count--) {
      let circ ={
        x: Math.random() * this.innerWidth,
        y: Math.random() * this.innerHeight,
        rad: 5 + Math.random() * 10,
        temp: 5 + Math.random() * 10,
        color: 'red',
        id: `${count}`,
      }
      if (!this.hitCircle({x: circ.x, y: circ.y}, circ.rad+2)){
        this.circles.push(circ)
      } else{
        count++
      }
    }
    //this.myBot = bot.create(this.innerWidth, this.innerHeight, this.circles)
    let homePos = {
      x: Math.random() * this.innerWidth,
      y: Math.random() * this.innerHeight,
    }


    this.circles.push({
      x: homePos.x,
      y: homePos.y,
      rad: 10,
      temp: 5 + Math.random() * 10,
      color: 'yellow',
      id: `home`,
    })
    this.circles.push({
      x: Math.random() * this.innerWidth,
      y: Math.random() * this.innerHeight,
      rad: 10,
      temp: 25,
      color: 'hotpink',
      id: `new`,
    })
    count = 100
    while(count--){
      this.myBots.push(searchBot.create(this.innerWidth, this.innerHeight, this.circles, homePos, count))
    }
  },
  start() {
    this.drawTimer = setInterval(() => {
      this.draw()
    }, 60)
    this.fadeTimer = setInterval(() => {
      this.fade()
    }, 120)
  },
  fade() {
    lib.cvFade(this.ctx, 'rgba(0,0,0, 0.05)', this.innerWidth, this.innerHeight)
  },
  hitCircle(pos, added = 0){
    for(let i = 0; i < this.circles.length; i++){
      if (lib.getDistance({x:pos.x, y: pos.y}, { x: this.circles[i].x, y: this.circles[i].y }) < this.circles[i].rad + added ){
        return true
      }
    }
    return false
},
  optimizePath(path) {
    if (path.length <= 0) return
    let newPath = []
    //have path to new home. Make it better
    let first = path[0]
    newPath.push({...first})
    let last = path[path.length - 1]
    let prev = null
    path.forEach(pos => {//straight line to each pos, see how far we can get before we need to turn (LOS)

      let v = lib.getVector(first, pos)
      
      if (v.x === 0 && v.y === 0) return
      
      let x = first.x
      let y = first.y

      let clear = true
      let sanity = 1000
      let distToPos = 2
      let lastHit = null
      let lastGood = null
      //while((parseInt(x * 10) !== parseInt(pos.x * 10) && parseInt(y * 10) !== parseInt(pos.y * 10)) || sanity-- || clear){
      while(distToPos > 1 && sanity && clear){
        sanity--
        x += v.x
        y += v.y
        distToPos = lib.getDistance({x:x, y: y}, { x: pos.x, y: pos.y })
        if (this.hitCircle({x:x, y:y})){
          lastHit = {x:x, y: y}
          //clear = false
        } else{
          lastGood = {x:x, y: y}
          lastHit = null
        }
        // this.circles.forEach(circle => {
          
        //   if (lib.getDistance({x:x, y: y}, { x: circle.x, y: circle.y }) < circle.rad ){
        //     clear = false
        //   }
        // })
      }

      if (!lastHit && lastGood){
      //if (clear){
        //prev = pos//move ahead
        prev = lastGood//move ahead
        return
      }else{
        //newPath.push({...pos})//clear to here
        newPath.push({...lastHit})//clear to here
        //first = pos//update start
        //prev = pos
        first = lastHit//update start
        prev = lastHit
      }
    })
    //(newPath[newPath.length - 1].x === last.x && newPath[newPath.length - 1].y === last.y) ? null : newPath.push(last)
    if (newPath[newPath.length - 1].x !== last.x){
      newPath.push(last)
    }
    return newPath
  },

  getShortestPath() {

    if (!this.pathGroup.paths) return
    let curIndex = this.indexOfShortestPath

    this.indexOfShortestPath = -1
    let size = null
    this.pathGroup.paths.forEach((_path, i) => {

      // this.optimizePath(_path)
      if (size) {
        if (_path.length < size) {
          size = _path.length
          this.indexOfShortestPath = i
        }
      } else {
        size = _path.length
        this.indexOfShortestPath = i
      }
    })
    if (curIndex !== this.indexOfShortestPath){
      //shortext path changed
      let sp = this.indexOfShortestPath > -1 ? this.pathGroup.paths[this.indexOfShortestPath] : null
      if (sp){
        //let op = this.optimizePath(sp)
       // this.optimizedPath = [...op]
        this.optimizedPath = [...sp]
        //this.pathGroup.paths[this.indexOfShortestPath] = [...op]
        //this.m
        //this.drawPath(op, 'purple', 2 )
      }
    }

    // let lastMag = null
    // this.pathGroup.paths.forEach((_path,i) =>{
    //   let path = []
    //   _path.forEach(pos=>{
    //     path.push({...pos})
    //   })
    //   //let path = [..._path]
    //   let ret = path.reduce((total, pos, j, ar) =>{
    //     let org = {
    //       x : Math.abs(ar[0].x),
    //       y : Math.abs(ar[0].y)
    //     }
    //     let cur = {
    //       x : Math.abs(pos.x) - org.x,
    //       y : Math.abs(pos.y) - org.y
    //     }
    //     total.x += cur.x
    //     total.y += cur.y
    //     return total
    //   })
    //   if (lastMag){
    //     let mag = Math.abs(Math.sqrt((ret.x ** 2) + (ret.y ** 2)))
    //     if (mag < lastMag){
    //       this.indexOfShortestPath = i
    //       lastMag = mag
    //     }
    //   } else{
    //     lastMag = Math.abs(Math.sqrt((ret.x ** 2) + (ret.y ** 2)))
    //     this.indexOfShortestPath = i
    //   }
    // })
    // if (indexOfShortestPath >= 0)
    //   console.log(indexOfShortestPath)
    //return this.indexOfShortestPath > -1 ? this.pathGroup.paths[this.indexOfShortestPath] : null
  },
  draw() {
    this.circles.forEach(circle => {
      this.ctx.fillStyle = circle.color
      lib.drawSphere(this.ctx, { x: circle.x, y: circle.y }, circle.rad)
    })
    //this.pathGroup.paths.forEach(p => this.drawPath(p, 'white', .1))
    let sp = this.indexOfShortestPath > -1 ? this.pathGroup.paths[this.indexOfShortestPath] : null
    if (sp){
      this.drawPath(sp, 'Chartreuse', 3)
      //if (this.optimizedPath) this.drawPath(this.optimizedPath, 'Magenta', 2)
      // let op = this.optimizePath(sp)
      // this.drawPath(op, 'purple', 2 )
    }
    this.myBots.forEach(bot=>{
      bot.updatePos()
      // if (bot.action ==='resting' && bot.path.length > 1 && this.path.length == 0){
      //   let newAr = []
      //   bot.path.forEach(pos => newAr.push({...pos}))
      //   this.path = [...newAr]
      //   // this.getShortestPath()//sets index
      // }
      if (bot.action ==='resting' && bot.path.length > 1){
        if (this.pathGroup.paths.length < 50 && !this.pathGroup.ids.includes(bot.id) && !bot.didFollow){
          let newAr = []
          bot.path.forEach(pos => newAr.push({...pos}))
          //let op = this.optimizePath(newAr)
          //let sec = this.optimizePath(op)
          this.pathGroup.paths.push([...newAr])
          this.pathGroup.ids.push(bot.id)
          this.getShortestPath()//sets index
        }
      }
      //let shortestPath = this.getShortestPath()
      let shortestPath = this.indexOfShortestPath > -1 ? this.pathGroup.paths[this.indexOfShortestPath] : null
      if (shortestPath && (bot.path.length === 0 || bot.path.length !== shortestPath.length ) && shortestPath.length > 1){
        //assign path to bot, so it can detect if it crosses it
        let newAr = []
        shortestPath.forEach(pos => newAr.push({...pos}))
        if (bot.action ==='search' )
          bot.path = [...newAr]
      }
      if (bot.action ==='resting') return
      //groups






      this.ctx.fillStyle = bot.color
      lib.drawSphere(this.ctx, bot.pos, bot.action ==='follow' ? 5 : 2)
    })

  },
  drawPath(path, color, lineSize = 0.1){
    let lastpos = null
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = lineSize
    path.forEach(pos =>{
      if (!lastpos){
        lastpos = pos
        return
      }
      lib.lineTo(this.ctx, lastpos.x, lastpos.y, pos.x, pos.y)
      lastpos = pos
    })
  }
}

export default WorldObject