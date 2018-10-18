import React, { Component } from 'react'
import { kinematicsObject } from '../objects'
class Kinematics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null
    }
  }

  componentDidMount() {
    let _kinCanvas = kinematicsObject.create()
    _kinCanvas.initCanvas()
    _kinCanvas._fill('rgba(0,0,0, 1)', 0, 0)
    _kinCanvas.start()
    this.state.canvas = _kinCanvas
  }
  componentWillUnmount(){
    console.log('unmount LogCanvas')
    this.state.canvas.cleanup()
    this.state.canvas.stop()
  }

  render() {
    return (<div />)
  }
}
export default Kinematics