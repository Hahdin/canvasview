const dat = require('dat.gui');
import {lib} from '../helpers/'
const parentObject ={
  ctx: null,
  innerHeight: 0,
  innerWidth: 0,
  create({...args}) {
    return Object.assign(Object.create(this), {...args })
  },
  fade() {
    console.log('parent fade')
    lib.cvFade(this.ctx, 'rgba(0,0,0, 0.1)', this.innerWidth, this.innerHeight)
  },
 
}
export default parentObject