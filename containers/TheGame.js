import React, { Component } from 'react'
import { GOLObject } from '../objects'
class TheGame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null
    }
  }
  componentDidMount() {
    let myGOL = GOLObject.create()
    myGOL.initCanvas()
    myGOL.start()
    this.state.canvas = myGOL
  }
  componentWillUnmount(){
    this.state.canvas.cleanup()
    this.state.canvas.stop()
  }
  render() {
    return (<div />)
  }
}
export default TheGame