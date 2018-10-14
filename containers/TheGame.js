import React, { Component } from 'react'
import GOL from '../classes/GOL'
class TheGame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null
    }
  }
  componentDidMount() {
    let myGOL = new GOL()
    //myGOL._fill('rgba(255,255,255, 1)', 0, 0)
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