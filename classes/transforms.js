const dat = require('dat.gui');
import lib from './lib'
let cc = 0

class Transform {
  constructor(props) {
    this.state = {
      innerWidth: 0,
      innerHeight: 0,
      ctx: null,
      canvas: null,
      gui: null,//new dat.GUI({ width: 310 }),
      drawTimer: null,
      fadeTimer: null,
      redraw: false,
      rules: [{

      //  index: 0,
        a: .85,//# of leaves
        b: 0.04,//tilt right
        c: -0.04,//curve to right
        d: 0.85,//height? lower to squash
        tx: 0,//x offset
        ty: 1.6,//expand / grow
        weight: 0.85,
        color:  `rgba(${cc},255,${cc}, 1)`,
        getColor: ()=> `rgba(${cc},${Math.random() * 255},${cc},1)`
      },
      {//right 
      //  index: 1,
        a: -0.15,
        b: 0.28,
        c: 0.26,
        d: 0.24,
        tx: 0,
        ty: 0.44,
        weight: 0.07,
        color:  `rgba(255,${cc},${cc}, 1)`,
        getColor: ()=> `rgba(${Math.random() * 255}, ${cc},${cc}, 1)`
      },
      {//left 
       // index: 2,
        a: 0.2,
        b: -0.26,
        c: 0.23,
        d: 0.22,
        tx: 0,
        ty: 1.6,
        weight: 0.07,
        color: `rgba(${cc},${cc},255, 1)`,
        getColor: ()=> `rgba(${Math.random() * 255},${cc},${Math.random() * 255}, 1)`
      },
      {
       // index: 3,
        a: 0,
        b: 0,
        c: 0,
        d: 0.16,
        tx: 0,
        ty: 0,
        weight: 0.1,
        color:  `rgba(255,255,${cc}, 1)`,
        getColor: ()=> `rgba(${Math.random() * 255},${Math.random() * 255},${cc}, 1)`
      },
      // {
      //   //index: 4,
      //   a: 0.5,
      //   b: 0.4,
      //   c: 0.3,
      //   d: 0.16,
      //   tx: 0.45,
      //   ty: 0.33,
      //   weight: 0.45,
      //   color:  `rgba(255,${cc},255, 1)`,
      //   getColor: ()=> `rgba(${Math.random() * 255},${cc},${Math.random() * 255}, 1)`
      // }

          
      //   {
      //   a: -0.5,
      //   b: 0.931,//tilt right
      //   c: -0.7144,//curve to right
      //   d: 0.21,//height? lower to squash
      //   tx: 0.151,//x offset
      //   ty: 0.233,//expand / grow
      //   weight: 0.53,
      //   color: 'yellow'
      // },
      // {
      //   a: 0.21,
      //   b: -0.521,//tilt right
      //   c: 0.87,//curve to right
      //   d: 0.341,//height? lower to squash
      //   tx: 0.111,//x offset
      //   ty: 0.1372,//expand / grow
      //   weight: 0.23,
      //   color: 'green'
      // },
      // {
      //   a: 0.0,
      //   b: -0.0,//tilt right
      //   c: 1.0,//curve to right
      //   d: 0.22220,//height? lower to squash
      //   tx: .01,//x offset
      //   ty: .03,//expand / grow
      //   weight: 0.04,
      //   color: 'blue'
      // },
      // {
      //   a: 0.21,
      //   b: -0.99,//tilt right
      //   c: 0.5,//curve to right
      //   d: 0.241,//height? lower to squash
      //   tx: .7211,//x offset
      //   ty: 0.72372,//expand / grow
      //   weight: 0.2,
      //   color: 'red'
      // },
      ]
    }
  }

  // updateWeight(index, newValue) {
  //   //must equal 1
  //   let dif = (newValue - this.state.rules[index].weight) / this.state.rules.length
  //   let totalDiff = newValue - this.state.rules[index].weight
  //   //adjust the others

  //   let Tindex = -1, w = 0, gt = '>', lt = '<'
  //   let f = `rule.weight ${totalDiff < 0 ? lt : gt} w`
  //   while (totalDiff !== 0){
  //     //adjust largest if +
  //     this.state.rules.forEach((rule, i) =>{
  //       if (i === index) return
  //       if (eval(f) ){
  //         Tindex = i
  //       } 
  //     })
  //     if (Tindex >= 0){
  //       this.state.rules[Tindex].weight -= totalDiff
  //       totalDiff = 0
  //       if (this.state.rules[Tindex].weight < 0){
  //         totalDiff = 0 - this.state.rules[Tindex].weight
  //         this.state.rules[Tindex].weight = 0
  //       }
  //       if (this.state.rules[Tindex].weight > 1){
  //         totalDiff = this.state.rules[Tindex].weight - 1
  //         this.state.rules[Tindex].weight = 1
  //       } 
  //     }
  //   }





  //   this.state.rules[index].weight = newValue
  //   // this.state.rules.forEach((rule, i) =>{
  //   //   if (i !== index){
  //   //     let n = rule.weight - dif
  //   //     console.log(`new rule weight for index ${i} - ${n}`)
  //   //     rule.weight -= dif
  //   //   }
  //   // })
  // }

