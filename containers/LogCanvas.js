import React, { Component } from 'react'
//import logCanvas from '../classes/logCanvas'
import Explosion from '../classes/explosion'
//let _myLogCanvas = new logCanvas()
//let myExplosion = new Explosion()
class LogCanvas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      curves: props.curves,
      explosion: null
    }
  }

  componentDidMount() {
    //_myLogCanvas.initLog(this.state.curves)
    let myExplosion = new Explosion()
    myExplosion.initCanvas()
    myExplosion._fill('rgba(0,0,0, 1)', 0, 0)
    myExplosion.start()
    this.state.explosion = myExplosion
  }
  componentWillUnmount(){
    console.log('unmount LogCanvas')
    this.state.explosion.cleanup()
    this.state.explosion.stop()
  }

  render() {
    return (<div />)
  }
}
export default LogCanvas