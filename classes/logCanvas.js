import lib from './lib'
export class logCanvas {
  constructor(props) {
    this.state = {
      innerWidth: 0,
      innerHeight: 0,
      ctx: null,
      canvas: null,
      logParams:{
        tracks: []
      },
      curves: []
    }
  }
  /**
   * Main entry
   */
  initLog(curves) {
    
    this.state.canvas = document.getElementById("canvas")
    this.state.innerHeight = this.state.canvas.innerHeight = this.state.canvas.height =window.innerHeight 
    this.state.innerWidth = this.state.canvas.innerWidth =this.state.canvas.width = window.innerWidth 
    this.state.ctx = this.state.canvas.getContext("2d")
    this.state.curves = curves
    //create the tracks
    this.createTracks()
  }

  createTracks(){
    //let tracks = []
    let leftEdge = 0
    let defaultWidth = 200
    this.state.curves.forEach(curve =>{
      let track = {
        l: leftEdge,
        r: leftEdge + defaultWidth,
        curve: curve
      }
      //tracks.push(track)
      this.createTrack(track)
      leftEdge += defaultWidth + 10
    })
  }
  createTrack(track){
    lib.lineTo(this.state.ctx, track.l, 0, track.l,  this.state.canvas.innerHeight )
    lib.lineTo(this.state.ctx, track.r, 0, track.r,  this.state.canvas.innerHeight )
    this.drawCurve(track)
  }

  drawCurve(track){
    let lScale = 0, rScale = 0
    let data = []
    track.curve.forEach(line =>{
      //console.log('line', line)
      if (line.length !== 2){
        return console.log('line missing data')
      }
      //since the values are depth(y axis) and value (x axis) remember its reversed 
      //collect all the data and set the scale accordingly

      let x = line[1], y = line[0]
      if (x < lScale)
        lScale = x
      if (x > rScale)
        rScale = x
      data.push({x,y})
    })
    //round Right scale for now to 10s
    rScale = Math.round(rScale / 10) * 10  + 10

    this.drawLinearCurve(data, lScale, rScale, track)
  }

  drawLinearCurve(data, l, r, track){
    let lastX = null, lastY = null
    data.forEach(point =>{
      console.log('points', point, l, r)
      //determine value position
      let pct = point.x / r * 100
      //start at pct with of track
      let trackWidth = track.r - track.l
      let x = track.l + (trackWidth / 100 * pct)
      let y = point.y * 5//scale factor - 10m = 10x5 px
      if (lastX === null){
        lastX = x
        lastY = y
        return
      }
      lib.lineTo(this.state.ctx, lastX, lastY, x , y )
      lastX = x, lastY = y
    })
  }

}
export default logCanvas

//lib.lineTo(this.state.ctx, track.l, 0, track.l,  this.state.canvas.innerHeight )