  cleanup(){
    this.state.gui.destroy()
  }
  initCanvas() {

    this.state.canvas = document.getElementById("canvas")
    this.state.innerHeight = this.state.canvas.innerHeight = this.state.canvas.height = window.innerHeight * 0.9
    this.state.innerWidth = this.state.canvas.innerWidth = this.state.canvas.width = window.innerWidth * 0.9
    this.state.ctx = this.state.canvas.getContext("2d")
    this.state.gui = new dat.GUI({ width: 310 })
    this.state.ctx.translate(this.state.innerWidth / 2,this.state.innerHeight)

    this.addGui()
    //this.initData()
  }
  _fill(color, x, y) {
    this.state.ctx.fillStyle = color
    this.state.ctx.fillRect(x -this.state.innerWidth / 2,  y-this.state.innerHeight , this.state.innerWidth, this.state.innerHeight)
  }
  addGui() {
    let controller = {}
    this.state.rules.forEach((rule, i) => {
      let folder = this.state.gui.addFolder(`Transform ${i}`)
      controller.a = rule.a
      controller.b = rule.b
      controller.c = rule.c
      controller.d = rule.d
      controller.tx = rule.tx
      controller.ty = rule.ty
      //controller.weight = rule.weight
      folder.add(controller, 'a', -1, 1).step(0.001).name('T a').onChange((value) => {
        if (rule.a === value) return
        rule.a = value
        this.state.redraw = true
      })
      folder.add(controller, 'b', -1, 1).step(0.001).name('T b').onChange((value) => {
        if (rule.b === value) return
        rule.b = value
        this.state.redraw = true
      })
      folder.add(controller, 'c', -1, 1).step(0.001).name('T c').onChange((value) => {
        if (rule.c === value) return
        rule.c = value
        this.state.redraw = true
      })
      folder.add(controller, 'd', -1, 1).step(0.001).name('T d').onChange((value) => {
        if (rule.d === value) return
        rule.d = value
        this.state.redraw = true
      })
      folder.add(controller, 'tx', -5, 5).step(0.001).name('tx').onChange((value) => {
        if (rule.tx === value) return
        rule.tx = value
        this.state.redraw = true
      })
      folder.add(controller, 'ty', -5,5).step(0.001).name('ty').onChange((value) => {
        if (rule.ty === value) return
        rule.ty = value
        this.state.redraw = true
      })
      // folder.add(controller, 'weight', 0,1).step(0.0001).name('weight').onChange((value) => {
      //   if (rule.weight === value) return
      //   this.updateWeight(i, value)
      //   this.state.redraw = true
      // })
    })
  }
  fade() {
    lib.cvFade(this.state.ctx,'rgba(0,0,0, 0.1)',this.state.innerWidth, this.state.innerHeight)
  }
  stop(){
    clearInterval(this.state.fadeTimer)
    clearInterval(this.state.drawTimer)
  }
  start() {

    this.state.drawTimer = setInterval(() => {
     // let p = this.createProjectile()
      //this.state.projectiles.push(p)
      this.draw()

    }, 200)
  }
  draw(){
    this.iterate()

  }

  getRule() {
    let rand = Math.random()
    for (let i = 0; i < this.state.rules.length; i++) {
      let rule = this.state.rules[i]
      if (rand < rule.weight)
        return rule
      rand -= rule.weight
    }
  }
  plot(x, y, color) {
    //ctx.strokeStyle = ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 75},${Math.random()})`
    this.state.ctx.fillStyle = this.state.ctx.strokeStyle = color
    let ln = .005
    let angle = Math.random() * Math.PI * 2

    let x1 = (x + Math.cos(angle) * ln) * 50
    let y1 = (-y + Math.sin(angle) * ln) * 50

    // ctx.beginPath()
    // ctx.lineWidth = 5
    // ctx.moveTo(x * 50, -y * 50)
    // ctx.lineTo(x1, y1)
    // ctx.stroke()
    this.state.ctx.fillRect(x * 50, -y * 50, 0.5, 0.5)
  }
  iterate() {
    if (this.state.redraw) {
      this.state.redraw = false
      //this.state.ctx.translate(this.state.innerWidth / 2,this.state.innerHeight)
      //this._fill('white', 0,0) 
      //this._fill('rgba(0,0,0, 1)',-this.state.innerWidth / 2, -this.state.innerHeight)
      this._fill('rgba(0,0,0, 1)',0,0)
    }
    let count = 1000
    let x = Math.random(),// * this.state.innerWidth / 2,
    y = Math.random()//* this.state.innerHeight / 2
    while (count--) {
      let rule = this.getRule(),
        x1 = x * rule.a + y * rule.b + rule.tx,
        y1 = x * rule.c + y * rule.d + rule.ty

        x = x1
        y = y1
        let color = rule.getColor()
        this.plot(x, y, color)
    }
  }

}

export default Transform

