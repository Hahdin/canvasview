import React, { Component } from 'react'
import { forestObject } from '../objects'
const _forestObject = () =>{
  return Object.assign(Object.create(forestObject), { })
}
class TheForrest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null
    }
  }

  componentDidMount() {
    let myForrest = _forestObject()
    myForrest.initCanvas()
    myForrest._fill('rgba(0,0,0, 1)', 0, 0)
    myForrest.start()
    this.state.canvas = myForrest
  }
  componentWillUnmount(){
    console.log('unmount')
    this.state.canvas.cleanup()
    this.state.canvas.stop()
  }
  render() {
    return (<div />)
  }
}
export default TheForrest