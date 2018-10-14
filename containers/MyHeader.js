import Header from '../components/Header'
import React, { Component } from 'react'
class MyHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  } 

  componentDidMount() {
  }

  render() {
    return (<Header text={this.state.text} />)
  }
}
export default MyHeader