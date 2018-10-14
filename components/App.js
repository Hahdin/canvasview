import React, { Component } from 'react'
import MyHeader from '../containers/MyHeader'
import MathCanvas from '../containers/MathCanvas'
import LogCanvas from '../containers/LogCanvas'
import Kinematics from '../containers/Kinematics'
import Transform from '../containers/Transform'
import Rotate from '../containers/Rotation'
import TheForrest from '../containers/TheForrest'
import TheGame from '../containers/TheGame'
import Connections from '../containers/Connections'
import {  Route, Router } from "react-router-dom";
import { history } from '../helpers'
import { MyNavBar } from '../components/MyNavBar';
import { HomePage } from '../components/HomePage';

class App extends Component {
  constructor(props) {
    super(props);
    history.listen((location, action) => {
      // clear alert on location change
    });
  }
  render() {
    const { path } = this.props.match;
    // return (
    //   <div>
    //     <h1>Canvas Examples</h1>
    //     <div className="links" >
    //       <Link to={`/home/explosion`} className="link"> Explosion </Link>
    //       <Link to={`/home/math`} className="link"> Volcano and Fireworks </Link>
    //       <Link to={`/home/kinematics`} className="link"> Kinematics </Link>
    //       <Link to={`/home/transform`} className="link"> Transformations </Link>
    //       <Link to={`/home/rotation`} className="link"> Rotation </Link>
    //       <Link to={`/home/forrest`} className="link"> The Forrest </Link>
    //       <Link to={`/home/game`} className="link"> Game of Life </Link>
    //       <Link to={`/home/connect`} className="link"> Connections </Link>
    //     </div>
    //     <div className="tabs">
    //       <Switch>
    //         <Route path={`${path}/explosion`} exact component={LogCanvas} />
    //         <Route path={`${path}/math`} component={MathCanvas} />
    //         <Route path={`${path}/kinematics`} component={Kinematics} />
    //         <Route path={`${path}/transform`} component={Transform} />
    //         <Route path={`${path}/rotation`} component={Rotate} />
    //         <Route path={`${path}/forrest`} component={TheForrest} />
    //         <Route path={`${path}/game`} component={TheGame} />
    //         <Route path={`${path}/connect`} component={Connections} />
    //       </Switch>
    //     </div>
    //   </div>
    // );
    return (
      <div className='container '>
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
          </div>
        </Router>
      </div>
    </div>
)
  }
}
export default App 
