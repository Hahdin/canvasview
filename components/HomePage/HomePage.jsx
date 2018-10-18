import React from 'react';
import {
  NavItem,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
export const HomePage = ({...props}) => {
  return (
    <div>
      <div style={{
        backgroundColor: 'lightyellow',
        border: 'thick solid #AAAAFF',
        borderStyle: 'double',
        borderRadius: '25px',
        padding: '10px',
        boxShadow: '2px 2px 10px black'
      }}>
        <h1>CanvasViews</h1>
        <p>This is just a hobby app of mine that demonstrates various interesting visual displays created on the html canvas. </p>
        <div style={{
          backgroundColor: 'white',
          border: 'thick solid black',
          borderStyle: 'double',
          borderRadius: '25px',
          padding: '10px',
          boxShadow: '2px 2px 10px black'
        }}>
          <h2><LinkContainer to="/explosion"><NavItem>Explosion</NavItem></LinkContainer></h2>
          <p>This demonstrates a simplistic implementation of some physics of an explosion.</p>
          <h2><LinkContainer to="/math"><NavItem>Volcano and Fireworks</NavItem></LinkContainer></h2>
          <p>An odd combination that evolved from following a tutorial. Ties in with the Explosion page.</p>
          <h2><LinkContainer to="/kinematics"><NavItem>Kinematics</NavItem></LinkContainer></h2>
          <p><i>the branch of mechanics concerned with the motion of objects without reference to the forces that cause the motion.</i></p>
          <p>This traces the movement of a 3 armed rotation. You can adjust various aspects of the display. </p>
          * play with the 'rate of change'
          <h2><LinkContainer to="/transform"><NavItem>Transformations</NavItem></LinkContainer></h2>
          <p>This displays the transformations that create the well known (to geeks like me at least) Barnsely Fern. You can adjust the various values and see what outcome you can come up with.</p>
          <h2><LinkContainer to="/rotation"><NavItem>Rotation</NavItem></LinkContainer></h2>
          <p>While we can all use a 3D library to acheive rotation display, I thought it would be interesting to figure out the math involved.</p>
          <h2><LinkContainer to="/forrest"><NavItem>The Forest</NavItem></LinkContainer></h2>
          <p>This arose from a simple "tree fractal" tutorial I found one day. It was anything but organic, so I played around with it until I got something that looked more like a real tree.</p>
          <h2><LinkContainer to="/game"><NavItem>Game of Life</NavItem></LinkContainer></h2>
          <p>The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.</p>
          <p>My implementation takes no user input. It starts with a random placement of "lives" and goes from there. To prevent it from stabilizing (that's boring) I added a random "evolution" of a life form to keep it interesting.</p>
          <h2><LinkContainer to="/connect"><NavItem>Flock Off</NavItem></LinkContainer></h2>
          <p>This began with following a <a href='https://www.blog.drewcutchins.com/blog/2018-8-16-flocking'> "flocking example"</a> and ended up with a few more variables to adjust. The defaults lead to a "tadpole" type flock/school and if you up the max velocity and increase the cohesion factor to 0.1, acts more like a swarm of flies. Play around and have fun.</p>
          <h2><LinkContainer to="/mathart"><NavItem>Math Art</NavItem></LinkContainer></h2>
          <p>This was something I made while working on a project that involved a lot of trig. It began simply as an attempt to visulize some of the functions.</p>
        </div>
      </div>
    </div>
  );
}
export default { HomePage };