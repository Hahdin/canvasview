import React, { Component } from 'react'
import { MathObject } from '../objects'

class MathArt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null
    }
  }
  componentDidMount() {
    let canvas = MathObject.create()
    canvas.initCanvas()
    canvas._fill('rgba(0,0,0, 1)', 0, 0)
    canvas.start()
    this.state.canvas = canvas
  }
  componentWillUnmount(){
    this.state.canvas.cleanup() 
    this.state.canvas.stop()
  }
  render() {
    return (<div className='container ' />)
  }
}
export default MathArt