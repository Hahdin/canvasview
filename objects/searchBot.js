
//const dat = require('dat.gui');
import {lib} from '../helpers/'
export const searchBot = {
  pos: {
    x: 0,
    y: 0,
  },
  myLastPos: {
    x: 0,
    y: 0,
  },
  vector: {
    x: 0,
    y: 0,
  },
  home:{
    x: 0,
    y: 0,
  },
  newHome:{
    x: 0,
    y: 0,
  },
  id: 0,
  goHomeTimer: null,
  pathIndex: -1,
  average: [],
  action: 'search',
  color: 'red',
  redirectCount: -1,//if heading to a specific location, when redirected, travel a bit first then return to heading
  didFollow: false,
  environment: {
    circles: [],
    width: 0,
    height: 0,
  },
  move(){
    let inc = 5
    let x = this.pos.x + (this.vector.x * inc)
    let y = this.pos.y + (this.vector.y * inc)
    if (x < 5 || x > this.environment.width - 5) {
      this.vector.x *= -1 //reverse
      x = this.pos.x + (this.vector.x * inc)
    }
    if (y < 5 || y > this.environment.height - 5) {
      this.vector.y *= -1//reverse
      y = this.pos.y + (this.vector.y * inc)
    }
    this.myLastPos.x = this.pos.x
    this.myLastPos.y = this.pos.y
    this.pos.x = x
    this.pos.y = y
    if (this.average.length >= 10)
      this.average.pop()
    this.average.push({x: x, y: y})
  },
  goHome(){
    console.log('gohome')
    if (this.action === 'search')
      this.action = 'gohome'
  },
  setOptimizedPath(path){

  },

  updatePos() {
    if (this.action === 'resting') return
    let inc = 5
    //is there an object there?
    let isRedirected = false
    this.environment.circles.forEach(circle => {
      let dist = lib.getDistance(this.pos, { x: circle.x, y: circle.y })
      if (dist < circle.rad + 3) {
        let vecToCircle = lib.getVector(this.pos, { x: circle.x, y: circle.y })
        let addedVectors = lib.normalizeVector({
          x: this.vector.x + -vecToCircle.x,
          y: this.vector.y + -vecToCircle.y,
        })
        this.vector.x = (addedVectors.x )
        this.vector.y = (addedVectors.y ) 
        isRedirected = true
        //check it
        if (circle.rad === 10 && circle.temp === 25 && this.action === 'search'){
            //home!!!
          circle.color = 'blue'
          this.action = 'return'
          this.newHome = {x: circle.x, y: circle.y}
          this.vector = lib.getVector(this.pos, this.home)
          this.goHomeTimer ? clearInterval(this.goHomeTimer) : null
          console.log(`found a home `)
        }
      }
    })
    if (this.action === 'pathfinder' || this.action=== 'return' || this.action === 'gohome' ){
      if (isRedirected){
        if (this.redirectCount > 0){//second redirect?
          this.redirectCount = -1
          this.vector = this.action === 'pathfinder' ?  
          lib.getVector(this.pos, this.newHome) 
          : lib.getVector(this.pos, this.home)
        } else{
          this.redirectCount ++
        }
      } else{
        if (this.redirectCount > 3){//send to location
          this.redirectCount = -1
          this.vector = this.action === 'pathfinder' ?  
          lib.getVector(this.pos, this.newHome) 
          : lib.getVector(this.pos, this.home)
        }else{
          this.redirectCount ++
        }
      }
    }
    if (this.action === 'pathfinder'){
      this.move()
      this.path.push({...this.pos})
      if (lib.getDistance(this.pos, this.newHome) < 20){
        //record path back to new site
        this.vector.x = 0,
        this.vector.y = 0
        this.action = 'resting'
        this.goHomeTimer ? clearInterval(this.goHomeTimer) : null
      }
    }
    if (this.action !== 'search'){
      if (this.action === 'return' || this.action === 'gohome'){
        //this.move()
        if (lib.getDistance(this.pos, this.home) < 20){
          //record path back to new site
          if (this.action === 'return'){
            this.vector = lib.getVector(this.pos, this.newHome)
            this.path = []//clear
            this.path.push({...this.pos})
            this.action =  'pathfinder'
          }
          else{//check if a new home has been found?
            this.action = 'search'

            if (this.path.length > 1){
              this.newHome = {...this.path[this.path.length - 1]}
              this.vector = lib.getVector(this.pos, this.newHome)
              this.path = []//clear
              this.path.push({...this.pos})
              this.action =  'pathfinder'
            } else{
              this.action = 'search'
            }
          }
        }
      }
      if (this.action === 'follow'){
        this.pos = this.path[this.pathIndex] ? this.path[this.pathIndex++] : this.path[this.path.length -1]
        if (!this.path[this.pathIndex]) this.action = 'resting'
        this.goHomeTimer ? clearInterval(this.goHomeTimer) : null
      }
      if (this.action !== 'gohome' ){
        if (this.action !== 'pathfinder')
          this.move()
        return
      }
    }
    if (this.action === 'search' && this.goHomeTimer === null){
      this.goHomeTimer = setInterval(() =>{
        this.goHome()
      }, 180000 + Math.random() * 180000)
    }
    if (this.path.length > 0){
      let intersect = false
      let lastpos = null
      let intersectPos = null
      let intersectIndex = -1
      let intersectVector = null


      // this.path.forEach((pos, i) =>{
      //   if (intersect) return
      //   if (!lastpos){
      //     lastpos = pos
      //     return
      //   }
      //   if (lib.intersects(
      //     lastpos.x, lastpos.y,pos.x, pos.y,this.pos.x, this.pos.y, this.myLastPos.x, this.myLastPos.y)){
      //     intersect = true
      //     intersectPos = pos
      //     intersectIndex = i
      //     intersectVector = lib.getVector(lastpos, pos)
      //   }
      //   lastpos = pos
      // })

      for(let i = 0; i < this.path.length; i++){
        let pos = this.path[i]
        if (intersect) break
        if (!lastpos){
          lastpos = pos
          continue
        }
        if (lib.intersects(
          lastpos.x, lastpos.y,pos.x, pos.y,this.pos.x, this.pos.y, this.myLastPos.x, this.myLastPos.y)){
          intersect = true
          intersectPos = pos
          intersectIndex = i
          intersectVector = lib.getVector(lastpos, pos)
        }
        lastpos = pos
      }
      if (intersect){
        //console.log('we intersected the path')
        this.action = 'follow'
        this.didFollow = true
        this.goHomeTimer ? clearInterval(this.goHomeTimer) : null
        this.pos = {...intersectPos}
        this.vector = {...intersectVector}
        this.pathIndex = intersectIndex
      }
    }
    this.move()
  },
  create(W, H, circles, pos, id) {
    return {...this, 
      pos: {
        x: pos.x,
        y: pos.y,
      },
      vector: {
        x: -1 + (Math.random() * 2),
        y: -1 + (Math.random() * 2),
      },
      environment: {
        circles: circles,
        width: W,
        height: H,
      },
      myLastPos:{
        x:0,
        y:0,
      },
      path: [],
      pathIndex: -1,
      home: pos,
      average:[],
      id: id,
      color: `rgb(${Math.round(Math.random() * 255)},  
      ${Math.round(Math.random() * 255)},  
      ${Math.round(Math.random() * 255)})`,
    }
  },
}
export default searchBot
