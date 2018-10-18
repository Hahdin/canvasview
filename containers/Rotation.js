import React, { Component } from 'react'
import { rotationObject } from '../objects'
class Rotate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null
    }
  }

  componentDidMount() {
    let rot = rotationObject.create()
    rot.initCanvas()
    rot._fill('rgba(0,0,0, 1)', 0, 0)
    rot.start()
    this.state.canvas = rot
  }
  componentWillUnmount(){
    console.log('unmount Rotation')
    this.state.canvas.cleanup()
    this.state.canvas.stop()
  }
  render() {
    return (<div />)
  }
}
export default Rotate