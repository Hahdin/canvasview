const dat = require('dat.gui');
import {lib} from '../helpers/'
import parentObject from './parentObject'
import searchBot from './searchBot'
export const searchBots = {
  size: 0,
  swarm: [],
  findThis: {},
  initData() {
    let size = 100
    this.findThis = {
      x: Math.random() * this.innerWidth,
      y: Math.random() * this.innerWidth,
      temp: 20,
    }

    while(size--){
      let bot = searchBot.create({
        position: {
          x: this.innerWidth / 2, 
          y: this.innerHeight / 2,
        },
        vector:{
          x: -.5 + Math.random(),
          y: -.5 + Math.random(),
        },
        innerWidth: this.innerWidth,
        innerHeight: this.innerHeight,
        color: `rgb(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)})`,
        })
      this.swarm.push(bot)
      bot.setSearchParams({
        temp: 20,
        searchList: [{x: this.findThis.x, y: this.findThis.y}],
      })
      bot.go()
    }
  },
  draw(){
    //place the object in a random location
    this.ctx.fillStyle = 'red'
    lib.drawSphere(this.ctx, {x: this.findThis.x, y: this.findThis.y}, 30)
    this.swarm.forEach(swarmbot =>{
      this.ctx.fillStyle = swarmbot.color
      lib.drawSphere(this.ctx, swarmbot.position, 2)
    })
  },
  //utils
  create() {
    return Object.assign({},parentObject, this)
  },
  start() {
    this.drawTimer = setInterval(() => {
      this.draw()
    }, 60)
    this.fadeTimer = setInterval(() => {
      this.fade()
    }, 120)
  },



}
export default searchBots
