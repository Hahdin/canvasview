
const dat = require('dat.gui');
import {lib} from '../helpers/'
import parentObject from './parentObject'
const searchBot = {
  position: {
    x: 0, 
    y: 0,
  },
  vector:{
    x: 0,
    y: 0,
  },
  path: [],
  searchParams:{},

  //utils
  getVector(from, to){
    let diffX = to.x - from.x
    let diffY = to.y - from.y
    let mag = Math.abs(Math.sqrt((diffX ** 2) + (diffY ** 2)))
    let normalized = {
      x: diffX / mag,
      y: diffY / mag,
    }
    return normalized

  },
  getDistance(posA, posB){
    return Math.abs(Math.sqrt(((posA.x - posB.x) ** 2) + ((posA.y - posB.y) ** 2)))
  },
}