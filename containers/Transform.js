import React, { Component } from 'react'
import transforms from '../classes/transforms'
class Transform extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null
    }
  }

  componentDidMount() {
    let _t = new transforms()
    _t.initCanvas()
    _t._fill('rgba(0,0,0, 1)', 0, 0)
    _t.start()
    this.state.canvas = _t
  }
  componentWillUnmount(){
    console.log('unmount transform')
    this.state.canvas.cleanup()
    this.state.canvas.stop()
  }

  render() {
    return (<div />)
  }
}
export default Transform