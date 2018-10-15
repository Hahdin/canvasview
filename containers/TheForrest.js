import React, { Component } from 'react'
import forrest from '../classes/forrest'
class TheForrest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null
    }
  }

  componentDidMount() {
    let myForrest = new forrest()
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