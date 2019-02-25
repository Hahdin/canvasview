export const lib = {
  drawSphere: (ctx, point, radius, fill = true, stroke = true) =>{
      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, Math.PI * 2, false)
      if (fill) ctx.fill()
      if (stroke) ctx.stroke()
  },
  lineTo : (ctx, x1,y1, x2, y2) =>{
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  },
  drawRect(ctx, x, y, w, h, fill = true, stroke = true){
    ctx.beginPath()

    //ctx.drawRect(x,y,w,h)
    if ( fill) ctx.fillRect(x-w/2, y-h/2, w, h)
    if ( stroke) ctx.strokeRect(x-w/2, y-h/2, w, h)
  },
  cvFade: (ctx, color, w, h) => {
    let old = ctx.shadowColor
    let oldComp = ctx.globalCompositeOperation
    ctx.shadowColor = color
    ctx.globalCompositeOperation = "source-over"
    ctx.fillStyle = color
    ctx.fillRect(0, 0, w,h)
    //restore old shadow
    ctx.shadowColor = old
    ctx.globalCompositeOperation = oldComp
  },
  get_hsla: () => {
    return "hsla(" + Math.round(Math.random() * 360) + ", " +
      Math.round(80 + Math.random() * 20) + "%," +
      Math.round(50 + Math.random() * 50) + "%, " +
      (0.5 + Math.random() * 0.5) + ")";
  },
  get_colors: () => {
    let r = Math.round(Math.random() * 255)
    let g = Math.round(Math.random() * 255)
    let b = Math.round(Math.random() * 255)
    let a = Math.round(Math.random())
    a = 0.8
    let c1 = `rgba(${r},${g},${b},${a} )`
    let c2 = `rgba(${255 - r},${255 - g},${255 - b},${a} )`
    return { c1, c2 }
  },
  getRainbow: (c, op)=> {
    //roygbv
    let inc = 0.142857
    return c < inc ? `rgba(${255},${0},${0},${op})` :
      c < inc * 2 ? `rgba(${255},${128},${0},${op})` :
        c < inc * 3 ? `rgba(${255},${255},${0},${op})` :
          c < inc * 4 ? `rgba(${0},${255},${0},${op})` :
            c < inc * 6 ? `rgba(${0},${128},${255},${op})` : `rgba(${255},${0},${255},${op})`

  },

  getRandomColor(op) {
    return `rgba(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()},${op})`
  },
  calcGravity(dist, gravity, radius) {
    //let sg = 9.80665
    //let er = 6371.008
    return gravity * ((radius / (radius + dist)) ** 2)
  },

  getRgb:() =>{
    return `rgb(${Math.round(Math.random() * 255)},  
    ${Math.round(Math.random() * 255)},  
    ${Math.round(Math.random() * 255)})`
  },
  _fill: (ctx,color, x, y, width, height) =>{
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
  },
  normalizeVector(vector){
    let mag = Math.abs(Math.sqrt((vector.x ** 2) + (vector.y ** 2)))
    mag = mag === 0 ? 1 : mag
    return {
      x: vector.x / mag,
      y: vector.y / mag,
    }
  },
  getVector(from, to) {
    let diffX = to.x - from.x
    let diffY = to.y - from.y
    let mag = Math.abs(Math.sqrt((diffX ** 2) + (diffY ** 2)))
    mag = mag === 0 ? 1 : mag
    let normalized = {
      x: diffX / mag,
      y: diffY / mag,
    }
    return normalized

  },
  getDistance(posA, posB){
    if (!posA || !posB){
      console.log('fail')
      return
    }
    return Math.abs(Math.sqrt(((posA.x - posB.x) ** 2) + ((posA.y - posB.y) ** 2)))
  },
  intersects(a, b, c, d, p, q, r, s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  },
  getTopLeftCanvas (canvas) {
    let dom = canvas
    let domP = dom.offsetParent
    return {
      top: dom.offsetTop + domP.offsetTop + domP.clientTop - window.scrollY,
      left: dom.offsetLeft + domP.offsetLeft + domP.clientLeft - window.scrollX
    }
  }
}


export default lib

