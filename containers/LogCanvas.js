import React, { Component } from 'react'
import { explosionObject } from '../objects'
const _explosionObject = () =>{
  return Object.assign(Object.create(explosionObject), { })
}
class LogCanvas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      curves: props.curves,
      explosion: null
    }
  }

  componentDidMount() {
    let myExplosion = _explosionObject()
    myExplosion.initCanvas()
    myExplosion._fill('rgba(0,0,0, 1)', 0, 0)
    myExplosion.start()
    this.state.explosion = myExplosion
  }
  componentWillUnmount(){
    this.state.explosion.cleanup()
    this.state.explosion.stop()
  }

  render() {
    return (<div />)
  }
}
export default LogCanvas