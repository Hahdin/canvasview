import React, { Component } from 'react'
import {MathCanvas} from '../containers/MathCanvas'
import {LogCanvas} from '../containers/LogCanvas'
import {Kinematics} from '../containers/Kinematics'
import {Transform} from '../containers/Transform'
import {Rotate} from '../containers/Rotation'
import {TheForrest} from '../containers/TheForrest'
import {TheGame} from '../containers/TheGame'
import {Connections} from '../containers/Connections'
import {MathArt} from '../containers/Mathart'
import { Route, Router } from "react-router-dom";
import { history } from '../helpers'
import { MyNavBar } from '../components/MyNavBar';
import { HomePage } from '../components/HomePage';
import { World } from '../containers/World';
import { Ripple } from '../containers/Ripple';
import { Turb } from '../containers/Turb';
export const App = ({ ...props }) => {
  const { path } = props.match;
  return (
    <div className='container-fluid'>
      <div className="col-md-12">
        <Router history={history}>
          <div>
            <MyNavBar />
            <Route exact path="/" component={HomePage} />
            <Route path={`${path}explosion`} exact component={LogCanvas} />
            <Route path={`${path}math`} component={MathCanvas} />
            <Route path={`${path}kinematics`} component={Kinematics} />
            <Route path={`${path}transform`} component={Transform} />
            <Route path={`${path}rotation`} component={Rotate} />
            <Route path={`${path}forrest`} component={TheForrest} />
            <Route path={`${path}game`} component={TheGame} />
            <Route path={`${path}connect`} component={Connections} />
            <Route path={`${path}mathart`} component={MathArt} />
            <Route path={`${path}world`} component={World} />
            <Route path={`${path}fluid`} component={Turb} />
            <Route path={`${path}ripple`} component={Ripple} />
            
          </div>
        </Router>
      </div>
    </div>
  )
}
export default App
