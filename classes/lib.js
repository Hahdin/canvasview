export default {
  drawSphere: (ctx, point, radius) =>{
      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, Math.PI * 2, false)
      ctx.fill();
  },
  lineTo : (ctx, x1,y1, x2, y2) =>{
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
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
  _fill: (ctx,color, x, y, width, height) =>{
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
  },
}

