import React, { Component } from 'react'
import { explosionObject, explosionChild, parentObject } from '../objects'
class LogCanvas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      curves: props.curves,
      explosion: null
    }
  }
  componentDidMount() {
    //let myExplosion = explosionObject.create()
    //let p = Object.create(parentObject)
    //let c = explosionChild.create()
    let myExplosion = explosionChild.create()

    //c.initCanvas = null
    //let myExplosion = Object.assign(c, parentObject)
    myExplosion.initCanvas()
    myExplosion._fill('rgba(0,0,0, 1)', 0, 0)
    myExplosion.fade()
    myExplosion.start()
    this.state.explosion = myExplosion
  }
  componentWillUnmount(){
    this.state.explosion.cleanup()
    this.state.explosion.stop()
  }

  render() {
    return (<div />)
  }
}
export default LogCanvas