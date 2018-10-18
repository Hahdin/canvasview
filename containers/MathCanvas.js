import React, { Component } from 'react'
import { volcanoObject } from '../objects'
class MathCanvas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      volcano: null
    }
  }

  componentDidMount() {
    let myVolcano = volcanoObject.create()
    
    myVolcano.initCanvas()
    myVolcano._fill('rgba(0,0,0, 1)', 0, 0)
    myVolcano.start()
    this.state.volcano = myVolcano
  }
  componentWillUnmount(){
    console.log('unmount LogCanvas')
    this.state.volcano.cleanup()
    this.state.volcano.stop()
  }
  render() {
    return (<div />)
  }
}
export default MathCanvas