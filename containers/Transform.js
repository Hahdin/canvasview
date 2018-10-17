import React, { Component } from 'react'
import { transformObject } from '../objects'
const _transformObject = () =>{
  return Object.assign(Object.create(transformObject), { })
}

class Transform extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null
    }
  }

  componentDidMount() {
    let _t = _transformObject()
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