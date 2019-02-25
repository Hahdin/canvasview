import React, { Component } from 'react'
import {  navier } from '../objects'
export class Turb extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null
    }
  }
  componentDidMount() {
    //let canvas = turb.create()// yours
    let canvas = navier.create()// this works, sorta..
    //let canvas = vectorField.create()// yours
    canvas.initCanvas()
    canvas._fill('rgba(0,0,0, 1)', 0, 0)
    canvas.start()
    this.state.canvas = canvas
  }
  componentWillUnmount(){
    console.log('unmount')
    this.state.canvas.cleanup()
    this.state.canvas.stop()
    this.state.canvas = null
  }
  render() {
    return (<div className='container ' />)
  }
}
