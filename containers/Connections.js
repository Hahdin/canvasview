import React, { Component } from 'react'
//import Connect from '../classes/connect'
import { flockObject } from '../objects'
const _flockObject = () =>{
  return Object.assign(Object.create(flockObject), { })
}

class Connections extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null
    }
  }

  componentDidMount() {
    //let canvas = new Connect()
    let canvas = _flockObject()
    canvas.initCanvas()
    canvas._fill('rgba(0,0,0, 1)', 0, 0)
    canvas.start()
    this.state.canvas = canvas
  }
  componentWillUnmount(){
    console.log('unmount')
    this.state.canvas.cleanup()
    this.state.canvas.stop()
  }
  render() {
    return (<div className='container ' />)
  }
}
export default Connections