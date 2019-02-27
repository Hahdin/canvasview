# Canvasview

This is just a hobby app of mine that demonstrates various interesting visual displays. 

## Explosion
This demonstrates a simplistic implementation of some physics of an explosion.

## Volcano and Fireworks
An odd combination that evolved from following a tutorial. Ties in with the Explosion page.

## Kinematics
> the branch of mechanics concerned with the motion of objects without reference to the forces that cause the motion.

This traces the movement of a 3 armed rotation. You can adjust various aspects of the display. 
* play with the 'rate of change'

## Transformations
This displays the transformations that create the well known (to geeks like me at least) Barnsely Fern. You can adjust the various values and see what outcome you can come up with.

## Rotation
While we can all use a 3D library to acheive rotation display, I thought it would be interesting to figure out the math involved.

## The Forest
This arose from a simple "tree fractal" tutorial I found one day. It was anything but organic, so I played around with it until I got something that looked more like a real tree.

## Game of Life
> The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.

My implementation takes no user input. It starts with a random placement of "lives" and goes from there. To prevent it from stabilizing (that's boring) I added a random "evolution" of a life form to keep it interesting.


## Flock Off
This began with following a "flocking" [tutorial](https://www.blog.drewcutchins.com/blog/2018-8-16-flocking) and ended up with a few more variables to adjust. The defaults lead to a "tadpole" type flock/school and if you up the max velocity and increase the cohesion factor to 0.1, acts more like a swarm of flies. Play around and have fun.

## Math Art
This was something I made while working on a [project](https://www.powerlogger.com/steer.asp) that involved a lot of trig. I began simply attempting to visulize some of the functions.

## Fluid Simulator
My version of a popular javascript fluid simulator. The origins of this code was based on [Real-Time Fluid Dynamics for Games](http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf). Thanks to [Oliver Hunt](https://nerget.com/fluidSim/) and [This Guy](https://codepen.io/FWeinb/) for inspiration and doing the heavy lifting. 

### Some technical aspects.

Some may wonder why so may "dev" modules are included in the dependancies. This is a result of the method of deploying this app to [heroku.com](https://canvasview.herokuapp.com/). Since it requires the 'npm start' to fire it all up, some packages that normally would not be inculded in the dependencies for deployment (babel, webpack) are by necessity included. This deployment is by no means to be considered an appropriate production build, it is definitely 'dev' still.
